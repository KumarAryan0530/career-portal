// Custom hook for resume operations with Supabase Storage
import { useState } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { currentUser, fetchUserProfile } = useAuth();

  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload PDF, DOC, or DOCX files only.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 5MB limit.');
    }
    return true;
  };

  const uploadResume = async (file, jobId = null) => {
    if (!currentUser) {
      throw new Error('User must be logged in to upload resume');
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      validateFile(file);

      // Create storage path: {userId}/{timestamp}_{filename} or {userId}/applications/{jobId}/{timestamp}_{filename}
      const timestamp = Date.now();
      // Clean filename - remove special characters
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${cleanFileName}`;
      const storagePath = jobId 
        ? `${currentUser.id}/applications/${jobId}/${fileName}`
        : `${currentUser.id}/profile/${fileName}`;

      console.log('Uploading to path:', storagePath);

      // Upload to Supabase Storage
      setProgress(10);
      
      const { data, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true  // Allow overwrite if file exists
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, data:', data);
      setProgress(70);

      // Get public URL using the actual path from the upload response
      const actualPath = data.path || storagePath;
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(actualPath);

      const publicUrl = urlData.publicUrl;
      console.log('Public URL:', publicUrl);

      setProgress(90);

      // Update user profile if this is a profile resume
      if (!jobId) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            resume_url: publicUrl,
            resume_name: file.name,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentUser.id);

        if (updateError) throw updateError;
        
        await fetchUserProfile(currentUser.id);
      }

      setUploading(false);
      setProgress(100);
      
      return { url: publicUrl, name: file.name, path: actualPath };
    } catch (err) {
      setError(err.message);
      setUploading(false);
      throw err;
    }
  };

  const deleteResume = async (storagePath) => {
    if (!currentUser) {
      throw new Error('User must be logged in to delete resume');
    }

    try {
      const { error: deleteError } = await supabase.storage
        .from('resumes')
        .remove([storagePath]);

      if (deleteError) throw deleteError;

      // If it's profile resume, update user profile
      if (storagePath.includes('/profile/')) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            resume_url: '',
            resume_name: '',
            updated_at: new Date().toISOString()
          })
          .eq('id', currentUser.id);

        if (updateError) throw updateError;
        
        await fetchUserProfile(currentUser.id);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    uploadResume,
    deleteResume,
    uploading,
    progress,
    error
  };
};

export default useResumeUpload;
