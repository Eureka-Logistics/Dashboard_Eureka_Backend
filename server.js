require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const documentRoutes = require('./routes/documentRoutes');
const documentCategoryRoutes = require('./routes/documentCategoryRoutes');
const cabinetRoutes = require('./routes/cabinetRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const designationRoutes = require('./routes/designationRoutes');
const jobLevelRoutes = require('./routes/jobLevelRoutes');
const buRoutes = require('./routes/buRoutes');
const officeRoutes = require('./routes/officeRoutes');
const jobLevelDescriptionRoutes = require('./routes/jobLevelDescriptionRoutes');
const customerRoutes = require('./routes/customerRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const commentRoutes = require('./routes/comments');
const documentHistoryRoutes = require('./routes/documentHistory');
const jobpositionRoutes = require('./routes/jobPositions');
const candidateRoutes = require('./routes/candidateRoutes');

const app = express();
const PORT = process.env.PORT || 3344;

// Koneksi ke database
connectDB();

// Middleware keamanan tambahan
app.use(cors({ origin: '*' })); // Izinkan semua origin, sesuaikan jika ingin spesifik
app.set('trust proxy', 1);
app.use(helmet());
app.use(mongoSanitize());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000 // Batas request per IP
}));

app.use(express.json());

// Mengatur Content-Security-Policy
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; connect-src 'self' api.example.com; style-src 'self' fonts.googleapis.com; font-src 'self' fonts.gstatic.com;"
  );
  next();
});

// Routes untuk berbagai endpoint
app.use('/documents', documentRoutes);
app.use('/document-categories', documentCategoryRoutes);
app.use('/cabinets', cabinetRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Mengakses file statis di folder 'uploads'
app.use('/department', departmentRoutes);
app.use('/designation', designationRoutes);
app.use('/joblevel', jobLevelRoutes);
app.use('/bu', buRoutes);
app.use('/office', officeRoutes);
app.use('/jobleveldescription', jobLevelDescriptionRoutes);
app.use('/employee', employeeRoutes);
app.use('/customers', customerRoutes);
app.use('/vendor', vendorRoutes);
app.use('/comments', commentRoutes);
app.use('/document-history', documentHistoryRoutes);
app.use('/job-positions', jobpositionRoutes);
app.use('/candidates', candidateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
