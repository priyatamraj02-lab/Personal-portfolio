import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Save, User, Sparkles } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Profile } from '../../types/profile';
import { initialProfile } from '../../data/initialProfile';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ImageUpload } from '../../components/admin/ImageUpload';

export const AdminProfilePage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiService.updateProfile(profile);
      success('Profile Updated', 'Changes are now live on your portfolio.');
    } catch (err: any) {
      toastError('Save Failed', err?.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Edit Profile Information"
        subtitle="Update name, headline, bio, about story, and contact coordinates"
      />

      <main className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Image & Basic Info Card */}
          <Card glass className="p-6 space-y-6 border-border/80">
            <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Primary Identity
            </h2>

            <ImageUpload
              label="Profile Photo"
              value={profile.profileImage}
              onChange={(url) => setProfile({ ...profile, profileImage: url })}
              folder="profile"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
              <Input
                label="Professional Headline *"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Availability Status"
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value as any })}
                options={[
                  { label: 'Open to Opportunities', value: 'Open to Opportunities' },
                  { label: 'Available for Hire', value: 'Available' },
                  { label: 'Currently Busy', value: 'Busy' },
                ]}
              />
              <Input
                label="Location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>

            <Textarea
              label="Short Bio (Hero Section) *"
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              required
            />
          </Card>

          {/* About Story Paragraphs */}
          <Card glass className="p-6 space-y-4 border-border/80">
            <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Detailed Story Paragraphs (/about page)
            </h2>

            <Textarea
              label="Story Paragraph 1"
              rows={3}
              value={profile.aboutText?.[0] || ''}
              onChange={(e) => {
                const arr = [...(profile.aboutText || [])];
                arr[0] = e.target.value;
                setProfile({ ...profile, aboutText: arr });
              }}
            />

            <Textarea
              label="Story Paragraph 2"
              rows={3}
              value={profile.aboutText?.[1] || ''}
              onChange={(e) => {
                const arr = [...(profile.aboutText || [])];
                arr[1] = e.target.value;
                setProfile({ ...profile, aboutText: arr });
              }}
            />

            <Textarea
              label="Story Paragraph 3"
              rows={3}
              value={profile.aboutText?.[2] || ''}
              onChange={(e) => {
                const arr = [...(profile.aboutText || [])];
                arr[2] = e.target.value;
                setProfile({ ...profile, aboutText: arr });
              }}
            />
          </Card>

          {/* Current Focus & Career Goals */}
          <Card glass className="p-6 space-y-4 border-border/80">
            <h2 className="font-display font-bold text-base text-foreground">
              Learning Focus & Career Objectives
            </h2>

            <Input
              label="Current Focus"
              value={profile.currentFocus}
              onChange={(e) => setProfile({ ...profile, currentFocus: e.target.value })}
            />

            <Input
              label="Learning Focus / Frontier"
              value={profile.learningFocus}
              onChange={(e) => setProfile({ ...profile, learningFocus: e.target.value })}
            />

            <Input
              label="Career Goals"
              value={profile.careerGoals}
              onChange={(e) => setProfile({ ...profile, careerGoals: e.target.value })}
            />
          </Card>

          {/* Contact Coordinates & Social Profiles */}
          <Card glass className="p-6 space-y-4 border-border/80">
            <h2 className="font-display font-bold text-base text-foreground">
              Contact & Social Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <Input
                label="Phone (Optional)"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GitHub URL"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
              />
              <Input
                label="LinkedIn URL"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
              />
            </div>

            <Input
              label="Resume File URL / Path"
              value={profile.resumeUrl}
              onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
            />
          </Card>

          {/* Save Action */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              loading={saving}
              icon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
