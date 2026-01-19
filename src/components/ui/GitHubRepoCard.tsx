import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink } from 'lucide-react';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

interface GitHubRepoCardProps {
  repo: GitHubRepo;
  index: number;
}

const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-500',
  Python: 'bg-green-500',
  Java: 'bg-orange-500',
  HTML: 'bg-red-500',
  CSS: 'bg-purple-500',
  'C++': 'bg-pink-500',
  C: 'bg-gray-500',
};

export function GitHubRepoCard({ repo, index }: GitHubRepoCardProps) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card-elevated p-6 flex flex-col h-full group focus-ring"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {repo.name}
        </h3>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
        {repo.description || 'No description available'}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4">
          {repo.stargazers_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4" />
              <span>{repo.stargazers_count}</span>
            </div>
          )}
          {repo.forks_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <GitFork className="w-4 h-4" />
              <span>{repo.forks_count}</span>
            </div>
          )}
        </div>

        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3 h-3 rounded-full ${
                languageColors[repo.language] || 'bg-muted-foreground'
              }`}
            />
            <span className="text-xs text-muted-foreground">{repo.language}</span>
          </div>
        )}
      </div>
    </motion.a>
  );
}
