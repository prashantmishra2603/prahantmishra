const express = require('express')
const router = express.Router()
const Certificate = require('../models/Certificate')
const auth = require('../middleware/authMiddleware')
const upload = require('../middleware/upload')
const cloudinary = require('../config/cloudinary')

// GET /api/certificates — Public
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 })
    res.json(certs)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

// POST /api/certificates — Admin + Cloudinary upload
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, issuer, date, type, emoji, color } = req.body
    const certData = { title, issuer, date, type, emoji, color }
    if (req.file) {
      certData.url = req.file.path
      certData.publicId = req.file.filename
    }
    const cert = await Certificate.create(certData)
    res.status(201).json(cert)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/certificates/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id)
    if (!cert) return res.status(404).json({ message: 'Certificate not found' })
    // Delete from Cloudinary
    if (cert.publicId) {
      await cloudinary.uploader.destroy(cert.publicId, { resource_type: 'auto' }).catch(() => {})
    }
    await cert.deleteOne()
    res.json({ message: 'Certificate deleted' })
  } catch { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
