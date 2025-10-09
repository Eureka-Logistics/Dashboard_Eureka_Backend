// middlewares/processformdata_to_json.js
const processFormDataToJson = (req, res, next) => {
  try {
    // default dates
    if (!req.body.date_added) {
      req.body.date_added = new Date().toISOString().split('T')[0];
    }
    req.body.date_modified = new Date().toISOString().split('T')[0];

    // parse JSON string array fields
    const arrayFields = [
      'family_data',
      'education_data',
      'work_history_data',
      'courses_data',
      'social_activities_data',
      'emergency_relations_data',
      'former_relations_data',
      'guarantors_data'
    ];

    arrayFields.forEach(field => {
      if (req.body[field]) {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          // kalau bukan JSON valid, biarkan tetap string
          console.warn(`⚠️ Gagal parse field ${field}, tetap string`);
        }
      }
    });

    if (req.file) {
      req.body.file_name = req.file.filename;
    }

    next();
  } catch (error) {
    console.error('Error processing form-data:', error);
    return res.status(400).json({
      error: 'Gagal memproses form-data.',
      details: error.message
    });
  }
};

module.exports = processFormDataToJson;
