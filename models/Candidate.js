const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * SUB-SCHEMAS FOR CANDIDATE
 */
const WorkHistorySchema = new Schema({
  masuk: String,
  keluar: String,
  jabatan: String,
  perusahaan: String,
  keterangan: String,
  alamat_telp: String,
}, { _id: false });

const SocialActivitySchema = new Schema({
  tahun: String,
  jenis_aktivitas: String,
  jabatan: String,
  organisasi: String,
}, { _id: false });

const FamilyMemberSchema = new Schema({
  jenis: String,
  nama: String,
  gender: String,
  usia: String,
  pendidikan_terakhir: String,
  pekerjaan: String,
  jabatan: String,
  perusahaan: String,
  keterangan: String,
}, { _id: false });

const EducationSchema = new Schema({
  jenjang: String,
  nama_sekolah: String,
  tempat: String,
  tahun_lulus: String,
  rata_rata_nilai: String,
  jurusan: String,
}, { _id: false });

const CourseSchema = new Schema({
  instruktur_lembaga: String,
  tempat: String,
  lama_pendidikan: String,
  yang_membiayai: String,
  keterangan: String,
}, { _id: false });

const EmergencyRelationSchema = new Schema({
  nama: String,
  usia: String,
  alamat: String,
  no_telepon: String,
  hubungan: String,
  keterangan: String,
}, { _id: false });

const FormerRelationSchema = new Schema({
  nama: String,
  usia: String,
  alamat: String,
  no_telepon: String,
  hubungan: String,
  keterangan: String,
}, { _id: false });

const GuarantorSchema = new Schema({
  nama: String,
  usia: String,
  alamat: String,
  no_telepon: String,
  hubungan: String,
  keterangan: String,
}, { _id: false });

/**
 * CANDIDATE SCHEMA
 */
const CandidateSchema = new Schema({
  // PERSONAL DATA
  personalData: {
    full_name: { type: String, required: true },
    gender: String,
    birth_place: String,
    birth_date: String,
    religion: String,
    ethnicity: String,
    age: String,
    height_cm: String,
    weight_kg: String,
    address: String,
    phone: String,
    id_number: String,
    id_region: String,
    living_status: String,
    vehicle_type: String,
    vehicle_ownership: String,
    best_achievement: String,
    best_achievement_desc: String,
    worst_achievement: String,
    worst_achievement_desc: String,
    language_active: String,
    language_passive: String,
    education_sponsor: String,
    scholarship: String,
    scholarship_duration: String,
    scholarship_desc: String,
    influence_source: String,
    influence_note: String,
    publication: String,
    highschool_avg_score: String,
    highschool_subject_count: String,
    gpa: String,
    gpa_max: String,
    photo: String,
  },

  // HISTORY
  history: {
    last_job_reason_leave: String,
    last_job_salary: String,
    last_job_benefits: String,
    job_most_liked: String,
    job_least_liked: String,
    hobby: String,
    sport: Number,
    sport_desc: String,
    free_time: String,
    reading_hours: String,
    reading_topics: String,
    newspaper: String,
    magazine: String,
  },

  // WORK HISTORY
  workHistory: [WorkHistorySchema],

  // SOCIAL ACTIVITIES
  socialActivities: [SocialActivitySchema],

  // FAMILY
  family: {
    marital_status: String,
    marriage_date: String,
    marriage_count: Number,
    members: [FamilyMemberSchema],
  },

  // APPLICATION SKILLS
  applicationSkills: {
    apply_reason: String,
    apply_initiator: String,
    apply_initiator_note: String,
    desired_position: String,
    expected_salary: String,
    expected_benefits: String,
    skills: String,
    willing_medical: Number,
    willing_psychology: Number,
    willing_relocate: Number,
    willing_trial: Number,
    willing_transfer: Number,
    willing_rules: Number,
    computer_skill: Number,
    computer_programs: String,
    typing_level: String,
    driving_ability: String,
    vehicle_knowledge: Number,
  },

  // EDUCATION
  education: [EducationSchema],

  // COURSES
  courses: [CourseSchema],

  // GENERAL HEALTH
  generalHealth: {
    willing_original_certificate: Number,
    allow_contact_employer: Number,
    ever_fired: Number,
    decision_advice_source: String,
    decision_advice_note: String,
    personal_advice_source: String,
    personal_advice_note: String,
    reaction_to_criticism: String,
    common_illness: String,
    serious_illness: Number,
    serious_illness_desc: String,
    eye_disease: Number,
    lung_disease: Number,
    ear_disease: Number,
    diabetes: Number,
    hypertension: Number,
    heart_disease: Number,
    last_checkup: String,
    strength: String,
    weakness: String,
  },

  // OTHERS
  others: {
    emergency_relations: [EmergencyRelationSchema],
    former_relations: [FormerRelationSchema],
    guarantors: [GuarantorSchema],
  },

  // APPLICATION STATUS
  applicationStatus: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Pending', 'Accepted', 'Rejected'], 
    default: 'Active' 
  },
  applicationDate: String,
  interviewDate: String,
  interviewStatus: { 
    type: String, 
    enum: ['Pending', 'Scheduled', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },

  // META
  date_added: { type: Date, default: Date.now },
  date_modified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Candidate', CandidateSchema);
