import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Award, Sparkles } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Education } from '../../types/education';
import { TimelineItem } from '../../components/portfolio/TimelineItem';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export const EducationPage: React.FC = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEdu = async () => {
      try {
        const data = await apiService.getEducation();
        setEducation(data);
      } catch (err) {
        console.error('Error fetching education', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEdu();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="primary" size="md">
          <GraduationCap className="w-3.5 h-3.5" />
          Academic Foundations
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          Education & Coursework
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Rigorous academic grounding in Computer Science & Engineering with an emphasis on Data Science, Applied Mathematics, and Machine Intelligence.
        </p>
      </div>

      {/* Education Timeline */}
      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="relative pt-4">
          {education.map((edu, index) => (
            <TimelineItem
              key={edu.id || index}
              title={edu.degree}
              subtitle={edu.institution}
              period={`${edu.startYear} – ${edu.endYear}`}
              location={edu.location}
              type={edu.gradeOrCgpa}
              description={edu.description}
              technologies={edu.relevantCoursework}
              isLast={index === education.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
