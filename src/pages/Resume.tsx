import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download, Mail, MapPin, Github, Linkedin,
  GraduationCap, Award, Briefcase, Code, CheckCircle2, Calendar, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fetchResumeData, fetchProjectsData, getCachedResumeData, getCachedProjectsData, type ResumeData, type ProjectsData } from '@/lib/dataService';

export default function Resume() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(getCachedResumeData());
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(getCachedProjectsData());
  const [loading, setLoading] = useState(!getCachedResumeData());

  const loadData = async () => {
    try {
      const [resume, projects] = await Promise.all([fetchResumeData(), fetchProjectsData()]);
      setResumeData(resume);
      setProjectsData(projects);
    } catch (err) {
      console.error('Failed to load resume data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('portfolio-data-change', loadData);
    return () => window.removeEventListener('portfolio-data-change', loadData);
  }, []);

  if (loading && !resumeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!resumeData) return null;

  const { personal, skills, education, certifications, experiences } = resumeData;

  return (
    <div className="py-16">
      <div className="section-container">
        <SectionHeading badge="Resume" title="My Resume" subtitle="A comprehensive overview of my skills, experience, and qualifications" />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-12">
          <Button asChild size="lg">
            <a href="/resume.pdf" download><Download className="w-4 h-4 mr-2" />Download PDF Resume</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto bg-card rounded-2xl border border-border overflow-hidden"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{personal.name}</h1>
            <p className="text-xl text-primary-foreground/90 mb-6">{personal.title}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href={`mailto:${personal.email}`} className="flex items-center gap-2 hover:underline"><Mail className="w-4 h-4" />{personal.email}</a>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{personal.location}</span>
              <a href={personal.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline"><Github className="w-4 h-4" />GitHub</a>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline"><Linkedin className="w-4 h-4" />LinkedIn</a>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 space-y-12">
            {/* Summary */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" />Professional Summary</h2>
              <p className="text-muted-foreground leading-relaxed">{personal.summary}</p>
            </section>

            {/* Work Experience */}
            {experiences && experiences.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" />Work Experience</h2>
                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative border-l-2 border-primary/30 pl-6">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      </div>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-bold text-foreground">{exp.role}</h3>
                          <p className="text-sm text-primary font-semibold">{exp.company}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">{exp.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-2">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" /> {exp.location}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" /> {exp.duration}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{exp.description}</p>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="space-y-1.5">
                          {exp.highlights.map((hl, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{hl}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Technical Skills */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-primary" />Technical Skills</h2>
              <div className="space-y-4">
                {[
                  { label: 'Frontend', items: skills.frontend },
                  { label: 'Backend', items: skills.backend },
                  { label: 'Databases', items: skills.database },
                  { label: 'Languages', items: skills.languages },
                  { label: 'Tools', items: skills.tools },
                ].map(({ label, items }) => (
                  <div key={label}>
                    <h3 className="text-sm font-semibold text-foreground mb-2">{label}</h3>
                    <p className="text-muted-foreground text-sm">{items.join(' • ')}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            {projectsData && (
              <section>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" />Key Projects</h2>
                <div className="space-y-6">
                  {projectsData.projects.map((project) => (
                    <div key={project.id} className="border-l-2 border-primary/30 pl-4">
                      <h3 className="font-semibold text-foreground">{project.title}</h3>
                      <p className="text-sm text-primary mb-1">{project.role}</p>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <p className="text-xs text-muted-foreground"><span className="font-medium">Technologies:</span> {project.techStack.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" />Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.degree} className="border-l-2 border-primary/30 pl-4">
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-primary">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">{edu.field} • {edu.year} • {edu.grade}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-primary" />Certifications</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div key={cert.name} className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium text-foreground text-sm">{cert.name}</h3>
                    <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.year}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">Languages</h2>
              <p className="text-muted-foreground">{resumeData.languages.join(' • ')}</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
