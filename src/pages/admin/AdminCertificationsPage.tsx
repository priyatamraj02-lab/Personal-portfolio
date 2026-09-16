import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Award, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Certification } from '../../types/certification';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const emptyCert: Omit<Certification, 'id'> = {
  name: '',
  issuingOrganization: '',
  issueDate: '',
  credentialId: '',
  credentialUrl: '',
  certificateImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
  skillsCovered: [],
  order: 1
};

export const AdminCertificationsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>(emptyCert);
  const [skillsInput, setSkillsInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Certification | null>(null);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getCertifications();
      setCerts(data);
    } catch (err) {
      console.error('Error fetching certs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyCert,
      order: certs.length + 1
    });
    setSkillsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setEditingId(cert.id || null);
    setFormData({ ...cert });
    setSkillsInput(cert.skillsCovered?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.issuingOrganization.trim()) {
      toastError('Validation Error', 'Certificate Name and Organization are required.');
      return;
    }

    setSaving(true);
    const cleanedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...formData,
      skillsCovered: cleanedSkills
    };

    try {
      if (editingId) {
        await apiService.updateCertification(editingId, payload);
        success('Certificate Updated', `${payload.name} was updated.`);
      } else {
        await apiService.createCertification(payload);
        success('Certificate Created', `${payload.name} was added.`);
      }
      setIsModalOpen(false);
      fetchCerts();
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await apiService.deleteCertification(itemToDelete.id);
      success('Certificate Deleted', `${itemToDelete.name} was removed.`);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchCerts();
    } catch (err: any) {
      toastError('Delete Error', err?.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Certifications Management"
        subtitle="Manage professional credentials, badges, and verification links"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Certificate
          </Button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        <Card glass className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-muted-foreground uppercase font-mono text-[11px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Certificate Name</th>
                  <th className="py-3.5 px-4 font-semibold">Organization</th>
                  <th className="py-3.5 px-4 font-semibold">Issue Date</th>
                  <th className="py-3.5 px-4 font-semibold">Credential ID</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {certs.map((cert) => (
                  <tr key={cert.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{cert.name}</td>
                    <td className="py-3.5 px-4 text-primary font-medium">{cert.issuingOrganization}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{cert.issueDate}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{cert.credentialId || '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(cert)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(cert);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Certificate' : 'Add Certification'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Certificate Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Machine Learning Specialization"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Issuing Organization *"
              value={formData.issuingOrganization}
              onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
              placeholder="DeepLearning.AI / Coursera"
              required
            />
            <Input
              label="Issue Date"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              placeholder="Dec 2024"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Credential ID"
              value={formData.credentialId || ''}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              placeholder="e.g. DL-AI-ML-893472"
            />
            <Input
              label="Verification URL"
              value={formData.credentialUrl || ''}
              onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
              placeholder="https://coursera.org/verify/..."
            />
          </div>

          <Input
            label="Certificate Badge / Image URL (Optional)"
            value={formData.certificateImage || ''}
            onChange={(e) => setFormData({ ...formData, certificateImage: e.target.value })}
            placeholder="https://... or /assets/..."
          />

          <Input
            label="Skills Validated (Comma separated)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="Neural Networks, Python, Computer Vision"
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingId ? 'Save Changes' : 'Create Certificate'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Certificate?"
        message={`Are you sure you want to remove "${itemToDelete?.name}"?`}
      />
    </div>
  );
};
