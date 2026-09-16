import React from 'react';
import { Star, GitFork, ExternalLink, Code } from 'lucide-react';
import { GithubRepo } from '../../types/github';
import { Card } from '../ui/Card';

interface GithubRepoCardProps {
  repo: GithubRepo;
}

export const GithubRepoCard: React.FC<GithubRepoCardProps> = ({ repo }) => {
  return (
    <Card glass hoverEffect className="p-5 flex flex-col justify-between space-y-4 border-border/80">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-bold text-base text-foreground hover:text-primary transition-colors flex items-center gap-1.5 line-clamp-1"
          >
            {repo.name}
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
          </a>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {repo.description}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-mono text-[10px]"
              >
                #{topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span className="flex items-center gap-1.5 text-foreground/80">
          <Code className="w-3.5 h-3.5 text-primary" />
          {repo.language}
        </span>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            {repo.starsCount}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5" />
            {repo.forksCount}
          </span>
        </div>
      </div>
    </Card>
  );
};
