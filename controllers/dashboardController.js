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

    // Education distribution: determine highest degree per employee (SMA, S1, S2, S3)
    const eduAgg = await Employee.aggregate([
      { $unwind: { path: '$education_data', preserveNullAndEmptyArrays: true } },
      { $project: { employee: '$_id', level: { $toLower: '$education_data.level' } } },
      {
        $project: {
          employee: 1,
          weight: {
            $switch: {
              branches: [
                { case: { $in: ['$level', ['sma', 'smk']] }, then: 1 },
                { case: { $eq: ['$level', 's1'] }, then: 2 },
                { case: { $eq: ['$level', 's2'] }, then: 3 },
                { case: { $eq: ['$level', 's3'] }, then: 4 },
              ],
              default: 0,
            }
          }
        }
      },
      { $group: { _id: '$employee', maxWeight: { $max: '$weight' } } },
      { $group: { _id: '$maxWeight', count: { $sum: 1 } } },
    ]);
    const pendidikan = { sma: 0, s1: 0, s2: 0, s3: 0 };
    for (const e of eduAgg) {
      switch (e._id) {
        case 1: pendidikan.sma += e.count; break;
        case 2: pendidikan.s1 += e.count; break;
        case 3: pendidikan.s2 += e.count; break;
        case 4: pendidikan.s3 += e.count; break;
        default: break; // ignore unknown levels
      }
    }

    // Age range distribution (<30, 30-40, 41-50, >50)
    const birthDates = await Employee.find({ birth_date: { $ne: null } }, { birth_date: 1 }).lean();
    const rentangUsia = { '<30': 0, '30-40': 0, '41-50': 0, '>50': 0 };
    for (const emp of birthDates) {
      const age = calcAgeYears(emp.birth_date);
      if (age == null) continue;
      if (age < 30) rentangUsia['<30']++;
      else if (age <= 40) rentangUsia['30-40']++;
      else if (age <= 50) rentangUsia['41-50']++;
      else rentangUsia['>50']++;
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