import mongoose from 'mongoose';

const institutionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        trim: true
    },
    bic: {
        type: String,
        trim: true,
        uppercase: true
    },
    country: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Institution', institutionSchema);