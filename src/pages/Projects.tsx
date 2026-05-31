import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard, type Project } from '@/components/ui/ProjectCard';
import { ProjectModal } from '@/components/ui/ProjectModal';
import { fetchProjectsData, getCachedProjectsData } from '@/lib/dataService';
import { Loader2 } from 'lucide-react';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');
  const [projects, setProjects] = useState<Project[]>(getCachedProjectsData()?.projects ?? []);
  const [loading, setLoading] = useState(projects.length === 0);

  const loadData = async () => {
    try {
      const data = await fetchProjectsData();
      setProjects(data.projects as Project[]);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('portfolio-data-change', loadData);
    return () => window.removeEventListener('portfolio-data-change', loadData);
  }, []);

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.featured);

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="section-container">
        <SectionHeading badge="Portfolio" title="My Projects" subtitle="A showcase of my work, featuring full-stack applications built with modern technologies" />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center gap-2 mb-12">
          {(['all', 'featured'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus-ring capitalize ${
                filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f === 'all' ? 'All Projects' : 'Featured'}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onViewDetails={setSelectedProject} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        )}
      </div>

      <ProjectModal project={selectedProject} isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
