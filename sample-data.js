// Sample data for TeleMed Platform
// Run this script to populate the database with sample data

const mongoose = require('mongoose');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/telemedicine', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const samplePatients = [
    {
        name: 'Rajesh Kumar',
        phoneNumber: '9876543210',
        aadhaarNumber: '123456789012',
        gender: 'Male',
        age: 35,
        currentHealthIssue: 'Persistent cough and chest congestion for the past week',
        prescriptions: [
            {
                filename: 'prescription-001.pdf',
                originalName: 'Chest X-ray Report.pdf',
                uploadDate: new Date('2024-01-15')
            }
        ],
        appointments: [
            {
                doctorId: null, // Will be set after doctor creation
                doctorName: 'Dr. Priya Sharma',
                specialization: 'General Medicine',
                appointmentDate: new Date('2024-01-20T10:00:00'),
                status: 'Scheduled',
                notes: 'Follow-up for chest infection'
            }
        ]
    },
    {
        name: 'Sunita Patel',
        phoneNumber: '9876543211',
        aadhaarNumber: '123456789013',
        gender: 'Female',
        age: 28,
        currentHealthIssue: 'Regular checkup and blood pressure monitoring',
        prescriptions: [],
        appointments: []
    },
    {
        name: 'Amit Singh',
        phoneNumber: '9876543212',
        aadhaarNumber: '123456789014',
        gender: 'Male',
        age: 45,
        currentHealthIssue: 'Diabetes management and routine consultation',
        prescriptions: [
            {
                filename: 'prescription-002.pdf',
                originalName: 'Diabetes Medication.pdf',
                uploadDate: new Date('2024-01-10')
            }
        ],
        appointments: []
    }
];

const sampleDoctors = [
    {
        name: 'Dr. Priya Sharma',
        age: 32,
        gender: 'Female',
        phoneNumber: '9876543213',
        yearsOfExperience: 8,
        uid: 'DOC001',
        specialization: 'General Medicine',
        patients: [],
        schedule: [
            {
                day: 'Monday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            },
            {
                day: 'Tuesday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            },
            {
                day: 'Wednesday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            },
            {
                day: 'Thursday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            },
            {
                day: 'Friday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            }
        ],
        digitalPrescriptions: []
    },
    {
        name: 'Dr. Rajesh Verma',
        age: 40,
        gender: 'Male',
        phoneNumber: '9876543214',
        yearsOfExperience: 12,
        uid: 'DOC002',
        specialization: 'Cardiology',
        patients: [],
        schedule: [
            {
                day: 'Monday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            },
            {
                day: 'Tuesday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            },
            {
                day: 'Wednesday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            },
            {
                day: 'Thursday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            },
            {
                day: 'Friday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            }
        ],
        digitalPrescriptions: []
    },
    {
        name: 'Dr. Anjali Gupta',
        age: 35,
        gender: 'Female',
        phoneNumber: '9876543215',
        yearsOfExperience: 10,
        uid: 'DOC003',
        specialization: 'Pediatrics',
        patients: [],
        schedule: [
            {
                day: 'Monday',
                startTime: '08:00',
                endTime: '16:00',
                isAvailable: true
            },
            {
                day: 'Tuesday',
                startTime: '08:00',
                endTime: '16:00',
                isAvailable: true
            },
            {
                day: 'Wednesday',
                startTime: '08:00',
                endTime: '16:00',
                isAvailable: true
            },
            {
                day: 'Thursday',
                startTime: '08:00',
                endTime: '16:00',
                isAvailable: true
            },
            {
                day: 'Friday',
                startTime: '08:00',
                endTime: '16:00',
                isAvailable: true
            }
        ],
        digitalPrescriptions: []
    },
    {
        name: 'Dr. Vikram Singh',
        age: 38,
        gender: 'Male',
        phoneNumber: '9876543216',
        yearsOfExperience: 15,
        uid: 'DOC004',
        specialization: 'Orthopedics',
        patients: [],
        schedule: [
            {
                day: 'Monday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            },
            {
                day: 'Tuesday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            },
            {
                day: 'Wednesday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            },
            {
                day: 'Thursday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            },
            {
                day: 'Friday',
                startTime: '09:00',
                endTime: '17:00',
                isAvailable: true
            }
        ],
        digitalPrescriptions: []
    },
    {
        name: 'Dr. Meera Joshi',
        age: 42,
        gender: 'Female',
        phoneNumber: '9876543217',
        yearsOfExperience: 18,
        uid: 'DOC005',
        specialization: 'Dermatology',
        patients: [],
        schedule: [
            {
                day: 'Monday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            },
            {
                day: 'Tuesday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            },
            {
                day: 'Wednesday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            },
            {
                day: 'Thursday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            },
            {
                day: 'Friday',
                startTime: '10:00',
                endTime: '18:00',
                isAvailable: true
            }
        ],
        digitalPrescriptions: []
    }
];

async function populateDatabase() {
    try {
        console.log('Starting database population...');
        
        // Clear existing data
        await Patient.deleteMany({});
        await Doctor.deleteMany({});
        console.log('Cleared existing data');
        
        // Create doctors first
        const createdDoctors = await Doctor.insertMany(sampleDoctors);
        console.log(`Created ${createdDoctors.length} doctors`);
        
        // Update patient appointments with doctor IDs
        samplePatients.forEach((patient, index) => {
            if (patient.appointments.length > 0) {
                patient.appointments[0].doctorId = createdDoctors[0]._id;
            }
        });
        
        // Create patients
        const createdPatients = await Patient.insertMany(samplePatients);
        console.log(`Created ${createdPatients.length} patients`);
        
        // Update doctor patients
        const doctorUpdates = createdDoctors.map((doctor, index) => {
            if (index === 0 && createdPatients.length > 0) {
                return Doctor.findByIdAndUpdate(doctor._id, {
                    $push: {
                        patients: {
                            patientId: createdPatients[0]._id,
                            patientName: createdPatients[0].name,
                            appointmentDate: new Date('2024-01-20T10:00:00'),
                            status: 'Active'
                        }
                    }
                });
            }
            return Promise.resolve();
        });
        
        await Promise.all(doctorUpdates);
        console.log('Updated doctor-patient relationships');
        
        console.log('Database population completed successfully!');
        console.log('\nSample Data Summary:');
        console.log(`- ${createdDoctors.length} doctors created`);
        console.log(`- ${createdPatients.length} patients created`);
        console.log('\nSample Login Credentials:');
        console.log('Patients:');
        samplePatients.forEach((patient, index) => {
            console.log(`  ${index + 1}. Phone: ${patient.phoneNumber} (${patient.name})`);
        });
        console.log('\nDoctors:');
        sampleDoctors.forEach((doctor, index) => {
            console.log(`  ${index + 1}. Phone: ${doctor.phoneNumber} (${doctor.name})`);
        });
        
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the population script
populateDatabase();
