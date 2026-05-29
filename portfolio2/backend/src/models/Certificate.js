const mongoose = require('mongoose')

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  date: { type: String },
  type: { type: String, default: 'Course', enum: ['Course', 'Certification', 'Achievement', 'Award'] },
  url: { type: String },          // Cloudinary URL
  publicId: { type: String },     // Cloudinary public_id for deletion
  emoji: { type: String, default: '🏆' },
  color: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Certificate', CertificateSchema)
