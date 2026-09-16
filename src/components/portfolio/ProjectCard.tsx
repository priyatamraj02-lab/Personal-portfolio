import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Activity } from 'lucide-react';
import { Github } from '../ui/BrandIcons';
import { Project } from '../../types/project';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const categoryVariantMap: Record<string, 'ai' | 'cyan' | 'primary' | 'success' | 'warning'> = {
    'Generative AI': 'ai',
    'Deep Learning': 'cyan',
    'Machine Learning': 'primary',
    'Data Science': 'success',
    'AI Applications': 'warning',
  };

  const primaryMetric = project.evaluationMetrics?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
    >
      <Card glass hoverEffect className="group flex flex-col h-full p-0 overflow-hidden border border-border/80">
        {/* Project Thumbnail Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Top Overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <Badge variant={categoryVariantMap[project.category] || 'primary'} size="sm">
              {project.category}
            </Badge>
            {primaryMetric && (
              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-emerald-300 font-mono text-[11px] font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                {primaryMetric.label}: {primaryMetric.value}
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <Link to={`/projects/${project.slug}`}>
              <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-muted/60 text-foreground/80 font-mono text-[10px] font-medium border border-border/50"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md bg-muted/40 text-muted-foreground font-mono text-[10px]">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Action Links */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="View Source on GitHub"
                  title="Source Code"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                  aria-label="Live Demo Link"
                  title="Live Demo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <Link to={`/projects/${project.slug}`}>
              <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10 gap-1 text-xs">
                Case Study
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
