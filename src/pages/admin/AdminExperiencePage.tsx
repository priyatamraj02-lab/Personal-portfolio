import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Briefcase, Plus, Edit, Trash2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Experience } from '../../types/experience';
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

const emptyExp: Omit<Experience, 'id'> = {
  organization: '',
  role: '',
  location: '',
  type: 'Research',
  startDate: '',
  endDate: 'Present',
  current: true,
  description: [''],
  technologies: [],
  proofUrl: '',
  order: 1
};

export const AdminExperiencePage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>(emptyExp);
  const [descInput, setDescInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Experience | null>(null);

  const fetchExp = async () => {
    setLoading(true);
    try {
      const data = await apiService.getExperience();
      setExperiences(data);
    } catch (err) {
      console.error('Error fetching experiences', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExp();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyExp,
      order: experiences.length + 1
    });
    setDescInput('');
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingId(exp.id || null);
    setFormData({ ...exp });
    setDescInput(exp.description.join('\n'));
    setTechInput(exp.technologies.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organization.trim() || !formData.role.trim()) {
      toastError('Validation Error', 'Organization and Role are required.');
      return;
    }

    setSaving(true);
    const cleanedDesc = descInput.split('\n').map(d => d.trim()).filter(Boolean);
    const cleanedTech = techInput.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      ...formData,
      description: cleanedDesc.length > 0 ? cleanedDesc : ['Contributed to AI/ML projects.'],
      technologies: cleanedTech
    };

    try {
      if (editingId) {
        await apiService.updateExperience(editingId, payload);
        success('Experience Updated', `${payload.role} was updated.`);
      } else {
        await apiService.createExperience(payload);
        success('Experience Created', `${payload.role} was added.`);
      }
      setIsModalOpen(false);
      fetchExp();
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await apiService.deleteExperience(itemToDelete.id);
      success('Experience Deleted', `${itemToDelete.role} was removed.`);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchExp();
    } catch (err: any) {
      toastError('Delete Error', err?.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Experience & Research Management"
        subtitle="Manage academic leadership, internships, and open-source contributions"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Experience Entry
          </Button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        <Card glass className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-muted-foreground uppercase font-mono text-[11px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Organization</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Period</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{exp.role}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{exp.organization}</td>
                    <td className="py-3.5 px-4"><Badge variant="primary" size="sm">{exp.type}</Badge></td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{exp.startDate} – {exp.endDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(exp);
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
        title={editingId ? 'Edit Experience' : 'Add Experience Entry'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Role / Title *"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. AI Research Lead"
              required
            />
            <Input
              label="Organization *"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder="e.g. Centurion AI Lab"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              options={[
                { label: 'Research', value: 'Research' },
                { label: 'Open Source', value: 'Open Source' },
                { label: 'Internship', value: 'Internship' },
                { label: 'Full-time', value: 'Full-time' },
                { label: 'Part-time', value: 'Part-time' },
              ]}
            />
            <Input
              label="Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              placeholder="Aug 2024"
            />
            <Input
              label="End Date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              placeholder="Present"
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Centurion University, India"
          />

          <Textarea
            label="Bullet Points (One per line) *"
            rows={4}
            value={descInput}
            onChange={(e) => setDescInput(e.target.value)}
            placeholder="Led development of YOLO computer vision models..."
            required
          />

          <Input
            label="Technologies (Comma separated)"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Python, PyTorch, YOLOv8"
          />

          <Input
            label="Proof / Organization URL"
            value={formData.proofUrl || ''}
            onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
            placeholder="https://..."
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingId ? 'Save Changes' : 'Create Entry'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Experience Entry?"
        message={`Are you sure you want to remove "${itemToDelete?.role}" at ${itemToDelete?.organization}?`}
      />
    </div>
  );
};
