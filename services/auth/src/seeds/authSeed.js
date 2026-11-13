import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import Institution from "../models/Institution.js";

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/auth_manager";

// Stabilní ID sdílená s Transaction seedem (frontend je po loginu používá).
const IDS = {
  org: new mongoose.Types.ObjectId("cccccccccccccccccccccccc"),
  institution: new mongoose.Types.ObjectId("dddddddddddddddddddddddd"),
  admin: new mongoose.Types.ObjectId("bbbbbbbbbbbbbbbbbbbbbbbb"),
  student: new mongoose.Types.ObjectId("aaaaaaaaaaaaaaaaaaaaaaaa"),
};

async function seed() {
  console.log("🌱 Seeding Auth MongoDB...");
  await mongoose.connect(mongoURI, { family: 4 });

  await Promise.all([
    User.deleteMany({}),
    Organization.deleteMany({}),
    Institution.deleteMany({}),
  ]);

  const org = await Organization.create({
    _id: IDS.org,
    name: "Demo škola SOU",
    email: "skola@example.cz",
    note: "Výchozí organizace pro vývoj",
  });

  const passwordHash = await bcrypt.hash("heslo123", 10);

  const admin = await User.create({
    _id: IDS.admin,
    username: "admin",
    password: passwordHash,
    displayName: "System Admin",
    firstName: "System",
    lastName: "Admin",
    email: "admin@example.cz",
    roles: ["SYSTEM_ADMIN"],
    organizationIds: [String(org._id)],
    institutionIds: [String(IDS.institution)],
  });

  const student = await User.create({
    _id: IDS.student,
    username: "student",
    password: passwordHash,
    displayName: "Jan Student",
    firstName: "Jan",
    lastName: "Student",
    email: "student@example.cz",
    roles: ["USER"],
    organizationIds: [String(org._id)],
    institutionIds: [String(IDS.institution)],
  });

  await Institution.create({
    _id: IDS.institution,
    name: "Demo Banka",
    bic: "DEMOCZPP",
    country: "CZ",
    organizationId: String(org._id),
    adminUserId: String(admin._id),
  });

  console.log("✅ Auth seed hotový");
  console.log({
    organizationId: String(org._id),
    institutionId: String(IDS.institution),
    studentUserId: String(student._id),
    users: ["admin / heslo123", "student / heslo123"],
  });

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("❌ Auth seed selhal", err);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
