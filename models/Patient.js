const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 120
    },
    currentHealthIssue: {
        type: String,
        default: ''
    },
    prescriptions: [{
        filename: String,
        originalName: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    appointments: [{
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor'
        },
        doctorName: String,
        specialization: String,
        appointmentDate: Date,
        status: {
            type: String,
            enum: ['Scheduled', 'Completed', 'Cancelled'],
            default: 'Scheduled'
        },
        notes: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash phone number for password (simple implementation)
patientSchema.pre('save', async function(next) {
    if (!this.isModified('phoneNumber')) return next();
    this.phoneNumber = await bcrypt.hash(this.phoneNumber, 12);
    next();
});

module.exports = mongoose.model('Patient', patientSchema);
