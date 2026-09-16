import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GraduationCap, Plus, Edit, Trash2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Education } from '../../types/education';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const emptyEdu: Omit<Education, 'id'> = {
  degree: '',
  institution: '',
  location: '',
  startYear: '2024',
  endYear: '2028',
  gradeOrCgpa: 'Undergraduate',
  description: '',
  relevantCoursework: [],
  activitiesAndHonors: [],
  order: 1
};

export const AdminEducationPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [educationList, setEducationList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>(emptyEdu);
  const [courseworkInput, setCourseworkInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Education | null>(null);

  const fetchEdu = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEducation();
      setEducationList(data);
    } catch (err) {
      console.error('Error fetching education', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEdu();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyEdu,
      order: educationList.length + 1
    });
    setCourseworkInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingId(edu.id || null);
    setFormData({ ...edu });
    setCourseworkInput(edu.relevantCoursework.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim()) {
      toastError('Validation Error', 'Degree and Institution are required.');
      return;
    }

    setSaving(true);
    const cleanedCourses = courseworkInput.split(',').map(c => c.trim()).filter(Boolean);

    const payload = {
      ...formData,
      relevantCoursework: cleanedCourses
    };

    try {
      if (editingId) {
        await apiService.updateEducation(editingId, payload);
        success('Education Updated', `${payload.degree} was updated.`);
      } else {
        await apiService.createEducation(payload);
        success('Education Created', `${payload.degree} was added.`);
      }
      setIsModalOpen(false);
      fetchEdu();
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await apiService.deleteEducation(itemToDelete.id);
      success('Education Deleted', `${itemToDelete.degree} was removed.`);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchEdu();
    } catch (err: any) {
      toastError('Delete Error', err?.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Education Management"
        subtitle="Manage academic degrees, institutions, and relevant coursework"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Education Entry
          </Button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        <Card glass className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-muted-foreground uppercase font-mono text-[11px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Degree / Program</th>
                  <th className="py-3.5 px-4 font-semibold">Institution</th>
                  <th className="py-3.5 px-4 font-semibold">Duration</th>
                  <th className="py-3.5 px-4 font-semibold">Grade / Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {educationList.map((edu) => (
                  <tr key={edu.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{edu.degree}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{edu.institution}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{edu.startYear} – {edu.endYear}</td>
                    <td className="py-3.5 px-4 text-primary font-semibold">{edu.gradeOrCgpa}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(edu)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(edu);
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
        title={editingId ? 'Edit Education Entry' : 'Add Education Entry'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Degree / Major *"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            placeholder="e.g. B.Tech Computer Science & Engineering"
            required
          />

          <Input
            label="Institution *"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            placeholder="Centurion University of Technology and Management"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Start Year"
              value={formData.startYear}
              onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
              placeholder="2024"
            />
            <Input
              label="End Year"
              value={formData.endYear}
              onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
              placeholder="2028"
            />
            <Input
              label="Grade / CGPA"
              value={formData.gradeOrCgpa || ''}
              onChange={(e) => setFormData({ ...formData, gradeOrCgpa: e.target.value })}
              placeholder="e.g. Current Student"
            />
          </div>

          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Odisha, India"
          />

          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Core undergraduate coursework in..."
          />

          <Input
            label="Relevant Coursework (Comma separated)"
            value={courseworkInput}
            onChange={(e) => setCourseworkInput(e.target.value)}
            placeholder="Data Structures, Linear Algebra, Probability, Machine Learning"
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
        title="Delete Education Entry?"
        message={`Are you sure you want to remove "${itemToDelete?.degree}"?`}
      />
    </div>
  );
};
