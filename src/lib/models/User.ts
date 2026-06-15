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
  linkedinUrl: string;
  targetRole: string;
  createdAt: Date;
  updatedAt: Date;
  diagnosticDone: boolean;
  diagnosticDate?: Date;
  empScore?: number;
  topProfile?: string;
  skills?: string[];
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
    linkedinUrl: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    diagnosticDone: { type: Boolean, default: false },
    diagnosticDate: { type: Date },
    empScore: { type: Number },
    topProfile: { type: String },
    skills: { type: [String] },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
