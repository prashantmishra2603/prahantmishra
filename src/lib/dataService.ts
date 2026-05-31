/**
 * dataService.ts
 * Centralized data layer for the portfolio.
 *
 * Architecture:
 *  - All visitors READ from the API (Express server → JSON files on disk)
 *  - Admin WRITES via authenticated API calls (updates the actual JSON files)
 *  - localStorage is used ONLY as a fast cache for the current session
 *  - A 'portfolio-data-change' event is dispatched after every successful write
 *    so all components re-render immediately
 */

import defaultResumeJson from '../data/resume.json';
import defaultProjectsJson from '../data/projects.json';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  description: string;
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  link: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  year: string;
  grade: string;
}

export interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    portfolio: string;
    summary: string;
  };
  experience: {
    years: number;
    projectsCompleted: number;
    technologiesUsed: number;
    happyClients: number;
  };
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];
    languages: string[];
    tools: string[];
    other: string[];
  };
  education: Education[];
  certifications: Certification[];
  languages: string[];
  experiences: Experience[];
}

export interface Project {
  id: string;
  title: string;
  role: string;
  description: string;
  longDescription: string;
  techStack: string[];
  badges: string[];
  features: string[];
  images: string[];
  githubUrl: string;
  liveUrl: string;
  status: string;
  featured: boolean;
}

export interface ProjectsData {
  projects: Project[];
}

// ─── Cache keys ───────────────────────────────────────────────────────────────
const CACHE_RESUME = 'portfolio_cache_resume';
const CACHE_PROJECTS = 'portfolio_cache_projects';
const CACHE_PROFILE_PIC = 'portfolio_cache_profile_pic';

// ─── Dispatch helper ──────────────────────────────────────────────────────────
function dispatchChange(): void {
  window.dispatchEvent(new CustomEvent('portfolio-data-change'));
}

// ─── Cache helpers ────────────────────────────────────────────────────────────
function cacheResume(data: ResumeData): void {
  try { localStorage.setItem(CACHE_RESUME, JSON.stringify(data)); } catch {}
}

function cacheProjects(data: ProjectsData): void {
  try { localStorage.setItem(CACHE_PROJECTS, JSON.stringify(data)); } catch {}
}

function getCachedResume(): ResumeData | null {
  try {
    const raw = localStorage.getItem(CACHE_RESUME);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function getCachedProjects(): ProjectsData | null {
  try {
    const raw = localStorage.getItem(CACHE_PROJECTS);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ─── READ: fetch from server (with cache fallback) ────────────────────────────

const defaultResume: ResumeData = defaultResumeJson as unknown as ResumeData;
const defaultProjects: ProjectsData = defaultProjectsJson as unknown as ProjectsData;

export async function fetchResumeData(): Promise<ResumeData> {
  try {
    const res = await fetch('/api/resume');
    if (!res.ok) throw new Error('Server error');
    const data: ResumeData = await res.json();
    cacheResume(data);
    return data;
  } catch {
    // Fallback to cache or statically imported default JSON
    const cached = getCachedResume();
    if (cached) return cached;
    return defaultResume;
  }
}

export async function fetchProjectsData(): Promise<ProjectsData> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Server error');
    const data: ProjectsData = await res.json();
    cacheProjects(data);
    return data;
  } catch {
    const cached = getCachedProjects();
    if (cached) return cached;
    return defaultProjects;
  }
}

export async function fetchProfilePic(): Promise<string | null> {
  try {
    const res = await fetch('/api/profile-pic');
    if (!res.ok) return null;
    const { url } = await res.json();
    if (url) {
      localStorage.setItem(CACHE_PROFILE_PIC, url);
    } else {
      localStorage.removeItem(CACHE_PROFILE_PIC);
    }
    return url;
  } catch {
    return localStorage.getItem(CACHE_PROFILE_PIC);
  }
}

// Synchronous cache-only reads (for initial state before async loads)
export function getCachedResumeData(): ResumeData | null {
  return getCachedResume();
}

export function getCachedProjectsData(): ProjectsData | null {
  return getCachedProjects();
}

export function getCachedProfilePic(): string | null {
  return localStorage.getItem(CACHE_PROFILE_PIC);
}

// ─── WRITE: save to server (authenticated) ────────────────────────────────────

export async function saveResumeData(data: ResumeData, password?: string): Promise<void> {
  const pwd = password || localStorage.getItem('portfolio_admin_password') || '';
  const res = await fetch('/api/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': pwd,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save resume');
  }
  cacheResume(data);
  dispatchChange();
}

export async function saveProjectsData(data: ProjectsData, password?: string): Promise<void> {
  const pwd = password || localStorage.getItem('portfolio_admin_password') || '';
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': pwd,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to save projects');
  }
  cacheProjects(data);
  dispatchChange();
}

export async function saveProfilePic(file: File, password?: string): Promise<string> {
  const pwd = password || localStorage.getItem('portfolio_admin_password') || '';
  const formData = new FormData();
  formData.append('photo', file);
  const res = await fetch('/api/profile-pic', {
    method: 'POST',
    headers: { 'x-admin-password': pwd },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to upload photo');
  }
  const { url } = await res.json();
  localStorage.setItem(CACHE_PROFILE_PIC, url);
  dispatchChange();
  return url;
}

export async function clearProfilePic(password?: string): Promise<void> {
  const pwd = password || localStorage.getItem('portfolio_admin_password') || '';
  const res = await fetch('/api/profile-pic', {
    method: 'DELETE',
    headers: { 'x-admin-password': pwd },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to delete photo');
  }
  localStorage.removeItem(CACHE_PROFILE_PIC);
  dispatchChange();
}

// ─── Export data as JSON (download current server data) ──────────────────────
export async function exportDataAsJSON(): Promise<void> {
  const downloadJSON = (data: object, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  try {
    const [resume, projects] = await Promise.all([fetchResumeData(), fetchProjectsData()]);
    downloadJSON(resume, 'resume.json');
    setTimeout(() => downloadJSON(projects, 'projects.json'), 300);
  } catch {
    alert('Could not fetch data for export. Is the server running?');
  }
}

// ─── Verify admin password against server ────────────────────────────────────
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    // Try a lightweight authenticated request to verify the password
    const res = await fetch('/api/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      // Send current data unchanged — this just validates the password
      body: JSON.stringify(getCachedResume() || {}),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function getResumeData(): ResumeData {
  const cached = getCachedResume();
  return cached || defaultResume;
}

export function getProjectsData(): ProjectsData {
  const cached = getCachedProjects();
  return cached || defaultProjects;
}

export function getProfilePic(): string | null {
  return getCachedProfilePic();
}

export function resetToDefaults(): void {
  localStorage.removeItem(CACHE_RESUME);
  localStorage.removeItem(CACHE_PROJECTS);
  localStorage.removeItem(CACHE_PROFILE_PIC);
  dispatchChange();
}

export async function changePasswordOnServer(newPassword: string, currentPassword?: string): Promise<void> {
  const pwd = currentPassword || localStorage.getItem('portfolio_admin_password') || '';
  const res = await fetch('/api/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': pwd,
    },
    body: JSON.stringify({ newPassword }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to change password on server');
  }
}

