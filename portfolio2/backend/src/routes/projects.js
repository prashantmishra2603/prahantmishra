const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const auth = require('../middleware/authMiddleware')

// GET /api/projects — Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json(projects)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

// POST /api/projects — Admin only
router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/projects/:id — Admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/projects/:id — Admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json({ message: 'Project deleted' })
  } catch { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
