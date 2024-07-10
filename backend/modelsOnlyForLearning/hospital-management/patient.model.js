import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
})

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: [addressSchema],
    bloodGroup:{
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    admittedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    dischargedFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    dateOfAdmission: {
        type: Date,
        required: true,
    },
    dateOfDischarge: {
        type: Date,
        required: true,
    },
    photo:{
        type: String,
        required: true,
    }
}, {timestamps: true});

export const Patient = mongoose.model('Patient', patientSchema);
