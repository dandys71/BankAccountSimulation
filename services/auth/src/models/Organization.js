import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  note: { 
    type: String, 
    trim: true 
  }
}, { 
  timestamps: true
});

export default mongoose.model('Organization', organizationSchema);