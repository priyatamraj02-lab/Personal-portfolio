import React from 'react';
import { ExternalLink, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { Certification } from '../../types/certification';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CertificationCardProps {
  cert: Certification;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({ cert }) => {
  return (
    <Card glass hoverEffect className="p-0 overflow-hidden flex flex-col justify-between border-border/80">
      {/* Certificate Image Banner */}
      {cert.certificateImage && (
        <div className="relative aspect-[16/8] w-full bg-muted overflow-hidden">
          <img
            src={cert.certificateImage}
            alt={cert.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
            <span className="text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              {cert.issuingOrganization}
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-display font-bold text-base text-foreground line-clamp-2">
            {cert.name}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-primary" />
              {cert.issueDate}
            </span>
            {cert.credentialId && (
              <span className="truncate max-w-[140px]" title={cert.credentialId}>
                ID: {cert.credentialId}
              </span>
            )}
          </div>
        </div>

        {/* Skills Covered */}
        {cert.skillsCovered && cert.skillsCovered.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Skills Validated:
            </span>
            <div className="flex flex-wrap gap-1">
              {cert.skillsCovered.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-muted/60 text-foreground/80 font-mono text-[10px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Verification Link */}
        {cert.credentialUrl && (
          <div className="pt-3 border-t border-border/60 flex items-center justify-between">
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Certificate
            </span>
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Verify Credential
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </Card>
  );
};
