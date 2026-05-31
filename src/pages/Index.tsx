import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin, Mail, Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { fetchResumeData, getCachedResumeData, type ResumeData } from '@/lib/dataService';

const videoSrc = new URL('@/assets/video summary.mp4', import.meta.url).href;

const socialLinks = [
  { icon: Github, url: 'https://github.com/prashantmishra2603', label: 'GitHub' },
  { icon: Linkedin, url: 'https://linkedin.com/in/prashantmishra2603', label: 'LinkedIn' },
  { icon: Mail, url: 'mailto:prashantmishra2603@gmail.com', label: 'Email' },
];

export default function Index() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(getCachedResumeData());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const loadData = async () => {
    try {
      const data = await fetchResumeData();
      setResumeData(data);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('portfolio-data-change', loadData);
    return () => window.removeEventListener('portfolio-data-change', loadData);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setVideoProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    videoRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration;
  };

  const experience = resumeData?.experience;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1 }} className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 1, delay: 0.3 }} className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Available for opportunities
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Hi, I'm{' '}<span className="gradient-text">Prashant Mishra</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              MERN Web Developer building{' '}<span className="text-foreground font-medium">clean, scalable web apps</span>
            </motion.p>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-muted-foreground mb-10">
              📍 Gorakhpur, India
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Button asChild size="lg" className="group">
                <Link to="/projects">View My Projects<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg"><Link to="/contact">Get In Touch</Link></Button>
              <Button asChild variant="ghost" size="lg">
                <a href="/resume.pdf" download><Download className="mr-2 w-4 h-4" />Resume</a>
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="flex items-center justify-center gap-4">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors focus-ring"
                  aria-label={social.label}>
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      {experience && (
        <section className="py-20 bg-card border-y border-border">
          <div className="section-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <AnimatedCounter end={experience.years} suffix="+" label="Years Experience" />
              <AnimatedCounter end={experience.projectsCompleted} suffix="+" label="Projects Completed" />
              <AnimatedCounter end={experience.technologiesUsed} suffix="+" label="Technologies" />
              <AnimatedCounter end={experience.happyClients} suffix="+" label="Happy Clients" />
            </div>
          </div>
        </section>
      )}

      {/* Video Showcase Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="section-container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-4 uppercase tracking-wider">Featured</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Watch My Video Tour</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A quick visual walkthrough of my journey, skills, and the projects I've built.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden border border-border/60 shadow-2xl bg-card/80 backdrop-blur-sm">
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  muted={isMuted}
                  loop
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                  onClick={togglePlay}
                  style={{ cursor: 'pointer' }}
                />
                {!isPlaying && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={togglePlay}>
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-xl">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </motion.div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-12 pb-4">
                  <div className="h-1.5 bg-white/20 rounded-full mb-3 cursor-pointer hover:h-2 transition-all" onClick={handleSeek}>
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${videoProgress}%` }} />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                    </button>
                    <button onClick={toggleMute} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                    <span className="text-white/70 text-xs ml-auto">Portfolio Video Tour</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Click the video to play • Use controls to toggle sound</p>
          </motion.div>
        </div>
      </section>

      {/* Skills Preview */}
      {resumeData && (
        <section className="py-20">
          <div className="section-container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-4 uppercase tracking-wider">What I Do</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Technologies I Work With</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Frontend', skills: resumeData.skills.frontend.slice(0, 5) },
                { title: 'Backend', skills: resumeData.skills.backend },
                { title: 'Database', skills: resumeData.skills.database },
              ].map((category, index) => (
                <motion.div key={category.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="card-elevated p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">{category.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 bg-muted text-muted-foreground rounded-md text-sm">{skill}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
              <Button asChild variant="outline">
                <Link to="/about">View All Skills<ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Have a project in mind? I'm always open to discussing new opportunities and interesting ideas.</p>
            <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
              <Link to="/contact">Start a Conversation<ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
