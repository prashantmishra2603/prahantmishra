import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Award, ExternalLink, Briefcase, CheckCircle2, Calendar, Loader2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TimelineItem } from '@/components/ui/TimelineItem';
import { SkillBadge } from '@/components/ui/SkillBadge';
import {
  fetchResumeData, fetchProfilePic,
  getCachedResumeData, getCachedProfilePic,
  type ResumeData,
} from '@/lib/dataService';
import defaultProfilePic from '@/assets/myimage.jpeg';

export default function About() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(getCachedResumeData());
  const [profilePic, setProfilePic] = useState<string>(getCachedProfilePic() || defaultProfilePic);
  const [loading, setLoading] = useState(!getCachedResumeData());

  const loadData = async () => {
    try {
      const [resume, pic] = await Promise.all([fetchResumeData(), fetchProfilePic()]);
      setResumeData(resume);
      if (pic) setProfilePic(pic);
      else setProfilePic(defaultProfilePic);
    } catch (err) {
      console.error('Failed to load about data:', err);
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
      {/* Hero */}
      <section className="section-container mb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-[460px] lg:h-[560px] rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={profilePic}
              alt="Prashant Mishra"
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: 'center top' }}
              onError={(e) => { (e.target as HTMLImageElement).src = defaultProfilePic; }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/20" />
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-4 uppercase tracking-wider">
              About Me
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {personal.name}
            </h1>
            <p className="text-xl text-primary font-medium mb-4">
              {personal.title}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="w-4 h-4" />
              <span>{personal.location}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {personal.summary}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Work Experience Section */}
      {experiences && experiences.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 border-y border-border">
          <div className="section-container">
            <SectionHeading
              badge="Experience"
              title="Work Experience"
              subtitle="Professional roles and internships that shaped my engineering career"
            />

            <div className="max-w-3xl mx-auto space-y-6">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative card-elevated p-6 md:p-8 overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-l-2xl" />

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                        <p className="text-primary font-semibold">{exp.company}</p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />{exp.location}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />{exp.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full self-start md:self-auto whitespace-nowrap">
                      {exp.type}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 ml-16">
                    {exp.description}
                  </p>

                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="ml-16 space-y-2">
                      {exp.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="section-container">
          <SectionHeading badge="Skills" title="My Technical Skills" subtitle="Technologies and tools I use to bring ideas to life" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { label: 'Frontend Development', color: 'bg-blue-500', items: skills.frontend },
              { label: 'Backend Development', color: 'bg-green-500', items: skills.backend },
              { label: 'Databases', color: 'bg-orange-500', items: skills.database },
              { label: 'Programming Languages', color: 'bg-purple-500', items: skills.languages },
              { label: 'Tools & Platforms', color: 'bg-cyan-500', items: skills.tools },
              { label: 'Other Skills', color: 'bg-pink-500', items: skills.other },
            ].map((cat, index) => (
              <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <span className={`w-2 h-2 ${cat.color} rounded-full`} />{cat.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((skill, i) => <SkillBadge key={skill} skill={skill} index={i} />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20">
        <div className="section-container">
          <SectionHeading badge="Education" title="Academic Background" subtitle="My educational journey and qualifications" />
          <div className="max-w-2xl mx-auto">
            {education.map((edu, index) => (
              <TimelineItem
                key={edu.degree}
                title={edu.degree}
                subtitle={edu.institution}
                description={`${edu.field} • ${edu.grade}`}
                date={edu.year}
                index={index}
                icon={<GraduationCap className="w-4 h-4 text-primary" />}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 bg-card border-y border-border">
        <div className="section-container">
          <SectionHeading badge="Certifications" title="Professional Certifications" subtitle="Continuous learning and skill validation" />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.a
                key={cert.name}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 group focus-ring"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cert.issuer} • {cert.year}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
