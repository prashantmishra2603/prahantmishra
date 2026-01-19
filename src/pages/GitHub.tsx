import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GitHubRepoCard, type GitHubRepo } from '@/components/ui/GitHubRepoCard';
import { Button } from '@/components/ui/button';

const GITHUB_USERNAME = 'prashantmishra2603';

export default function GitHubPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();

      // Sort by stars (most starred first)
      const sortedRepos = data.sort(
        (a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count
      );

      setRepos(sortedRepos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div className="py-16">
      <div className="section-container">
        <SectionHeading
          badge="Open Source"
          title="GitHub Repositories"
          subtitle={`Explore my public repositories on GitHub @${GITHUB_USERNAME}`}
        />

        {/* GitHub Profile Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-12"
        >
          <Button asChild variant="outline">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4 mr-2" />
              View GitHub Profile
            </a>
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading repositories...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchRepos} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Repos Grid */}
        {!loading && !error && repos.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <GitHubRepoCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && repos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No repositories found.</p>
          </div>
        )}

        {/* Rate Limit Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-12"
        >
          Note: GitHub API has rate limits for unauthenticated requests.
          Showing up to 12 most recently updated repositories.
        </motion.p>
      </div>
    </div>
  );
}
