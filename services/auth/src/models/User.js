import mongoose from 'mongoose';
//import moment from 'moment';

const userSchema = new mongoose.Schema({
    username: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, // Automaticky p�evede na mal� p�smena
      trim: true // Odstran� mezery p�ed a za textem 
    },
    password: { type: String, required: true },
    refreshToken: { type: String},
    displayName: { type: String},
    email: { 
      type: String, 
      lowercase: true, // Automaticky p�evede "User@Email.cz" na "user@email.cz"
      trim: true // Odstran� mezery p�ed a za textem 
    },
    roles: {type: [String]},
    organizationIds: {type: [String]},
    institutionIds: {type: [String]},
    isActive: {type: Boolean,  default: true},
}, { 
  timestamps: true // Automaticky vytvo�� createdAt a updatedAt jako typ Date
});

export default mongoose.model('User', userSchema);
