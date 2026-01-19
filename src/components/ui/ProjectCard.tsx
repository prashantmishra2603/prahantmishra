import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

interface ProjectCardProps {
  project: Project;
  index: number;
  onViewDetails: (project: Project) => void;
}

export function ProjectCard({ project, index, onViewDetails }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-elevated group overflow-hidden"
    >
      {/* Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {project.title.charAt(0)}
            </span>
          </div>
        </div>
        {project.featured && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground">{project.role}</p>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2">
          {project.description}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {project.badges.slice(0, 3).map((badge) => (
            <Badge key={badge} variant="secondary" className="text-xs">
              {badge}
            </Badge>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md hover:bg-muted transition-colors focus-ring"
              aria-label={`View ${project.title} on GitHub`}
            >
              <Github className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </a>
            {project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md hover:bg-muted transition-colors focus-ring"
                aria-label={`View ${project.title} live demo`}
              >
                <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              </a>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(project)}
            className="text-primary hover:text-primary-foreground hover:bg-primary group/btn"
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
