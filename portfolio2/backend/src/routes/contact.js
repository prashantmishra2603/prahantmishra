const express = require('express')
const router = express.Router()
const Message = require('../models/Message')
const auth = require('../middleware/authMiddleware')

// POST /api/contact — Public (save message)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' })
    }
    const msg = await Message.create({ name, email, subject, message })
    res.status(201).json({ message: 'Message sent successfully', id: msg._id })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET /api/contact — Admin only
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

// PATCH /api/contact/:id/read — Admin only
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    res.json(msg)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
