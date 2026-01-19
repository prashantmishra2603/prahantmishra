import { motion } from 'framer-motion';
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  GraduationCap,
  Award,
  Briefcase,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import resumeData from '@/data/resume.json';
import projectsData from '@/data/projects.json';

export default function Resume() {
  const { personal, skills, education, certifications } = resumeData;

  return (
    <div className="py-16">
      <div className="section-container">
        <SectionHeading
          badge="Resume"
          title="My Resume"
          subtitle="A comprehensive overview of my skills, experience, and qualifications"
        />

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <Button asChild size="lg">
            <a href="/resume.pdf" download>
              <Download className="w-4 h-4 mr-2" />
              Download PDF Resume
            </a>
          </Button>
        </motion.div>

        {/* Resume Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto bg-card rounded-2xl border border-border overflow-hidden"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {personal.name}
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-6">
              {personal.title}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href={`mailto:${personal.email}`}
                className="flex items-center gap-2 hover:underline"
              >
                <Mail className="w-4 h-4" />
                {personal.email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {personal.location}
              </span>
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 space-y-12">
            {/* Summary */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Professional Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {personal.summary}
              </p>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Technical Skills
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Frontend
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {skills.frontend.join(' • ')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Backend
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {skills.backend.join(' • ')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Databases
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {skills.database.join(' • ')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Languages
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {skills.languages.join(' • ')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Tools
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {skills.tools.join(' • ')}
                  </p>
                </div>
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Key Projects
              </h2>
              <div className="space-y-6">
                {projectsData.projects.map((project) => (
                  <div
                    key={project.id}
                    className="border-l-2 border-primary/30 pl-4"
                  >
                    <h3 className="font-semibold text-foreground">
                      {project.title}
                    </h3>
                    <p className="text-sm text-primary mb-1">{project.role}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {project.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Technologies:</span>{' '}
                      {project.techStack.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.degree} className="border-l-2 border-primary/30 pl-4">
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-sm text-primary">{edu.institution}</p>
                    <p className="text-sm text-muted-foreground">
                      {edu.field} • {edu.year} • {edu.grade}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Certifications
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="p-4 bg-muted/50 rounded-lg"
                  >
                    <h3 className="font-medium text-foreground text-sm">
                      {cert.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Languages
              </h2>
              <p className="text-muted-foreground">
                {resumeData.languages.join(' • ')}
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
