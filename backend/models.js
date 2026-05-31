const mongoose = require('mongoose');

// ─── Resume Schema ─────────────────────────────────────────────────────────
const ResumeSchema = new mongoose.Schema({
  personal: {
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  experience: {
    years: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    technologiesUsed: { type: Number, default: 0 },
    happyClients: { type: Number, default: 0 }
  },
  skills: {
    frontend: { type: [String], default: [] },
    backend: { type: [String], default: [] },
    database: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    other: { type: [String], default: [] }
  },
  education: [{
    degree: String,
    field: String,
    institution: String,
    location: String,
    year: String,
    grade: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: String,
    link: String
  }],
  languages: { type: [String], default: [] },
  experiences: [{
    id: String,
    role: String,
    company: String,
    location: String,
    duration: String,
    type: { type: String, default: 'Full-time' },
    description: String,
    highlights: { type: [String], default: [] }
  }]
}, { timestamps: true });

// ─── Project Schema ────────────────────────────────────────────────────────
const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  role: { type: String, default: '' },
  description: { type: String, default: '' },
  longDescription: { type: String, default: '' },
  techStack: { type: [String], default: [] },
  badges: { type: [String], default: [] },
  features: { type: [String], default: [] },
  images: { type: [String], default: [] },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  status: { type: String, default: 'completed' },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

// ─── Config Schema (Password & Metadata) ───────────────────────────────────
const ConfigSchema = new mongoose.Schema({
  key: { type: String, default: 'admin_config', unique: true },
  adminPassword: { type: String, default: 'admin@2603' },
  profilePicUrl: { type: String, default: null }
}, { timestamps: true });

module.exports = {
  Resume: mongoose.model('Resume', ResumeSchema),
  Project: mongoose.model('Project', ProjectSchema),
  Config: mongoose.model('Config', ConfigSchema)
};
