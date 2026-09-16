import React, { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Achievement } from '../../types/achievement';
import { AchievementCard } from '../../components/portfolio/AchievementCard';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAch = async () => {
      try {
        const data = await apiService.getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error('Error fetching achievements', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAch();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="ai" size="md">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          Recognitions & Milestones
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          Honors & Achievements
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Hackathon victories, competitive data science ranks, and academic scholarship recognitions.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <AchievementCard key={ach.id || ach.title} achievement={ach} />
          ))}
        </div>
      )}
    </div>
  );
};
