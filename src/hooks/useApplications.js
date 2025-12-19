// Custom hook for job application operations
import { useState, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

// Transform snake_case to camelCase for application objects
const transformApplication = (app) => ({
  id: app.id,
  jobId: app.job_id,
  jobTitle: app.job_title,
  company: app.company,
  candidateId: app.candidate_id,
  candidateName: app.candidate_name,
  candidateEmail: app.candidate_email,
  resumeUrl: app.resume_url,
  resumeName: app.resume_name,
  coverLetter: app.cover_letter,
  status: app.status,
  recruiterId: app.recruiter_id,
  recruiterNotes: app.recruiter_notes,
  appliedAt: app.applied_at,
  updatedAt: app.updated_at
});

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser, userRole, userProfile } = useAuth();

  // Apply to a job
  const applyToJob = async (jobId, applicationData) => {
    if (!currentUser || userRole !== 'candidate') {
      throw new Error('Only candidates can apply to jobs');
    }

    try {
      // Check if already applied
      const existingApp = await checkExistingApplication(jobId);
      if (existingApp) {
        throw new Error('You have already applied to this job');
      }

      // Get job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;
      if (!jobData) throw new Error('Job not found');

      // Create application
      const newApplication = {
        job_id: jobId,
        job_title: jobData.title,
        company: jobData.company,
        candidate_id: currentUser.id,
        candidate_name: userProfile?.fullName || 'Unknown',
        candidate_email: currentUser.email,
        resume_url: applicationData.resumeUrl,
        resume_name: applicationData.resumeName,
        cover_letter: applicationData.coverLetter || '',
        status: 'pending',
        recruiter_id: jobData.recruiter_id,
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: insertedApp, error: insertError } = await supabase
        .from('applications')
        .insert(newApplication)
        .select()
        .single();

      if (insertError) throw insertError;

      // Update job applicant count
      const { error: updateError } = await supabase
        .from('jobs')
        .update({ applicant_count: (jobData.applicant_count || 0) + 1 })
        .eq('id', jobId);

      if (updateError) console.error('Error updating applicant count:', updateError);

      return transformApplication(insertedApp);
    } catch (err) {
      throw err;
    }
  };

  // Check if user already applied to a job
  const checkExistingApplication = async (jobId) => {
    if (!currentUser) return null;

    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId)
        .eq('candidate_id', currentUser.id)
        .maybeSingle();

      if (error) return null;
      return data ? transformApplication(data) : null;
    } catch (err) {
      return null;
    }
  };

  // Get candidate's applications
  const fetchCandidateApplications = useCallback(async () => {
    if (!currentUser || userRole !== 'candidate') return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('candidate_id', currentUser.id)
        .order('applied_at', { ascending: false });

      if (fetchError) throw fetchError;

      setApplications(data.map(transformApplication));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userRole]);

  // Get applications for a specific job (recruiter)
  const fetchJobApplications = useCallback(async (jobId) => {
    if (!currentUser || userRole !== 'recruiter') return [];

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', jobId)
        .order('applied_at', { ascending: false });

      if (fetchError) throw fetchError;

      const appsList = data.map(transformApplication);
      setApplications(appsList);
      return appsList;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [currentUser, userRole]);

  // Get all applications for recruiter's jobs
  const fetchRecruiterApplications = useCallback(async () => {
    if (!currentUser || userRole !== 'recruiter') return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('recruiter_id', currentUser.id)
        .order('applied_at', { ascending: false });

      if (fetchError) throw fetchError;

      setApplications(data.map(transformApplication));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userRole]);

  // Update application status (recruiter)
  const updateApplicationStatus = async (applicationId, newStatus, notes = '') => {
    if (!currentUser || userRole !== 'recruiter') {
      throw new Error('Only recruiters can update application status');
    }

    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          recruiter_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (updateError) throw updateError;
    } catch (err) {
      throw err;
    }
  };

  // Get application details
  const getApplication = async (applicationId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (fetchError) throw fetchError;

      return data ? transformApplication(data) : null;
    } catch (err) {
      throw err;
    }
  };

  return {
    applications,
    loading,
    error,
    applyToJob,
    checkExistingApplication,
    fetchCandidateApplications,
    fetchJobApplications,
    fetchRecruiterApplications,
    updateApplicationStatus,
    getApplication
  };
};

export default useApplications;
