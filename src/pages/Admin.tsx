import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit2, Save, X, Download, RotateCcw,
  Briefcase, FolderKanban, Award, LayoutDashboard,
  ChevronDown, ChevronUp, CheckCircle, AlertCircle, Star,
  UserCircle, Upload, ImageOff, Lock, Eye, EyeOff, LogOut, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getResumeData, getProjectsData,
  saveResumeData, saveProjectsData,
  resetToDefaults, exportDataAsJSON,
  getProfilePic, saveProfilePic, clearProfilePic,
  changePasswordOnServer,
  type ResumeData, type Project, type Experience, type Certification,
} from '@/lib/dataService';
import defaultProfilePic from '@/assets/myimage.jpeg';

// ─── Auth Config ──────────────────────────────────────────────────────────────
// Simple hash-based login. Password is stored as a hash in localStorage.
// Default password: admin@2603  (you can change it from the settings tab)
const AUTH_KEY = 'portfolio_admin_auth';
const SESSION_KEY = 'portfolio_admin_session';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function getStoredHash(): string {
  return localStorage.getItem(AUTH_KEY) || simpleHash('admin@2603');
}

function isSessionActive(): boolean {
  const ts = localStorage.getItem(SESSION_KEY);
  if (!ts) return false;
  // Session lasts 8 hours
  return Date.now() - parseInt(ts) < 8 * 60 * 60 * 1000;
}

function startSession(): void {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
}

function endSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (simpleHash(password) === getStoredHash()) {
      localStorage.setItem('portfolio_admin_password', password);
      startSession();
      onLogin();
    } else {
      setError('Incorrect password. Access denied.');
      setShake(true);
      setPassword('');
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <motion.div
          animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header stripe */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

          <div className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-1">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
              Enter your password to manage the portfolio
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Password"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-xs text-red-500 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button type="submit" className="w-full gap-2" size="lg">
                <Lock className="w-4 h-4" />
                Sign In
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              🔒 Private — only you have access
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-sm font-medium ${
        type === 'success'
          ? 'bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400'
          : 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400'
      }`}
    >
      {type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
    </motion.div>
  );
}

// ─── Collapsible Input Card ───────────────────────────────────────────────────
function CollapseCard({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border/60">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Field Input ──────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, multiline = false, placeholder = '', type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; placeholder?: string; type?: string;
}) {
  const base = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all';
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${base} resize-y`} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={base} />
      }
    </div>
  );
}

