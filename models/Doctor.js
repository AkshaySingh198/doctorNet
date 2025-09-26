const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 25,
        max: 80
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    yearsOfExperience: {
        type: Number,
        required: true,
        min: 0
    },
    uid: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    patients: [{
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        },
        patientName: String,
        appointmentDate: Date,
        status: {
            type: String,
            enum: ['Active', 'Completed', 'Cancelled'],
            default: 'Active'
        }
    }],
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String,
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    digitalPrescriptions: [{
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        },
        patientName: String,
        prescription: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash phone number for password (simple implementation)
doctorSchema.pre('save', async function(next) {
    if (!this.isModified('phoneNumber')) return next();
    this.phoneNumber = await bcrypt.hash(this.phoneNumber, 12);
    next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
