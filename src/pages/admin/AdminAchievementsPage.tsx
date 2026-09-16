import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Trophy, Plus, Edit, Trash2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Achievement } from '../../types/achievement';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ImageUpload } from '../../components/admin/ImageUpload';

const emptyAch: Omit<Achievement, 'id'> = {
  title: '',
  organization: '',
  date: '',
  category: 'Hackathon',
  description: '',
  proofUrl: '',
  imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  order: 1
};

export const AdminAchievementsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Achievement, 'id'>>(emptyAch);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Achievement | null>(null);

  const fetchAch = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAchievements();
      setAchievements(data);
    } catch (err) {
      console.error('Error fetching achievements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAch();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyAch,
      order: achievements.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingId(ach.id || null);
    setFormData({ ...ach });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim()) {
      toastError('Validation Error', 'Title and Organization are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await apiService.updateAchievement(editingId, formData);
        success('Achievement Updated', `${formData.title} was updated.`);
      } else {
        await apiService.createAchievement(formData);
        success('Achievement Created', `${formData.title} was added.`);
      }
      setIsModalOpen(false);
      fetchAch();
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await apiService.deleteAchievement(itemToDelete.id);
      success('Achievement Deleted', `${itemToDelete.title} was removed.`);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchAch();
    } catch (err: any) {
      toastError('Delete Error', err?.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Achievements & Honors Management"
        subtitle="Manage hackathon victories, competitions, and academic honors"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Achievement
          </Button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        <Card glass className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-muted-foreground uppercase font-mono text-[11px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Title</th>
                  <th className="py-3.5 px-4 font-semibold">Organization</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {achievements.map((ach) => (
                  <tr key={ach.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{ach.title}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{ach.organization}</td>
                    <td className="py-3.5 px-4"><Badge variant="ai" size="sm">{ach.category}</Badge></td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{ach.date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(ach)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(ach);
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
        title={editingId ? 'Edit Achievement' : 'Add Achievement'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Achievement Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. 1st Place - Smart Odisha Hackathon"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization / Host *"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="Centurion University"
              required
            />
            <Input
              label="Date / Year"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              placeholder="Nov 2024"
            />
          </div>

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            options={[
              { label: 'Hackathon', value: 'Hackathon' },
              { label: 'Competition', value: 'Competition' },
              { label: 'Academic', value: 'Academic' },
              { label: 'Open Source', value: 'Open Source' },
              { label: 'Certification', value: 'Certification' },
            ]}
          />

          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Built real-time AI vision prototype..."
          />

          <ImageUpload
            label="Achievement Image / Certificate"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            folder="achievements"
          />

          <Input
            label="Proof / Project URL"
            value={formData.proofUrl || ''}
            onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
            placeholder="https://..."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingId ? 'Save Changes' : 'Create Achievement'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Achievement?"
        message={`Are you sure you want to remove "${itemToDelete?.title}"?`}
      />
    </div>
  );
};