// ─── ArrayField ───────────────────────────────────────────────────────────────
function ArrayField({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const add = () => onChange([...items, '']);
  const update = (i: number, v: string) => { const next = [...items]; next[i] = v; onChange(next); };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button onClick={() => remove(i)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium mt-1 w-fit transition-colors"
      >
        <Plus className="w-3 h-3" /> Add item
      </button>
    </div>
  );
}

// ─── Section: Profile Picture ─────────────────────────────────────────────────

function ProfilePictureSection({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [currentPic, setCurrentPic] = useState<string | null>(getProfilePic());
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handle = () => setCurrentPic(getProfilePic());
    window.addEventListener('portfolio-data-change', handle);
    return () => window.removeEventListener('portfolio-data-change', handle);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const applyPhoto = () => {
    if (!preview) return;
    saveProfilePic(preview);
    setCurrentPic(preview);
    setPreview(null);
    showToast('Profile photo updated!', 'success');
  };

  const removeCustomPhoto = () => {
    clearProfilePic();
    setCurrentPic(null);
    setPreview(null);
    showToast('Reverted to default photo.', 'success');
  };

  const displayPic = preview || currentPic || defaultProfilePic;
  const hasCustom = !!currentPic;

  return (
    <div className="space-y-6">
      {/* Current photo preview */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-border shadow-lg">
            <img
              src={displayPic}
              alt="Profile"
              className="w-full h-full object-cover object-top"
            />
          </div>
          {preview && (
            <span className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
              Preview
            </span>
          )}
          {hasCustom && !preview && (
            <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
              Custom
            </span>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground mb-1">Profile Photo</h3>
            <p className="text-xs text-muted-foreground">
              {hasCustom
                ? 'Using your custom uploaded photo.'
                : 'Using the default photo (myimage.jpeg).'
              }
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="w-3.5 h-3.5" />
              Choose Photo
            </Button>
            {preview && (
              <Button size="sm" onClick={applyPhoto} className="gap-2">
                <Save className="w-3.5 h-3.5" />
                Apply Photo
              </Button>
            )}
            {preview && (
              <Button size="sm" variant="outline" onClick={() => setPreview(null)} className="gap-2">
                <X className="w-3.5 h-3.5" />
                Discard
              </Button>
            )}
            {hasCustom && !preview && (
              <Button size="sm" variant="outline" onClick={removeCustomPhoto} className="gap-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                <ImageOff className="w-3.5 h-3.5" />
                Revert to Default
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-border hover:border-primary/40 hover:bg-muted/30'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
            isDragging ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
          }`}>
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isDragging ? 'Drop it here!' : 'Drag & drop your photo here'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse • JPG, PNG, WEBP • Max 5MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section: Change Password ─────────────────────────────────────────────────
function ChangePasswordSection({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showFields, setShowFields] = useState(false);

  const handleChange = async () => {
    if (simpleHash(current) !== getStoredHash()) {
      showToast('Current password is incorrect.', 'error'); return;
    }
    if (next.length < 6) {
      showToast('New password must be at least 6 characters.', 'error'); return;
    }
    if (next !== confirm) {
      showToast('Passwords do not match.', 'error'); return;
    }
    try {
      await changePasswordOnServer(next, current);
      localStorage.setItem('portfolio_admin_password', next);
      localStorage.setItem(AUTH_KEY, simpleHash(next));
      setCurrent(''); setNext(''); setConfirm('');
      setShowFields(false);
      showToast('Password changed successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password on server.', 'error');
    }
  };

  return (
    <div className="card-elevated p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Change Password</h3>
          <p className="text-xs text-muted-foreground">Update your admin login password</p>
        </div>
      </div>

      {!showFields ? (
        <Button size="sm" variant="outline" onClick={() => setShowFields(true)} className="gap-2">
          <Edit2 className="w-3.5 h-3.5" /> Change Password
        </Button>
      ) : (
        <div className="space-y-3">
          <Field label="Current Password" type="password" value={current} onChange={setCurrent} placeholder="Enter current password" />
          <Field label="New Password" type="password" value={next} onChange={setNext} placeholder="Min 6 characters" />
          <Field label="Confirm New Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => { setShowFields(false); setCurrent(''); setNext(''); setConfirm(''); }} className="gap-2">
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
            <Button size="sm" onClick={handleChange} className="gap-2">
              <Save className="w-3.5 h-3.5" /> Save Password
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section: Projects ────────────────────────────────────────────────────────
function ProjectsSection({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [data, setData] = useState(getProjectsData());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);
  const newProject = (): Project => ({
    id: `proj-${Date.now()}`,
    title: '', role: '', description: '', longDescription: '',
    techStack: [], badges: [], features: [], images: [],
    githubUrl: '', liveUrl: '', status: 'completed', featured: false,
  });
  const [newDraft, setNewDraft] = useState<Project>(newProject());

  useEffect(() => {
    const handle = () => setData(getProjectsData());
    window.addEventListener('portfolio-data-change', handle);
    return () => window.removeEventListener('portfolio-data-change', handle);
  }, []);

  const save = (updated: Project) => {
    const next = { ...data, projects: data.projects.map((p) => p.id === updated.id ? updated : p) };
    saveProjectsData(next); setData(next); setEditingId(null);
    showToast('Project updated!', 'success');
  };

  const remove = (id: string) => {
    const next = { ...data, projects: data.projects.filter((p) => p.id !== id) };
    saveProjectsData(next); setData(next);
    showToast('Project deleted.', 'success');
  };

  const add = () => {
    if (!newDraft.title.trim()) { showToast('Title is required.', 'error'); return; }
    const next = { ...data, projects: [...data.projects, newDraft] };
    saveProjectsData(next); setData(next); setNewDraft(newProject());
    showToast('Project added!', 'success');
  };

  return (
    <div>
      <CollapseCard title="➕  Add New Project">
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <Field label="Title" value={newDraft.title} onChange={(v) => setNewDraft({ ...newDraft, title: v })} />
          <Field label="Role" value={newDraft.role} onChange={(v) => setNewDraft({ ...newDraft, role: v })} />
          <Field label="Status" value={newDraft.status} onChange={(v) => setNewDraft({ ...newDraft, status: v })} />
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="newFeatured" checked={newDraft.featured} onChange={(e) => setNewDraft({ ...newDraft, featured: e.target.checked })} className="w-4 h-4 accent-primary" />
            <label htmlFor="newFeatured" className="text-sm text-foreground">Featured</label>
          </div>
          <div className="md:col-span-2"><Field label="Description" value={newDraft.description} onChange={(v) => setNewDraft({ ...newDraft, description: v })} multiline /></div>
          <div className="md:col-span-2"><Field label="Long Description" value={newDraft.longDescription} onChange={(v) => setNewDraft({ ...newDraft, longDescription: v })} multiline /></div>
          <Field label="GitHub URL" value={newDraft.githubUrl} onChange={(v) => setNewDraft({ ...newDraft, githubUrl: v })} />
          <Field label="Live URL" value={newDraft.liveUrl} onChange={(v) => setNewDraft({ ...newDraft, liveUrl: v })} />
          <div className="md:col-span-2"><ArrayField label="Tech Stack" items={newDraft.techStack} onChange={(v) => setNewDraft({ ...newDraft, techStack: v })} /></div>
          <div className="md:col-span-2"><ArrayField label="Badges" items={newDraft.badges} onChange={(v) => setNewDraft({ ...newDraft, badges: v })} /></div>
          <div className="md:col-span-2"><ArrayField label="Features" items={newDraft.features} onChange={(v) => setNewDraft({ ...newDraft, features: v })} /></div>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="sm" onClick={add} className="gap-2"><Save className="w-4 h-4" /> Save Project</Button>
        </div>
      </CollapseCard>

      <div className="space-y-3">
        {data.projects.map((project) => (
          <motion.div key={project.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="border border-border rounded-xl bg-card overflow-hidden">
            {editingId === project.id && draft ? (
              <div className="p-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
                  <Field label="Role" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} />
                  <Field label="Status" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v })} />
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft({ ...draft, featured: e.target.checked })} className="w-4 h-4 accent-primary" id={`feat-${draft.id}`} />
                    <label htmlFor={`feat-${draft.id}`} className="text-sm">Featured</label>
                  </div>
                  <div className="md:col-span-2"><Field label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} multiline /></div>
                  <div className="md:col-span-2"><Field label="Long Description" value={draft.longDescription} onChange={(v) => setDraft({ ...draft, longDescription: v })} multiline /></div>
                  <Field label="GitHub URL" value={draft.githubUrl} onChange={(v) => setDraft({ ...draft, githubUrl: v })} />
                  <Field label="Live URL" value={draft.liveUrl} onChange={(v) => setDraft({ ...draft, liveUrl: v })} />
                  <div className="md:col-span-2"><ArrayField label="Tech Stack" items={draft.techStack} onChange={(v) => setDraft({ ...draft, techStack: v })} /></div>
                  <div className="md:col-span-2"><ArrayField label="Badges" items={draft.badges} onChange={(v) => setDraft({ ...draft, badges: v })} /></div>
                  <div className="md:col-span-2"><ArrayField label="Features" items={draft.features} onChange={(v) => setDraft({ ...draft, features: v })} /></div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="gap-2"><X className="w-3.5 h-3.5" /> Cancel</Button>
                  <Button size="sm" onClick={() => save(draft)} className="gap-2"><Save className="w-3.5 h-3.5" /> Save</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">{project.title}</h3>
                    {project.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${project.status === 'completed' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>{project.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{project.role} • {project.techStack.slice(0, 3).join(', ')}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setDraft({ ...project }); setEditingId(project.id); }} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => remove(project.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Experiences ─────────────────────────────────────────────────────
function ExperiencesSection({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [resume, setResume] = useState<ResumeData>(getResumeData());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Experience | null>(null);

  useEffect(() => {
    const handle = () => setResume(getResumeData());
    window.addEventListener('portfolio-data-change', handle);
    return () => window.removeEventListener('portfolio-data-change', handle);
  }, []);

  const newExp = (): Experience => ({
    id: `exp-${Date.now()}`,
    role: '', company: '', location: '', duration: '',
    type: 'Internship', description: '', highlights: [],
  });
  const [newDraft, setNewDraft] = useState<Experience>(newExp());

  const save = (updated: Experience) => {
    const next = { ...resume, experiences: resume.experiences.map((e) => e.id === updated.id ? updated : e) };
    saveResumeData(next); setResume(next); setEditingId(null);
    showToast('Experience updated!', 'success');
  };

  const remove = (id: string) => {
    const next = { ...resume, experiences: resume.experiences.filter((e) => e.id !== id) };
    saveResumeData(next); setResume(next);
    showToast('Experience deleted.', 'success');
  };

  const add = () => {
    if (!newDraft.role.trim() || !newDraft.company.trim()) {
      showToast('Role and Company are required.', 'error'); return;
    }
    const next = { ...resume, experiences: [...(resume.experiences || []), newDraft] };
    saveResumeData(next); setResume(next); setNewDraft(newExp());
    showToast('Experience added!', 'success');
  };

  const experiences = resume.experiences || [];

  return (
    <div>
      <CollapseCard title="➕  Add New Experience">
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <Field label="Role / Position" value={newDraft.role} onChange={(v) => setNewDraft({ ...newDraft, role: v })} placeholder="Software Developer Intern" />
          <Field label="Company" value={newDraft.company} onChange={(v) => setNewDraft({ ...newDraft, company: v })} placeholder="ISRO (URSC)" />
          <Field label="Location" value={newDraft.location} onChange={(v) => setNewDraft({ ...newDraft, location: v })} placeholder="Bengaluru, India" />
          <Field label="Duration" value={newDraft.duration} onChange={(v) => setNewDraft({ ...newDraft, duration: v })} placeholder="Jan 2024 – Apr 2024" />
          <Field label="Type" value={newDraft.type} onChange={(v) => setNewDraft({ ...newDraft, type: v })} placeholder="Internship / Full-time" />
          <div className="md:col-span-2"><Field label="Description" value={newDraft.description} onChange={(v) => setNewDraft({ ...newDraft, description: v })} multiline placeholder="Brief description of your role..." /></div>
          <div className="md:col-span-2"><ArrayField label="Highlights / Achievements" items={newDraft.highlights} onChange={(v) => setNewDraft({ ...newDraft, highlights: v })} /></div>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="sm" onClick={add} className="gap-2"><Save className="w-4 h-4" /> Save Experience</Button>
        </div>
      </CollapseCard>

      <div className="space-y-3">
        {experiences.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm rounded-xl border border-dashed border-border">
            No experiences yet. Add your first one above!
          </div>
        )}
        {experiences.map((exp) => (
          <motion.div key={exp.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-border rounded-xl bg-card overflow-hidden">
            {editingId === exp.id && draft ? (
              <div className="p-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Role" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} />
                  <Field label="Company" value={draft.company} onChange={(v) => setDraft({ ...draft, company: v })} />
                  <Field label="Location" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} />
                  <Field label="Duration" value={draft.duration} onChange={(v) => setDraft({ ...draft, duration: v })} />
                  <Field label="Type" value={draft.type} onChange={(v) => setDraft({ ...draft, type: v })} />
                  <div className="md:col-span-2"><Field label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} multiline /></div>
                  <div className="md:col-span-2"><ArrayField label="Highlights" items={draft.highlights} onChange={(v) => setDraft({ ...draft, highlights: v })} /></div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="gap-2"><X className="w-3.5 h-3.5" /> Cancel</Button>
                  <Button size="sm" onClick={() => save(draft)} className="gap-2"><Save className="w-3.5 h-3.5" /> Save</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{exp.role}</h3>
                  <p className="text-xs text-muted-foreground">{exp.company} • {exp.duration}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium flex-shrink-0">{exp.type}</span>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setDraft({ ...exp }); setEditingId(exp.id); }} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => remove(exp.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Certifications ──────────────────────────────────────────────────
function CertificationsSection({ showToast }: { showToast: (m: string, t: 'success' | 'error') => void }) {
  const [resume, setResume] = useState<ResumeData>(getResumeData());
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<Certification | null>(null);

  useEffect(() => {
    const handle = () => setResume(getResumeData());
    window.addEventListener('portfolio-data-change', handle);
    return () => window.removeEventListener('portfolio-data-change', handle);
  }, []);

  const newCert = (): Certification => ({ name: '', issuer: '', year: new Date().getFullYear().toString(), link: '#' });
  const [newDraft, setNewDraft] = useState<Certification>(newCert());

  const save = (updated: Certification, idx: number) => {
    const certs = [...resume.certifications]; certs[idx] = updated;
    const next = { ...resume, certifications: certs };
    saveResumeData(next); setResume(next); setEditingIdx(null);
    showToast('Certification updated!', 'success');
  };

  const remove = (idx: number) => {
    const next = { ...resume, certifications: resume.certifications.filter((_, i) => i !== idx) };
    saveResumeData(next); setResume(next);
    showToast('Certification deleted.', 'success');
  };

  const add = () => {
    if (!newDraft.name.trim()) { showToast('Name is required.', 'error'); return; }
    const next = { ...resume, certifications: [...resume.certifications, newDraft] };
    saveResumeData(next); setResume(next); setNewDraft(newCert());
    showToast('Certification added!', 'success');
  };

  return (
    <div>
      <CollapseCard title="➕  Add New Certification">
        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <Field label="Name" value={newDraft.name} onChange={(v) => setNewDraft({ ...newDraft, name: v })} placeholder="Full Stack Web Development" />
          <Field label="Issuer" value={newDraft.issuer} onChange={(v) => setNewDraft({ ...newDraft, issuer: v })} placeholder="Coursera / Udemy" />
          <Field label="Year" value={newDraft.year} onChange={(v) => setNewDraft({ ...newDraft, year: v })} placeholder="2024" />
          <Field label="Certificate Link" value={newDraft.link} onChange={(v) => setNewDraft({ ...newDraft, link: v })} placeholder="https://..." />
        </div>
        <div className="flex justify-end mt-4">
          <Button size="sm" onClick={add} className="gap-2"><Save className="w-4 h-4" /> Save Certification</Button>
        </div>
      </CollapseCard>

      <div className="space-y-3">
        {resume.certifications.map((cert, idx) => (
          <motion.div key={`${cert.name}-${idx}`} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-border rounded-xl bg-card overflow-hidden">
            {editingIdx === idx && draft ? (
              <div className="p-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
                  <Field label="Issuer" value={draft.issuer} onChange={(v) => setDraft({ ...draft, issuer: v })} />
                  <Field label="Year" value={draft.year} onChange={(v) => setDraft({ ...draft, year: v })} />
                  <Field label="Certificate Link" value={draft.link} onChange={(v) => setDraft({ ...draft, link: v })} />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button size="sm" variant="outline" onClick={() => setEditingIdx(null)} className="gap-2"><X className="w-3.5 h-3.5" /> Cancel</Button>
                  <Button size="sm" onClick={() => save(draft, idx)} className="gap-2"><Save className="w-3.5 h-3.5" /> Save</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.year}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setDraft({ ...cert }); setEditingIdx(idx); }} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => remove(idx)} className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
type Tab = 'overview' | 'projects' | 'experiences' | 'certifications' | 'profile';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(isSessionActive());
  const [tab, setTab] = useState<Tab>('overview');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(getResumeData());
  const [projectsData, setProjectsData] = useState(getProjectsData());

  useEffect(() => {
    const handle = () => { setResumeData(getResumeData()); setProjectsData(getProjectsData()); };
    window.addEventListener('portfolio-data-change', handle);
    return () => window.removeEventListener('portfolio-data-change', handle);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_password');
    endSession();
    setAuthenticated(false);
    setTab('overview');
  };

  const handleReset = () => {
    if (window.confirm('Reset ALL portfolio data to defaults? This cannot be undone.')) {
      resetToDefaults();
      showToast('Data reset to defaults.', 'success');
    }
  };

  // Show login screen if not authenticated
  if (!authenticated) {
    return (
      <>
        <LoginScreen onLogin={() => setAuthenticated(true)} />
        <AnimatePresence>
          {toast && (
            <Toast key={`${toast.message}-${Date.now()}`} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
          )}
        </AnimatePresence>
      </>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'experiences', label: 'Experiences', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle className="w-4 h-4" /> },
  ];

  const stats = [
    { label: 'Total Projects', value: projectsData.projects.length, color: 'from-blue-500 to-cyan-500' },
    { label: 'Featured', value: projectsData.projects.filter((p) => p.featured).length, color: 'from-amber-500 to-yellow-500' },
    { label: 'Experiences', value: (resumeData.experiences || []).length, color: 'from-green-500 to-emerald-500' },
    { label: 'Certifications', value: resumeData.certifications.length, color: 'from-purple-500 to-violet-500' },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="section-container max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-3 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Admin Panel
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Portfolio Manager</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your portfolio. Changes take effect instantly.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </Button>
              <Button size="sm" onClick={exportDataAsJSON} className="gap-2">
                <Download className="w-3.5 h-3.5" /> Export JSON
              </Button>
              <Button size="sm" variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card-elevated p-5 text-center">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-xl mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 flex-1 min-w-fit px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="card-elevated p-6">
                  <h2 className="font-bold text-foreground mb-2 text-lg">Welcome back, Prashant! 👋</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Use the tabs above to manage your portfolio content. All changes are saved instantly to
                    your browser's local storage and immediately reflect across all portfolio pages.
                    Use <strong>Export JSON</strong> to download updated data files for permanent storage.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: <UserCircle className="w-5 h-5" />, title: 'Profile Photo', desc: 'Upload or change your profile picture. Drag & drop supported.', tab: 'profile' as Tab },
                    { icon: <FolderKanban className="w-5 h-5" />, title: 'Projects', desc: 'Add, edit, or remove portfolio projects with full detail forms.', tab: 'projects' as Tab },
                    { icon: <Briefcase className="w-5 h-5" />, title: 'Experiences', desc: 'Manage work experience entries including internships and jobs.', tab: 'experiences' as Tab },
                    { icon: <Award className="w-5 h-5" />, title: 'Certifications', desc: 'Keep your credentials and courses list up to date.', tab: 'certifications' as Tab },
                  ].map((item) => (
                    <button key={item.title} onClick={() => setTab(item.tab)} className="card-elevated p-5 text-left hover:border-primary/40 group transition-all">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'profile' && (
              <div className="space-y-6">
                <div className="card-elevated p-6">
                  <h2 className="font-bold text-foreground mb-4 text-lg flex items-center gap-2">
                    <UserCircle className="w-5 h-5 text-primary" />
                    Profile Photo
                  </h2>
                  <ProfilePictureSection showToast={showToast} />
                </div>
                <ChangePasswordSection showToast={showToast} />
              </div>
            )}

            {tab === 'projects' && <ProjectsSection showToast={showToast} />}
            {tab === 'experiences' && <ExperiencesSection showToast={showToast} />}
            {tab === 'certifications' && <CertificationsSection showToast={showToast} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast key={`${toast.message}-${Date.now()}`} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
