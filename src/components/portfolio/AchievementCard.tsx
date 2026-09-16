import React from 'react';
import { Trophy, ExternalLink, Calendar, Flame } from 'lucide-react';
import { Achievement } from '../../types/achievement';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <Card glass hoverEffect className="p-0 overflow-hidden flex flex-col justify-between border-border/80">
      {achievement.imageUrl && (
        <div className="relative aspect-[16/8] w-full bg-muted overflow-hidden">
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="ai" size="sm">
              <Trophy className="w-3 h-3 text-amber-400" />
              {achievement.category}
            </Badge>
          </div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span className="font-semibold text-primary">{achievement.organization}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {achievement.date}
            </span>
          </div>

          <h3 className="font-display font-bold text-base text-foreground leading-snug">
            {achievement.title}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {achievement.description}
          </p>
        </div>

        {achievement.proofUrl && (
          <div className="pt-3 border-t border-border/60 flex justify-end">
            <a
              href={achievement.proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              View Proof / Project
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};
