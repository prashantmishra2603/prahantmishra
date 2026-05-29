# Prashant Mishra — Portfolio Website

A premium, modern, full-stack portfolio website built with **React.js**, **Tailwind CSS**, **Framer Motion**, **Node.js**, **Express**, and **MongoDB**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Frontend
```bash
cd frontend
npm install
npm run dev         # http://localhost:5173
```

### Backend
```bash
cd backend
# Copy .env and fill in your credentials
cp .env.example .env    # edit with your values
npm start               # http://localhost:5000
```

## 📁 Project Structure
```
portfolio2/
├── frontend/           # Vite + React + Tailwind CSS
│   └── src/
│       ├── pages/      # Home, About, Skills, Projects, Certificates, Contact, Admin
│       ├── components/ # Navbar, Footer, ParticlesBg, AnimatedSection, etc.
│       ├── context/    # AuthContext (JWT)
│       └── services/   # Axios API instance
└── backend/            # Node.js + Express + MongoDB
    └── src/
        ├── models/     # User, Project, Certificate, Message
        ├── routes/     # auth, projects, certificates, contact
        └── middleware/ # JWT auth, Cloudinary upload
```

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend
Update `src/pages/Contact.jsx` with your EmailJS credentials:
```js
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'
```

## 🔐 Admin Panel
Visit `/admin` and login with:
- **Username**: `admin`
- **Password**: `Admin@123`

## 📸 Pages
| Page | Route |
|---|---|
| Home | `/` |
| About | `/about` |
| Skills | `/skills` |
| Projects | `/projects` |
| Certificates | `/certificates` |
| Contact | `/contact` |
| Admin Login | `/admin` |
| Admin Dashboard | `/admin/dashboard` |

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, React Router v6
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Cloudinary
- **UI**: Glassmorphism, Neon glows, Animated particles, Typing effects
