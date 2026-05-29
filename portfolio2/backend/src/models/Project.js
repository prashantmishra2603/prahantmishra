const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  subtitle: { type: String, trim: true },
  description: { type: String, required: true },
  tech: [{ type: String }],
  github: { type: String },
  live: { type: String },
  imageUrl: { type: String },
  emoji: { type: String, default: '🚀' },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Project', ProjectSchema)
