const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Doctor registration page
router.get('/register', (req, res) => {
    res.render('doctor/register');
});

// Doctor login page
router.get('/login', (req, res) => {
    res.render('doctor/login');
});

// Doctor registration
router.post('/register', async (req, res) => {
    try {
        const { name, age, gender, phoneNumber, yearsOfExperience, uid, specialization } = req.body;
        
        // Check if doctor already exists
        const existingDoctor = await Doctor.findOne({ 
            $or: [{ phoneNumber }, { uid }] 
        });
        
        if (existingDoctor) {
            req.flash('error', 'Doctor already exists with this phone number or UID');
            return res.redirect('/doctor/register');
        }
        
        const doctor = new Doctor({
            name,
            age,
            gender,
            phoneNumber,
            yearsOfExperience,
            uid,
            specialization
        });
        
        await doctor.save();
        req.session.doctorId = doctor._id;
        req.flash('success', 'Registration successful!');
        res.redirect('/doctor/dashboard');
    } catch (error) {
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/doctor/register');
    }
});

// Doctor login
router.post('/login', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const doctor = await Doctor.findOne({ phoneNumber });
        
        if (!doctor) {
            req.flash('error', 'Invalid phone number');
            return res.redirect('/doctor/login');
        }
        
        req.session.doctorId = doctor._id;
        req.flash('success', 'Login successful!');
        res.redirect('/doctor/dashboard');
    } catch (error) {
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/doctor/login');
    }
});

// Doctor dashboard
router.get('/dashboard', async (req, res) => {
    if (!req.session.doctorId) {
        req.flash('error', 'Please login first');
        return res.redirect('/doctor/login');
    }
    
    try {
        const doctor = await Doctor.findById(req.session.doctorId).populate('patients.patientId');
        res.render('doctor/dashboard', { doctor });
    } catch (error) {
        req.flash('error', 'Error loading dashboard');
        res.redirect('/doctor/login');
    }
});

// Doctor video call page
router.get('/video-call', async (req, res) => {
    if (!req.session.doctorId) {
        req.flash('error', 'Please login first');
        return res.redirect('/doctor/login');
    }

    try {
        const doctor = await Doctor.findById(req.session.doctorId);
        res.render('doctor/video-call', { doctor });
    } catch (error) {
        req.flash('error', 'Error loading video call page');
        res.redirect('/doctor/dashboard');
    }
});

// Write digital prescription
router.post('/write-prescription', async (req, res) => {
    if (!req.session.doctorId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
        const { patientId, prescription } = req.body;
        const patient = await Patient.findById(patientId);
        
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        
        const doctor = await Doctor.findById(req.session.doctorId);
        doctor.digitalPrescriptions.push({
            patientId,
            patientName: patient.name,
            prescription
        });
        
        await doctor.save();
        res.json({ success: true, message: 'Prescription written successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to write prescription' });
    }
});

// Update schedule
router.post('/update-schedule', async (req, res) => {
    if (!req.session.doctorId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
        const { schedule } = req.body;
        await Doctor.findByIdAndUpdate(req.session.doctorId, { schedule });
        res.json({ success: true, message: 'Schedule updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update schedule' });
    }
});

// Doctor logout
router.get('/logout', (req, res) => {
    req.session.doctorId = null;
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
});


module.exports = router;
