const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' })
    }
    const user = await User.findOne({ username })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'pm_secret_key_2024',
      { expiresIn: '7d' }
    )
    res.json({ token, username: user.username })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
