import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    refreshToken: { type: String },
    displayName: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    // Preferované role ze zadání: SYSTEM, SYSTEM_ADMIN, USER (historicky i admin/boss/client).
    roles: {
      type: [String],
      default: ["USER"],
    },
    organizationIds: { type: [String], default: [] },
    institutionIds: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
