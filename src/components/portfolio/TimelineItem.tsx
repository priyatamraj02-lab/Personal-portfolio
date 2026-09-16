import React from 'react';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  location?: string;
  type?: string;
  description: string[] | string;
  technologies?: string[];
  proofUrl?: string;
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  subtitle,
  period,
  location,
  type,
  description,
  technologies,
  proofUrl,
  isLast = false
}) => {
  return (
    <div className="relative pl-8 sm:pl-10 group">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[11px] sm:left-[15px] top-6 bottom-0 w-[2px] bg-border group-hover:bg-primary/40 transition-colors" />
      )}

      {/* Timeline Bullet Node */}
      <div className="absolute left-0 top-1.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>

      {/* Main Content Card */}
      <Card glass hoverEffect className="p-6 space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-base sm:text-lg text-foreground">{title}</h3>
              {type && <Badge variant="primary" size="sm">{type}</Badge>}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">{subtitle}</p>
          </div>
          <div className="flex flex-col sm:items-end text-xs text-muted-foreground font-mono space-y-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {period}
            </span>
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {location}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="text-xs sm:text-sm text-muted-foreground space-y-2 leading-relaxed">
          {Array.isArray(description) ? (
            <ul className="list-disc list-inside space-y-1.5">
              {description.map((item, idx) => (
                <li key={idx} className="leading-normal">{item}</li>
              ))}
            </ul>
          ) : (
            <p>{description}</p>
          )}
        </div>

        {/* Technologies / Coursework Tags */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-muted/60 text-foreground/80 font-mono text-[10px] font-medium border border-border/50"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Proof / Organization Link */}
        {proofUrl && (
          <div className="pt-2">
            <a
              href={proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Verify Credential / Organization
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};
