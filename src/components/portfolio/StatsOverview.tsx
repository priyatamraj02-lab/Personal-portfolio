import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Sparkles, Award } from 'lucide-react';
import { Github } from '../ui/BrandIcons';
import { Card } from '../ui/Card';

interface StatsOverviewProps {
  stats: {
    projectsCompleted: number;
    skillsMastered: number;
    certificationsEarned: number;
    githubRepositories: number;
  };
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Projects Built',
      value: `${stats.projectsCompleted}+`,
      subtitle: 'End-to-End AI & ML',
      icon: FolderGit2,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10'
    },
    {
      label: 'Technical Skills',
      value: `${stats.skillsMastered}+`,
      subtitle: 'Languages, Libs & Tools',
      icon: Sparkles,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10'
    },
    {
      label: 'Certifications',
      value: `${stats.certificationsEarned}`,
      subtitle: 'Industry Credentials',
      icon: Award,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      label: 'GitHub Repos',
      value: `${stats.githubRepositories}+`,
      subtitle: 'Open Source Code',
      icon: Github,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card glass hoverEffect className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.bg} ${item.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="font-display font-extrabold text-2xl sm:text-3xl text-foreground block leading-tight">
                  {item.value}
                </span>
                <span className="text-xs font-semibold text-foreground/90 block truncate">
                  {item.label}
                </span>
                <span className="text-[11px] text-muted-foreground block truncate">
                  {item.subtitle}
                </span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
