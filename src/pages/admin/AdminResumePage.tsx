import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Save, ExternalLink } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

import { Profile } from '../../types/profile';

const fallbackProfile: Profile = {
  id: 'default',
  name: 'Priyatam Raj',
  headline: 'Data Science & AI',
  bio: '',
  aboutText: [],
  currentFocus: '',
  learningFocus: '',
  careerGoals: '',
  location: '',
  email: '',
  phone: '',
  githubUrl: '',
  linkedinUrl: '',
  resumeUrl: '',
  profileImage: '',
  availability: 'Open to Opportunities',
  yearsOfExperience: ''
};

export const AdminResumePage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [resumeUrl, setResumeUrl] = useState('/sample-resume.pdf');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const prof = await apiService.getProfile();
        if (prof?.resumeUrl) {
          setResumeUrl(prof.resumeUrl);
        }
      } catch (err) {
        console.error('Error fetching resume link from Firestore', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const prof = (await apiService.getProfile()) || fallbackProfile;
      await apiService.updateProfile({ ...prof, resumeUrl: resumeUrl.trim() });
      success('Resume URL Updated', 'The new resume link is now saved in Firestore.');
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Resume & CV Management"
        subtitle="Upload your latest PDF resume or link to an external document"
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
        {/* Upload Card */}
        <Card glass className="p-6 space-y-6 border-border/80">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                Current Resume Configuration
              </h2>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                Path: {resumeUrl}
              </p>
            </div>
          </div>

          {/* Resume Link Input Form */}
          <form onSubmit={handleSaveUrl} className="space-y-4">
            <Input
              label="Resume PDF Link / File Path"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="/sample-resume.pdf or https://..."
              required
            />

            <div className="flex items-center justify-between pt-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview Current Resume in New Tab
              </a>

              <Button
                type="submit"
                size="sm"
                variant="primary"
                loading={saving}
                icon={<Save className="w-4 h-4" />}
              >
                Save Resume Link
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};
