import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Upload, Save, FileDown, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { storageService } from '../../services/storageService';
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
  const [uploading, setUploading] = useState(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toastError('Invalid File Type', 'Please upload a valid PDF document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toastError('File Too Large', 'Resume PDF must be under 10MB.');
      return;
    }

    setUploading(true);
    try {
      const downloadUrl = await storageService.uploadFile(file, 'resume');
      setResumeUrl(downloadUrl);
      const prof = (await apiService.getProfile()) || fallbackProfile;
      await apiService.updateProfile({ ...prof, resumeUrl: downloadUrl });
      success('Resume Uploaded!', 'New PDF is now active across the website.');
    } catch (err: any) {
      toastError('Upload Failed', err?.message);
    } finally {
      setUploading(false);
    }
  };

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

          {/* Upload Area */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground/80 uppercase tracking-wide">
              Upload New PDF Document
            </label>
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                id="resume-upload"
                className="hidden"
              />
              <label
                htmlFor="resume-upload"
                className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border/80 bg-card/60 hover:bg-muted/60 text-center cursor-pointer transition-colors ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                    <span className="font-semibold text-sm">Uploading and deploying resume...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-primary mb-2" />
                    <span className="font-bold text-sm text-foreground">
                      Click to upload new PDF resume
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Max file size: 10MB
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Manual URL Input */}
          <form onSubmit={handleSaveUrl} className="space-y-4 pt-4 border-t border-border">
            <Input
              label="Or specify direct URL / storage link"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://firebasestorage.googleapis.com/... or /sample-resume.pdf"
            />

            <div className="flex items-center justify-between">
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
