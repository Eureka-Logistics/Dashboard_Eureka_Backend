const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * SUB-SCHEMAS
 */
const FamilySchema = new Schema({
  type: String,
  name: String,
  gender: String,
  age: String,
  education: String,
  position: String,
  job: String,
  company: String,
  notes: String,
}, { _id: false });

const EducationSchema = new Schema({
  level: String,
  school_name: String,
  location: String,
  graduation_year: String,
  gpa: String,
  major: String,
}, { _id: false });

const WorkHistorySchema = new Schema({
  entry_date: Date,
  exit_date: Date,
  position: String,
  company: String,
  address_phone: String,
  notes: String,
}, { _id: false });

const CourseSchema = new Schema({
  instructor_institution: String,
  location: String,
  duration: String,
  funded_by: String,
  notes: String,
}, { _id: false });

const SocialActivitySchema = new Schema({
  organization: String,
  position: String,
  period: String,
  description: String,
}, { _id: false });

const EmergencyRelationSchema = new Schema({
  name: String,
  age: String,
  address: String,
  phone: String,
  relationship: String,
  notes: String,
}, { _id: false });

const RelationSchema = new Schema({
  name: String,
  age: String,
  address: String,
  phone: String,
  relationship: String,
  notes: String,
}, { _id: false });

/**
 * EMPLOYEE SCHEMA
 */
const EmployeeSchema = new Schema({
  // BASIC INFO
  emp_id: { type: String, unique: true },
  employee_code: String,
  employee_id: String,
  full_name: { type: String, required: true },
  first_name: String,
  middle_name: String,
  last_name: String,
  sex: { type: String, enum: ['Male', 'Female'] },
  gender: String,
  birth_date: Date,
  birth_place: String,
  religion: String,
  marital_status: String,
  marital_date: Date,
  employment_status: String,
  seniority_date: Date,
  mother_maiden_name: String,
  ethnicity: String,
  age: String,
  height_cm: String,
  weight_kg: String,
  phone: String,
  no_telp: String,
  mobile_phone: String,
  alt_mobile_phone: String,
  email: { type: String, unique: true },
  previous_email: String,
  corporate_email: String,

  // ADDRESS
  address: String,
  street: String,
  subdistrict: String,
  rt: String,
  rw: String,
  postal_code: String,
  city: String,
  county: String,
  province: String,
  country: String,
  location_id: String,
  id_subdistrict: String,
  id_city: String,
  id_province: String,
  id_region: String,

  // JOB INFO
  id_department: { type: Schema.Types.ObjectId, ref: 'Department' },
  id_designation: { type: Schema.Types.ObjectId, ref: 'Designation' },
  id_job_level: { type: Schema.Types.ObjectId, ref: 'JobLevel' },
  id_bu: { type: Schema.Types.ObjectId, ref: 'BU' },
  id_office: { type: Schema.Types.ObjectId, ref: 'Office' },
  department: String,
  position: String,
  organization: String,
  composition: String,
  position_group: String,
  employee_group: String,
  education_group: String,
  business_unit: String,
  branch_id: String,
  branch_name: String,
  region: String,
  office_type: String,

  // BENEFITS
  bpjs_tk: String,
  bpjs_kes: String,
  bpjs_pensiun_no: String,
  company_insurance_no: String,
  lspsi: Number,
  lkoperasi: Number,
  lsbsi: Number,
  lspn: Number,

  // TAX
  tax_category: String,
  pph21: Number,
  tax_id: String,
  payroll_seniority: Date,
  salary_scale_date: Date,
  year_tax_point_15: String,
  year_tax_point_20: String,

  // HR FLAGS
  pakta_integritas_2025: Number,
  rahasia_perusahaan_2025: Number,
  update_data_karyawan_2025: Date,
  penjamin: String,
  update_penjamin_2025: Date,
  scan_biodata: Number,
  screening_sdm: Number,
  vehicle_and_facility: Number,
  toll_fee: String,
  distance_km: String,

  // HISTORY
  last_job_reason_leave: String,
  last_job_salary: String,
  last_job_benefits: String,
  job_most_liked: String,
  job_least_liked: String,
  hobby: String,
  sport: String,
  sport_desc: String,
  free_time: String,
  reading_hours: String,
  reading_topics: String,
  newspaper: String,
  magazine: String,

  // APPLICATION
  apply_reason: String,
  apply_initiator: String,
  apply_initiator_note: String,
  desired_position: String,
  expected_salary: String,
  expected_benefits: String,
  skills: String,

  // HEALTH
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
  last_checkup: Date,
  strength: String,
  weakness: String,

  // ARRAYS
  family_data: [FamilySchema],
  education_data: [EducationSchema],
  work_history_data: [WorkHistorySchema],
  courses_data: [CourseSchema],
  social_activities_data: [SocialActivitySchema],
  emergency_relations_data: [EmergencyRelationSchema],
  former_relations_data: [RelationSchema],
  guarantors_data: [RelationSchema],

  // META
  grade: String,
  points: { type: Number, default: 0 },
  is_active: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  date_added: { type: Date, default: Date.now },
  date_modified: Date,
  photo: String,
});

module.exports = mongoose.model('Employee', EmployeeSchema);
