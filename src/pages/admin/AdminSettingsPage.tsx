import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Settings, Save, Database, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { SiteSettings } from '../../types/settings';
import { initialSettings } from '../../data/initialSettings';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const AdminSettingsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { isFirebaseConfigured } = useAuth();
  const { success, error: toastError } = useToast();

  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [keywordsInput, setKeywordsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiService.getSettings();
        setSettings(data);
        setKeywordsInput(data.metaKeywords?.join(', ') || '');
      } catch (err) {
        console.error('Error fetching settings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const cleanedKeywords = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);

    const payload = {
      ...settings,
      metaKeywords: cleanedKeywords
    };

    try {
      await apiService.updateSettings(payload);
      success('Settings Saved', 'Site configuration has been updated.');
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await apiService.seedInitialDataToFirestore();
      if (res.success) {
        success('Seed Completed', res.message);
      } else {
        toastError('Seed Failed', res.message);
      }
    } catch (err: any) {
      toastError('Seed Error', err?.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="System & Site Settings"
        subtitle="Configure SEO metadata, database connection status, and one-click cloud seeder"
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl">
        {/* Firebase Cloud Seeder Card */}
        <Card glass className="p-6 space-y-4 border-primary/40 bg-gradient-to-r from-primary/5 via-card to-cyan-500/5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-foreground">
                  One-Click Database Seeder
                </h3>
                {isFirebaseConfigured ? (
                  <Badge variant="success" size="sm">Firebase Connected</Badge>
                ) : (
                  <Badge variant="warning" size="sm">Local Sandbox Mode</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Populate Firestore with all initial showcase projects, skills catalog, profile, and education with a single click.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Includes 5 full project case studies & 29 categorized skills.
            </span>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSeed}
              loading={seeding}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Seed All Initial Data
            </Button>
          </div>
        </Card>

        {/* SEO & Site Config Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <Card glass className="p-6 space-y-4 border-border/80">
            <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              SEO & Metadata
            </h3>

            <Input
              label="Website Title (Tab Title) *"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              required
            />

            <Textarea
              label="Meta Description (Search Engines) *"
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              required
            />

            <Input
              label="Meta Keywords (Comma separated)"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="Priyatam Raj, Machine Learning, Deep Learning, Generative AI"
            />
          </Card>

          <Card glass className="p-6 space-y-4 border-border/80">
            <h3 className="font-display font-bold text-base text-foreground">
              Feature & Footer Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GitHub Username"
                value={settings.githubUsername}
                onChange={(e) => setSettings({ ...settings, githubUsername: e.target.value })}
              />
              <Input
                label="Availability Pill Text"
                value={settings.availabilityText}
                onChange={(e) => setSettings({ ...settings, availabilityText: e.target.value })}
              />
            </div>

            <Textarea
              label="Footer Quote"
              rows={2}
              value={settings.footerQuote}
              onChange={(e) => setSettings({ ...settings, footerQuote: e.target.value })}
            />

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={settings.enableContactForm}
                  onChange={(e) => setSettings({ ...settings, enableContactForm: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Enable Public Contact Submission Form</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={settings.showAvailabilityBadge}
                  onChange={(e) => setSettings({ ...settings, showAvailabilityBadge: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Show "Open to Opportunities" Pulsing Badge in Hero</span>
              </label>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              variant="primary"
              loading={saving}
              icon={<Save className="w-4 h-4" />}
            >
              Save Settings
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
