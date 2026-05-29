const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()

// ── Middleware ──
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Routes ──
app.use('/api/auth', require('./src/routes/auth'))
app.use('/api/projects', require('./src/routes/projects'))
app.use('/api/certificates', require('./src/routes/certificates'))
app.use('/api/contact', require('./src/routes/contact'))

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }))

// ── DB + Start ──
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio_pm'

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')
    // Seed admin user if not exists
    const User = require('./src/models/User')
    const bcrypt = require('bcryptjs')
    const exists = await User.findOne({ username: 'admin' })
    if (!exists) {
      const hash = await bcrypt.hash('Admin@123', 10)
      await User.create({ username: 'admin', password: hash })
      console.log('✅ Default admin created: admin / Admin@123')
    }
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  })
