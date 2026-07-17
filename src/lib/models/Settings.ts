import { Schema, models, model } from "mongoose";

const SettingsSchema = new Schema(
  {
    smtpFrom:    { type: String, default: "" },
    smtpHost:    { type: String, default: "" },
    smtpPort:    { type: Number, default: 587 },
    smtpUser:    { type: String, default: "" },
    smtpPass:    { type: String, default: "" },
    smtpSecure:  { type: Boolean, default: false },
    adminEmails: { type: [String], default: [] },
  },
  { collection: "site_settings" }
);

export default models.Settings ?? model("Settings", SettingsSchema);
