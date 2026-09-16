import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../firebase/config';

export const storageService = {
  /**
   * Uploads a file to Firebase Storage if configured, or converts to base64 data URL for local storage.
   */
  async uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
    if (isFirebaseConfigured && storage) {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${Date.now()}_${sanitizedName}`;
      const storageRef = ref(storage, `${folder}/${uniqueFileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    }

    // Local / Offline fallback: Convert to Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as data URL'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Deletes a file from Firebase Storage if URL belongs to Firebase Storage.
   */
  async deleteFile(fileUrl: string): Promise<void> {
    if (isFirebaseConfigured && storage && fileUrl.includes('firebasestorage.googleapis.com')) {
      try {
        const storageRef = ref(storage, fileUrl);
        await deleteObject(storageRef);
      } catch (err) {
        console.warn('Failed to delete file from storage:', err);
      }
    }
  }
};
