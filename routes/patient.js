const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
// Resolve base uploads directory from env, defaulting to project public/uploads
const uploadBasePath = process.env.UPLOAD_PATH
    ? path.resolve(process.cwd(), process.env.UPLOAD_PATH)
    : path.join(__dirname, '..', 'public', 'uploads');
const prescriptionsPath = path.join(uploadBasePath, 'prescriptions');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, prescriptionsPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Patient registration page
router.get('/register', (req, res) => {
    res.render('patient/register');
});

// Patient login page
router.get('/login', (req, res) => {
    res.render('patient/login');
});

// Patient registration
router.post('/register', async (req, res) => {
    try {
        const { name, phoneNumber, aadhaarNumber, gender, age } = req.body;
        
        // Check if patient already exists
        const existingPatient = await Patient.findOne({ 
            $or: [{ phoneNumber }, { aadhaarNumber }] 
        });
        
        if (existingPatient) {
            req.flash('error', 'Patient already exists with this phone number or Aadhaar number');
            return res.redirect('/patient/register');
        }
        
        const patient = new Patient({
            name,
            phoneNumber,
            aadhaarNumber,
            gender,
            age
        });
        
        await patient.save();
        req.session.patientId = patient._id;
        req.flash('success', 'Registration successful!');
        res.redirect('/patient/dashboard');
    } catch (error) {
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/patient/register');
    }
});

// Patient login
router.post('/login', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const patient = await Patient.findOne({ phoneNumber });
        
        if (!patient) {
            req.flash('error', 'Invalid phone number');
            return res.redirect('/patient/login');
        }
        
        req.session.patientId = patient._id;
        req.flash('success', 'Login successful!');
        res.redirect('/patient/dashboard');
    } catch (error) {
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/patient/login');
    }
});

// Patient dashboard
router.get('/dashboard', async (req, res) => {
    if (!req.session.patientId) {
        req.flash('error', 'Please login first');
        return res.redirect('/patient/login');
    }
    
    try {
        const patient = await Patient.findById(req.session.patientId);
        res.render('patient/dashboard', { patient });
    } catch (error) {
        req.flash('error', 'Error loading dashboard');
        res.redirect('/patient/login');
    }
});

// Patient home page
router.get('/home', async (req, res) => {
    if (!req.session.patientId) {
        req.flash('error', 'Please login first');
        return res.redirect('/patient/login');
    }
    
    try {
        const patient = await Patient.findById(req.session.patientId);
        const doctors = await Doctor.find({});
        res.render('patient/home', { patient, doctors });
    } catch (error) {
        req.flash('error', 'Error loading home page');
        res.redirect('/patient/login');
    }
});

// Video call page
router.get('/video-call', async (req, res) => {
    if (!req.session.patientId) {
        req.flash('error', 'Please login first');
        return res.redirect('/patient/login');
    }
    
    try {
        const patient = await Patient.findById(req.session.patientId);
        res.render('patient/video-call', { patient });
    } catch (error) {
        req.flash('error', 'Error loading video call page');
        res.redirect('/patient/home');
    }
});

// Chat page
router.get('/chat', async (req, res) => {
    if (!req.session.patientId) {
        req.flash('error', 'Please login first');
        return res.redirect('/patient/login');
    }

    try {
        const patient = await Patient.findById(req.session.patientId);
        res.render('patient/chat', { patient });
    } catch (error) {
        req.flash('error', 'Error loading chat page');
        res.redirect('/patient/home');
    }
});

// Update health issue
router.post('/update-health-issue', async (req, res) => {
    if (!req.session.patientId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
        const { healthIssue } = req.body;
        await Patient.findByIdAndUpdate(req.session.patientId, {
            currentHealthIssue: healthIssue
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update health issue' });
    }
});

// Upload prescription
router.post('/upload-prescription', upload.single('prescription'), async (req, res) => {
    if (!req.session.patientId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const patient = await Patient.findById(req.session.patientId);
        patient.prescriptions.push({
            filename: req.file.filename,
            originalName: req.file.originalname
        });
        await patient.save();
        
        res.json({ success: true, message: 'Prescription uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload prescription' });
    }
});

// Book appointment
router.post('/book-appointment', async (req, res) => {
    if (!req.session.patientId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
        const { doctorId, appointmentDate, notes } = req.body;
        const doctor = await Doctor.findById(doctorId);
        
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        
        const patient = await Patient.findById(req.session.patientId);
        patient.appointments.push({
            doctorId,
            doctorName: doctor.name,
            specialization: doctor.specialization,
            appointmentDate: new Date(appointmentDate),
            notes
        });
        
        doctor.patients.push({
            patientId: patient._id,
            patientName: patient.name,
            appointmentDate: new Date(appointmentDate),
            status: 'Active'
        });
        
        await patient.save();
        await doctor.save();
        
        res.json({ success: true, message: 'Appointment booked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});

// Patient logout
router.get('/logout', (req, res) => {
    req.session.patientId = null;
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
});

module.exports = router;
