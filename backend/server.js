/**
 * server.js — Portfolio MongoDB Backend API Server
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { Resume, Project, Config } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

// ─── Paths ─────────────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const DEFAULT_RESUME_PATH = path.join(__dirname, '..', 'src', 'data', 'resume.json');
const DEFAULT_PROJECTS_PATH = path.join(__dirname, '..', 'src', 'data', 'projects.json');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// ─── Multer (file uploads) ─────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, _file, cb) => {
    const ext = path.extname(_file.originalname) || '.jpg';
    cb(null, `profile${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

// ─── DB Connection & Self-Healing Data Seeding ──────────────────────────────
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🔌 Connected to MongoDB successfully.');
    seedDatabase();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

async function seedDatabase() {
  try {
    // Seed Config
    let config = await Config.findOne({ key: 'admin_config' });
    if (!config) {
      config = new Config({ key: 'admin_config', adminPassword: process.env.ADMIN_PASSWORD || 'admin@2603' });
      await config.save();
      console.log('✅ Default Config seeded in database.');
    }

    // Seed Resume
    const resumeCount = await Resume.countDocuments();
    if (resumeCount === 0 && fs.existsSync(DEFAULT_RESUME_PATH)) {
      const defaultResumeData = JSON.parse(fs.readFileSync(DEFAULT_RESUME_PATH, 'utf-8'));
      const resume = new Resume(defaultResumeData);
      await resume.save();
      console.log('✅ Default Resume data seeded in MongoDB.');
    }

    // Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0 && fs.existsSync(DEFAULT_PROJECTS_PATH)) {
      const defaultProjectsData = JSON.parse(fs.readFileSync(DEFAULT_PROJECTS_PATH, 'utf-8'));
      if (defaultProjectsData && Array.isArray(defaultProjectsData.projects)) {
        await Project.insertMany(defaultProjectsData.projects);
        console.log('✅ Default Projects seeded in MongoDB.');
      }
    }
  } catch (err) {
    console.error('⚠️ Database seeding failed:', err.message);
  }
}

// ─── Auth Helper ───────────────────────────────────────────────────────────
async function getAdminPassword() {
  try {
    const config = await Config.findOne({ key: 'admin_config' });
    return config ? config.adminPassword : (process.env.ADMIN_PASSWORD || 'admin@2603');
  } catch {
    return process.env.ADMIN_PASSWORD || 'admin@2603';
  }
}

async function authenticate(req, res, next) {
  const password = req.headers['x-admin-password'] || req.body?.adminPassword;
  const adminPwd = await getAdminPassword();
  if (password !== adminPwd) {
    return res.status(401).json({ error: 'Unauthorized. Incorrect password.' });
  }
  next();
}

// ─── GET Routes ────────────────────────────────────────────────────────────

app.get('/api/resume', async (_req, res) => {
  try {
    let resume = await Resume.findOne();
    if (!resume) {
      resume = new Resume();
      await resume.save();
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch resume from MongoDB.', detail: err.message });
  }
});

app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: 1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch projects from MongoDB.', detail: err.message });
  }
});

app.get('/api/profile-pic', async (_req, res) => {
  try {
    const config = await Config.findOne({ key: 'admin_config' });
    res.json({ url: config ? config.profilePicUrl : null });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch profile pic metadata.', detail: err.message });
  }
});

// ─── POST Routes (protected) ───────────────────────────────────────────────

app.post('/api/resume', authenticate, async (req, res) => {
  try {
    const { adminPassword, _id, createdAt, updatedAt, __v, ...data } = req.body;
    let resume = await Resume.findOne();
    if (resume) {
      Object.assign(resume, data);
      await resume.save();
    } else {
      resume = new Resume(data);
      await resume.save();
    }
    res.json({ success: true, message: 'Resume saved to MongoDB successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save resume data in MongoDB.', detail: err.message });
  }
});

app.post('/api/projects', authenticate, async (req, res) => {
  try {
    const { projects } = req.body;
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: 'Projects payload must be an array.' });
    }

    // Overwrite the existing projects collection
    await Project.deleteMany({});
    
    // Clean and insert new ones
    const cleanedProjects = projects.map(({ _id, createdAt, updatedAt, __v, ...p }) => p);
    await Project.insertMany(cleanedProjects);

    res.json({ success: true, message: 'Projects saved to MongoDB successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save projects to MongoDB.', detail: err.message });
  }
});

app.post('/api/profile-pic', async (req, res, next) => {
  const password = req.headers['x-admin-password'];
  const adminPwd = await getAdminPassword();
  if (password !== adminPwd) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  next();
}, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const relativePath = `/uploads/${req.file.filename}`;
    
    let config = await Config.findOne({ key: 'admin_config' });
    if (!config) {
      config = new Config({ key: 'admin_config' });
    }
    config.profilePicUrl = relativePath;
    await config.save();

    res.json({ success: true, url: relativePath });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload photo.', detail: err.message });
  }
});

app.delete('/api/profile-pic', authenticate, async (_req, res) => {
  try {
    let config = await Config.findOne({ key: 'admin_config' });
    if (config && config.profilePicUrl) {
      const fullPath = path.join(__dirname, 'public', config.profilePicUrl);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      config.profilePicUrl = null;
      await config.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete profile picture.' });
  }
});

app.post('/api/change-password', authenticate, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    
    let config = await Config.findOne({ key: 'admin_config' });
    if (!config) {
      config = new Config({ key: 'admin_config' });
    }
    config.adminPassword = newPassword;
    await config.save();

    res.json({ success: true, message: 'Password updated successfully in MongoDB.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save new password.', detail: err.message });
  }
});

app.post('/api/reset', authenticate, async (_req, res) => {
  try {
    await Resume.deleteMany({});
    await Project.deleteMany({});
    await seedDatabase();
    res.json({ success: true, message: 'MongoDB data reset to defaults.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Health ────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// ─── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔌 Portfolio MongoDB Server running on http://localhost:${PORT}`);
  console.log(`   • DB URI: ${MONGODB_URI}`);
  console.log(`   • GET  /api/resume`);
  console.log(`   • GET  /api/projects`);
  console.log(`   • GET  /api/profile-pic\n`);
});
