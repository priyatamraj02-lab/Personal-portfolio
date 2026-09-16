import React, { useState, useEffect } from 'react';
import { Briefcase, Sparkles, Building2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Experience } from '../../types/experience';
import { TimelineItem } from '../../components/portfolio/TimelineItem';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export const ExperiencePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExp = async () => {
      try {
        const data = await apiService.getExperience();
        setExperiences(data);
      } catch (err) {
        console.error('Error fetching experience', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExp();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="primary" size="md">
          <Briefcase className="w-3.5 h-3.5" />
          Career Journey
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          Experience & Research
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Academic lab leadership, open-source model evaluations, and research projects in Computer Vision and Natural Language Processing.
        </p>
      </div>

      {/* Timeline or Empty State */}
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      ) : experiences.length === 0 ? (
        <Card glass className="p-12 text-center space-y-4">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-display font-bold text-xl text-foreground">Early Career Stage</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Currently focused on academic coursework at Centurion University (2024–2028), independent AI research, and high-impact machine learning projects. Open to internship and research opportunities!
          </p>
        </Card>
      ) : (
        <div className="relative pt-4">
          {experiences.map((exp, index) => (
            <TimelineItem
              key={exp.id || index}
              title={exp.role}
              subtitle={exp.organization}
              period={`${exp.startDate} – ${exp.endDate}`}
              location={exp.location}
              type={exp.type}
              description={exp.description}
              technologies={exp.technologies}
              proofUrl={exp.proofUrl}
              isLast={index === experiences.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
