import React, { useState, useEffect } from 'react';
import { Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Certification } from '../../types/certification';
import { CertificationCard } from '../../components/portfolio/CertificationCard';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';

export const CertificationsPage: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const data = await apiService.getCertifications();
        setCertifications(data);
      } catch (err) {
        console.error('Error fetching certifications', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="primary" size="md">
          <Award className="w-3.5 h-3.5" />
          Industry Credentials
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          Professional Certifications
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Verified accreditations across Machine Learning, Generative AI, Computer Vision, and Data Science from global institutions.
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
          {certifications.map((cert) => (
            <CertificationCard key={cert.id || cert.name} cert={cert} />
          ))}
        </div>
      )}
    </div>
  );
};
