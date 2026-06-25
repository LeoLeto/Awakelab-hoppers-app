import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  country: string;
  currentRole: string;
  yearsExperience: string;
  sapModules: string[];
  certifications: string;
  targetCertifications?: string;
  linkedinUrl: string;
  targetRole: string;
  createdAt: Date;
  updatedAt: Date;
  diagnosticDone: boolean;
  diagnosticDate?: Date;
  empScore?: number;
  topProfile?: string;
  skills?: string[];
  diagnosticResult?: Record<string, unknown>;
  // extended profile fields
  phone?: string;
  city?: string;
  bio?: string;
  education?: string;
  languages?: string[];
  availability?: string;
  jobPreferences?: string[];
  portfolio?: string;
  photo?: string;
  salary?: string;
  linkedin?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    country: { type: String, default: "" },
    currentRole: { type: String, default: "" },
    yearsExperience: { type: String, default: "" },
    sapModules: { type: [String], default: [] },
    certifications: { type: String, default: "" },
    targetCertifications: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    diagnosticDone: { type: Boolean, default: false },
    diagnosticDate: { type: Date },
    empScore: { type: Number },
    topProfile: { type: String },
    skills: { type: [String] },
    diagnosticResult: { type: Schema.Types.Mixed },
    // extended profile fields
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    bio: { type: String, default: "" },
    education: { type: String, default: "" },
    languages: { type: [String], default: [] },
    availability: { type: String, default: "" },
    jobPreferences: { type: [String], default: [] },
    portfolio: { type: String, default: "" },
    photo: { type: String, default: "" },
    salary: { type: String, default: "" },
    linkedin: { type: String, default: "" },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
