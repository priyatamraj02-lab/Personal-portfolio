import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

import { Profile } from '../types/profile';
import { Project } from '../types/project';
import { Skill } from '../types/skill';
import { Experience } from '../types/experience';
import { Education } from '../types/education';
import { Certification } from '../types/certification';
import { Achievement } from '../types/achievement';
import { GithubRepo } from '../types/github';
import { ContactMessage } from '../types/message';
import { SiteSettings } from '../types/settings';

export const apiService = {
  // -------------------------------------------------------------
  // PROFILE
  // -------------------------------------------------------------
  async getProfile(): Promise<Profile | null> {
    if (!db) return null;
    try {
      const docRef = doc(db, 'profiles', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as Profile) };
      }
      return null;
    } catch (err) {
      console.error('Firestore getProfile error:', err);
      throw err;
    }
  },

  async updateProfile(profile: Profile): Promise<Profile> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'profiles', 'main');
    await setDoc(docRef, profile, { merge: true });
    return profile;
  },

  // -------------------------------------------------------------
  // PROJECTS
  // -------------------------------------------------------------
  async getProjects(onlyPublished: boolean = false): Promise<Project[]> {
    if (!db) return [];
    try {
      const projectsRef = collection(db, 'projects');
      const q = onlyPublished 
        ? query(projectsRef, where('published', '==', true))
        : query(projectsRef);
      
      const querySnapshot = await getDocs(q);
      const list: Project[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Project) });
      });

      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Firestore getProjects error:', err);
      throw err;
    }
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (!db) return null;
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        return { id: firstDoc.id, ...(firstDoc.data() as Project) };
      }
      return null;
    } catch (err) {
      console.error('Firestore getProjectBySlug error:', err);
      throw err;
    }
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    if (!db) throw new Error('Firestore is not initialized');
    const newId = `proj-${Date.now()}`;
    const newProject: Project = { ...project, id: newId };
    await setDoc(doc(db, 'projects', newId), newProject);
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, updates);
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error('Project not found after update');
    }
    return { id: updatedSnap.id, ...(updatedSnap.data() as Project) };
  },

  async deleteProject(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
  },

  // -------------------------------------------------------------
  // SKILLS
  // -------------------------------------------------------------
  async getSkills(onlyEnabled: boolean = false): Promise<Skill[]> {
    if (!db) return [];
    try {
      const skillsRef = collection(db, 'skills');
      const q = onlyEnabled 
        ? query(skillsRef, where('enabled', '==', true))
        : query(skillsRef);
      
      const querySnapshot = await getDocs(q);
      const list: Skill[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Skill) });
      });

      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Firestore getSkills error:', err);
      throw err;
    }
  },

  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    if (!db) throw new Error('Firestore is not initialized');
    const newId = `sk-${Date.now()}`;
    const newSkill: Skill = { ...skill, id: newId };
    await setDoc(doc(db, 'skills', newId), newSkill);
    return newSkill;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'skills', id);
    await updateDoc(docRef, updates);
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error('Skill not found after update');
    }
    return { id: updatedSnap.id, ...(updatedSnap.data() as Skill) };
  },

  async deleteSkill(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'skills', id));
  },

  // -------------------------------------------------------------
  // EXPERIENCE
  // -------------------------------------------------------------
  async getExperience(): Promise<Experience[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'experience'));
      const querySnapshot = await getDocs(q);
      const list: Experience[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Experience) });
      });
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Firestore getExperience error:', err);
      throw err;
    }
  },

  async createExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    if (!db) throw new Error('Firestore is not initialized');
    const newId = `exp-${Date.now()}`;
    const newExp: Experience = { ...exp, id: newId };
    await setDoc(doc(db, 'experience', newId), newExp);
    return newExp;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'experience', id);
    await updateDoc(docRef, updates);
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error('Experience entry not found after update');
    }
    return { id: updatedSnap.id, ...(updatedSnap.data() as Experience) };
  },

  async deleteExperience(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'experience', id));
  },

  // -------------------------------------------------------------
  // EDUCATION
  // -------------------------------------------------------------
  async getEducation(): Promise<Education[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'education'));
      const querySnapshot = await getDocs(q);
      const list: Education[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Education) });
      });
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Firestore getEducation error:', err);
      throw err;
    }
  },

  async createEducation(edu: Omit<Education, 'id'>): Promise<Education> {
    if (!db) throw new Error('Firestore is not initialized');
    const newId = `edu-${Date.now()}`;
    const newEdu: Education = { ...edu, id: newId };
    await setDoc(doc(db, 'education', newId), newEdu);
    return newEdu;
  },

  async updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'education', id);
    await updateDoc(docRef, updates);
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error('Education entry not found after update');
    }
    return { id: updatedSnap.id, ...(updatedSnap.data() as Education) };
  },

  async deleteEducation(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'education', id));
  },

  // -------------------------------------------------------------
  // CERTIFICATIONS
  // -------------------------------------------------------------
  async getCertifications(): Promise<Certification[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'certifications'));
      const querySnapshot = await getDocs(q);
      const list: Certification[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Certification) });
      });
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Firestore getCertifications error:', err);
      throw err;
    }
  },

  async createCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    if (!db) throw new Error('Firestore is not initialized');
    const newId = `cert-${Date.now()}`;
    const newCert: Certification = { ...cert, id: newId };
    await setDoc(doc(db, 'certifications', newId), newCert);
    return newCert;
  },

  async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'certifications', id);
    await updateDoc(docRef, updates);
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error('Certification not found after update');
    }
    return { id: updatedSnap.id, ...(updatedSnap.data() as Certification) };
  },

  async deleteCertification(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'certifications', id));
  },

  // -------------------------------------------------------------
  // ACHIEVEMENTS
  // -------------------------------------------------------------
  async getAchievements(): Promise<Achievement[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'achievements'));
      const querySnapshot = await getDocs(q);
      const list: Achievement[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as Achievement) });
      });
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Firestore getAchievements error:', err);
      throw err;
    }
  },

  async createAchievement(ach: Omit<Achievement, 'id'>): Promise<Achievement> {
    if (!db) throw new Error('Firestore is not initialized');
    const newId = `ach-${Date.now()}`;
    const newAch: Achievement = { ...ach, id: newId };
    await setDoc(doc(db, 'achievements', newId), newAch);
    return newAch;
  },

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'achievements', id);
    await updateDoc(docRef, updates);
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error('Achievement not found after update');
    }
    return { id: updatedSnap.id, ...(updatedSnap.data() as Achievement) };
  },

  async deleteAchievement(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'achievements', id));
  },

  // -------------------------------------------------------------
  // GITHUB REPOSITORIES
  // -------------------------------------------------------------
  async getGithubRepos(): Promise<GithubRepo[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'githubRepositories'));
      const querySnapshot = await getDocs(q);
      const list: GithubRepo[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as GithubRepo) });
      });
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.error('Firestore getGithubRepos error:', err);
      throw err;
    }
  },

  async createGithubRepo(repo: Omit<GithubRepo, 'id'>): Promise<GithubRepo> {
    if (!db) throw new Error('Firestore is not initialized');
    const newId = `repo-${Date.now()}`;
    const newRepo: GithubRepo = { ...repo, id: newId };
    await setDoc(doc(db, 'githubRepositories', newId), newRepo);
    return newRepo;
  },

  async updateGithubRepo(id: string, updates: Partial<GithubRepo>): Promise<GithubRepo> {
    if (!db) throw new Error('Firestore is not initialized');
    const docRef = doc(db, 'githubRepositories', id);
    await updateDoc(docRef, updates);
    const updatedSnap = await getDoc(docRef);
    if (!updatedSnap.exists()) {
      throw new Error('Repository entry not found after update');
    }
    return { id: updatedSnap.id, ...(updatedSnap.data() as GithubRepo) };
  },

  async deleteGithubRepo(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'githubRepositories', id));
  },

  async fetchGithubApiRepos(username: string): Promise<GithubRepo[]> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
      if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
      const data = await response.json();
      return data.map((item: any, index: number) => ({
        id: `gh-${item.id}`,
        name: item.name,
        fullName: item.full_name,
        description: item.description || '',
        htmlUrl: item.html_url,
        language: item.language || 'Code',
        starsCount: item.stargazers_count || 0,
        forksCount: item.forks_count || 0,
        topics: item.topics || [],
        isFeatured: index < 3,
        order: index + 1,
        updatedAt: item.updated_at
      }));
    } catch (err) {
      console.warn('Failed to fetch from GitHub public API', err);
      return [];
    }
  },

  // -------------------------------------------------------------
  // CONTACT MESSAGES
  // -------------------------------------------------------------
  async getMessages(): Promise<ContactMessage[]> {
    if (!db) return [];
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const list: ContactMessage[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as ContactMessage) });
      });
      return list;
    } catch (err) {
      console.error('Firestore getMessages error:', err);
      throw err;
    }
  },

  async sendMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
    if (!db) throw new Error('Firestore is not initialized');
    const newMessage: ContactMessage = {
      ...message,
      createdAt: new Date().toISOString(),
      read: false
    };

    const docRef = await addDoc(collection(db, 'messages'), {
      ...newMessage,
      timestamp: new Date()
    });
    newMessage.id = docRef.id;
    return newMessage;
  },

  async markMessageRead(id: string, read: boolean = true): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await updateDoc(doc(db, 'messages', id), { read });
  },

  async deleteMessage(id: string): Promise<void> {
    if (!db) throw new Error('Firestore is not initialized');
    await deleteDoc(doc(db, 'messages', id));
  },

  // -------------------------------------------------------------
  // SETTINGS
  // -------------------------------------------------------------
  async getSettings(): Promise<SiteSettings | null> {
    if (!db) return null;
    try {
      const docSnap = await getDoc(doc(db, 'settings', 'site'));
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      }
      return null;
    } catch (err) {
      console.error('Firestore getSettings error:', err);
      throw err;
    }
  },

  async updateSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (!db) throw new Error('Firestore is not initialized');
    await setDoc(doc(db, 'settings', 'site'), settings, { merge: true });
    return settings;
  }
};
