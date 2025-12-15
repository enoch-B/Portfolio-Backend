import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  blogName: {
    type: String,
    default: "My Blog"
  },
  blogDescription: {
    type: String,
    default: ""
  },
  heroTitle: {
    type: String,
    default: "Welcome to My Blog"
  },
  heroSubtitle: {
    type: String,
    default: ""
  },
  twitter: {
    type: String,
    default: ""
  },
  linkedin: {
    type: String,
    default: ""
  },
  github: {
    type: String,
    default: ""
  },
  metaTitle: {
    type: String,
    default: ""
  },
  metaDescription: {
    type: String,
    default: ""
  },
  metaKeywords: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;

