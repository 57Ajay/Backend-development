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
});

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: [addressSchema],
    specializedIn: [
        {
            type: String,
            required: true
        }
    ]
}, {timestamps: true});

export const Hospital = mongoose.model('Hospital', hospitalSchema);
