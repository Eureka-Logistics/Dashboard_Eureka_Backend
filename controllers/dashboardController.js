const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// Helper to compute age in years
function calcAgeYears(d) {
  if (!d) return null;
  const now = new Date();
  const dob = new Date(d);
  if (isNaN(dob.getTime())) return null;
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

// Normalize education string to one of sma, d3, s1, s2, s3 or null
function normalizeEdu(raw) {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  if (['sma', 'smk', 'ma', 'paket c', 'high school'].some(k => s.includes(k))) return 'sma';
  if (['d3', 'diploma 3', 'diploma iii', 'polytechnic'].some(k => s.includes(k))) return 'd3';
  if (['s1', 'sarjana', 'strata satu', 'bachelor'].some(k => s.includes(k))) return 's1';
  if (['s2', 'magister', 'master', 'strata dua'].some(k => s.includes(k))) return 's2';
  if (['s3', 'doktor', 'doctorate', 'phd', 'strata tiga'].some(k => s.includes(k))) return 's3';
  return null;
}

// Ordinal precedence: sma < d3 < s1 < s2 < s3
function eduOrdinal(level) {
  switch (level) {
    case 'sma': return 1;
    case 'd3': return 2;
    case 's1': return 3;
    case 's2': return 4;
    case 's3': return 5;
    default: return 0;
  }
}

exports.getDashboardMetrics = async (req, res) => {
  try {
    // Total employees and by gender
    const [totalEmployees, maleEmployees, femaleEmployees] = await Promise.all([
      Employee.countDocuments({}),
      Employee.countDocuments({ sex: 'Male' }),
      Employee.countDocuments({ sex: 'Female' }),
    ]);

    // Status counts
    const [activeEmployees, inactiveEmployees] = await Promise.all([
      Employee.countDocuments({ is_active: 'Active' }),
      Employee.countDocuments({ is_active: 'Inactive' }),
    ]);

    // Employees per BU (target list)
    const targetBUs = ['raja cepat', 'logistics', 'bookhouse', 'master diskon', 'kata rasa'];
    const normalizeBU = (name) => {
      if (!name) return null;
      const key = String(name).toLowerCase();
      if (key.includes('raja') && key.includes('cepat')) return 'raja cepat';
      if (key.includes('logistik') || key.includes('logistic')) return 'logistics';
      if (key.includes('book') && key.includes('house')) return 'bookhouse';
      if (key.includes('master') && (key.includes('diskon') || key.includes('discount'))) return 'master diskon';
      if (key.includes('kata') && key.includes('rasa')) return 'kata rasa';
      return null;
    };
    const buAgg = await Employee.aggregate([
      { $match: { id_bu: { $ne: null } } },
      { $group: { _id: '$id_bu', count: { $sum: 1 } } },
      { $lookup: { from: 'bus', localField: '_id', foreignField: '_id', as: 'bu' } },
      { $unwind: { path: '$bu', preserveNullAndEmptyArrays: true } },
      { $project: { name: '$bu.bu_name', count: 1 } },
    ]);
    const karyawanPerBU = targetBUs.reduce((acc, key) => { acc[key] = 0; return acc; }, {});
    for (const item of buAgg) {
      if (!item || !item.name) continue;
      const mapped = normalizeBU(item.name);
      if (mapped && (mapped in karyawanPerBU)) {
        karyawanPerBU[mapped] += item.count || 0;
      }
    }

    // Department distribution
    const deptAgg = await Employee.aggregate([
      { $match: { id_department: { $ne: null } } },
      { $group: { _id: '$id_department', count: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
      { $project: { name: '$dept.department_name', count: 1 } },
      { $sort: { count: -1 } },
    ]);
    const distribusiDepartemen = deptAgg
      .filter(d => d && d.name)
      .map(d => ({ name: d.name, count: d.count }));

    // BPJS participation (has vs missing)
    const bpjsAgg = await Employee.aggregate([
      {
        $group: {
          _id: null,
          tk_has: { $sum: { $cond: [{ $and: [{ $ne: ['$bpjs_tk', null] }, { $ne: ['$bpjs_tk', ''] }] }, 1, 0] } },
          tk_missing: { $sum: { $cond: [{ $or: [{ $eq: ['$bpjs_tk', null] }, { $eq: ['$bpjs_tk', ''] }] }, 1, 0] } },
          kes_has: { $sum: { $cond: [{ $and: [{ $ne: ['$bpjs_kes', null] }, { $ne: ['$bpjs_kes', ''] }] }, 1, 0] } },
          kes_missing: { $sum: { $cond: [{ $or: [{ $eq: ['$bpjs_kes', null] }, { $eq: ['$bpjs_kes', ''] }] }, 1, 0] } },
        }
      }
    ]);
    const bpjs = {
      tk: { sudah: bpjsAgg[0]?.tk_has || 0, belum: bpjsAgg[0]?.tk_missing || 0 },
      kes: { sudah: bpjsAgg[0]?.kes_has || 0, belum: bpjsAgg[0]?.kes_missing || 0 },
    };

    // Education and Age distribution using robust normalization
    const peopleEduAge = await Employee.find({}, { education_data: 1, education: 1, birth_date: 1, age: 1 }).lean();
    const pendidikan = { sma: 0, d3: 0, s1: 0, s2: 0, s3: 0 };
    const rentangUsia = { '<30': 0, '30-40': 0, '41-50': 0, '>50': 0 };

    for (const p of peopleEduAge) {
      // Determine highest education per person
      let maxW = 0;
      let bestLevel = null;
      // from array
      if (Array.isArray(p.education_data)) {
        for (const ed of p.education_data) {
          const lvl = normalizeEdu(ed?.level);
          const ord = eduOrdinal(lvl);
          if (ord > maxW) { maxW = ord; bestLevel = lvl; }
        }
      }
      // also consider top-level field to possibly upgrade
      if (p.education) {
        const lvl = normalizeEdu(p.education);
        const ord = eduOrdinal(lvl);
        if (ord > maxW) { maxW = ord; bestLevel = lvl; }
      }
      if (bestLevel) {
        if (pendidikan[bestLevel] != null) pendidikan[bestLevel]++;
      }

      // Age bucket
      let a = null;
      if (p.birth_date) a = calcAgeYears(p.birth_date);
      if (a == null && p.age != null) {
        const parsed = parseInt(String(p.age).replace(/[^0-9-]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) a = parsed;
      }
      if (a != null) {
        if (a < 30) rentangUsia['<30']++;
        else if (a <= 40) rentangUsia['30-40']++;
        else if (a <= 50) rentangUsia['41-50']++;
        else rentangUsia['>50']++;
      }
    }

    return res.status(200).json({
      total_karyawan: totalEmployees,
      total_karyawan_laki_laki: maleEmployees,
      total_karyawan_perempuan: femaleEmployees,
      karyawan_per_bu: karyawanPerBU,
      distribusi_departemen: distribusiDepartemen,
      status_karyawan: { Active: activeEmployees, Inactive: inactiveEmployees },
      bpjs,
      pendidikan,
      rentang_usia: rentangUsia,
    });
  } catch (error) {
    console.error('Error generating dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to generate dashboard metrics' });
  }
};