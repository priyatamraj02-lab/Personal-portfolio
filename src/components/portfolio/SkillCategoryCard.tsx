import React from 'react';
import * as Icons from 'lucide-react';
import { Skill, SkillCategory } from '../../types/skill';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface SkillCategoryCardProps {
  category: SkillCategory;
  skills: Skill[];
}

export const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({ category, skills }) => {
  const categoryConfig: Record<SkillCategory, { color: string; bg: string; icon: any }> = {
    'Programming': { color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: Icons.Code },
    'Data Science': { color: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: Icons.Binary },
    'Machine Learning': { color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Icons.Boxes },
    'Deep Learning': { color: 'text-pink-500', bg: 'bg-pink-500/10', icon: Icons.ScanFace },
    'Generative AI': { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Icons.Wand2 },
    'Tools': { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: Icons.Terminal }
  };

  const config = categoryConfig[category] || { color: 'text-primary', bg: 'bg-primary/10', icon: Icons.Sparkles };
  const CategoryIcon = config.icon;

  const getDynamicIcon = (iconName?: string) => {
    if (!iconName) return <Icons.CheckCircle2 className="w-3.5 h-3.5 text-primary" />;
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-3.5 h-3.5 text-primary" />;
    }
    return <Icons.CheckCircle2 className="w-3.5 h-3.5 text-primary" />;
  };

  return (
    <Card glass hoverEffect className="p-6 flex flex-col justify-between space-y-5 border-border/80">
      {/* Category Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${config.bg} ${config.color}`}>
            <CategoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-foreground">{category}</h3>
            <span className="text-[11px] text-muted-foreground">{skills.length} Competencies</span>
          </div>
        </div>
      </div>

      {/* Skills Grid / Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {skills.map((skill) => (
          <div
            key={skill.id || skill.name}
            className="flex items-center justify-between p-2.5 rounded-xl bg-card/60 hover:bg-accent/40 border border-border/60 transition-colors group"
            title={skill.description}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1 rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                {getDynamicIcon(skill.icon)}
              </span>
              <span className="text-xs font-semibold text-foreground truncate">
                {skill.name}
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/80 px-1.5 py-0.5 rounded bg-muted/60 shrink-0 ml-1">
              {skill.level}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
