// Custom hook for job-related operations
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';

// Transform snake_case to camelCase for job objects
const transformJob = (job) => ({
  id: job.id,
  title: job.title,
  company: job.company,
  location: job.location,
  workMode: job.work_mode,
  type: job.type,
  salary: job.salary,
  salaryMin: job.salary_min,
  salaryMax: job.salary_max,
  description: job.description,
  requirements: job.requirements,
  benefits: job.benefits,
  skills: job.skills,
  department: job.department,
  experienceLevel: job.experience_level,
  noOfPositions: job.no_of_positions,
  noticePeriod: job.notice_period,
  recruiterId: job.recruiter_id,
  recruiterName: job.recruiter_name,
  status: job.status,
  applicantCount: job.applicant_count,
  createdAt: job.created_at,
  updatedAt: job.updated_at
});

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, userRole, userProfile } = useAuth();

  // Fetch all active jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setJobs(data.map(transformJob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch jobs posted by recruiter
  const fetchRecruiterJobs = useCallback(async () => {
    if (!currentUser || userRole !== 'recruiter') return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setJobs(data.map(transformJob));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userRole]);

  // Create new job posting
  const createJob = async (jobData) => {
    if (!currentUser || userRole !== 'recruiter') {
      throw new Error('Only recruiters can create job postings');
    }

    try {
      // Ensure requirements and benefits are arrays
      let requirements = jobData.requirements || [];
      let benefits = jobData.benefits || [];
      let skills = jobData.skills || [];
      
      // Convert to array if string
      if (typeof requirements === 'string') {
        requirements = requirements.split(',').map(s => s.trim()).filter(s => s);
      }
      if (typeof benefits === 'string') {
        benefits = benefits.split(',').map(s => s.trim()).filter(s => s);
      }

      const newJob = {
        title: jobData.title,
        company: jobData.company || userProfile?.company || '',
        location: jobData.location || '',
        work_mode: jobData.workMode || 'onsite',
        type: jobData.type || 'full-time',
        salary_min: jobData.salaryMin ? parseInt(jobData.salaryMin) : null,
        salary_max: jobData.salaryMax ? parseInt(jobData.salaryMax) : null,
        description: jobData.description || '',
        requirements: requirements,
        benefits: benefits,
        skills: skills,
        department: jobData.department || '',
        experience_level: jobData.experienceLevel || '1-3',
        no_of_positions: jobData.noOfPositions ? parseInt(jobData.noOfPositions) : 1,
        notice_period: jobData.noticePeriod || '30-days',
        recruiter_id: currentUser.id,
        recruiter_name: userProfile?.fullName || currentUser.email || 'Unknown',
        status: jobData.status || 'active',
        applicant_count: 0
      };

      console.log('Creating job with data:', newJob);

      const { data, error: insertError } = await supabase
        .from('jobs')
        .insert(newJob)
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        throw insertError;
      }

      const newJobTransformed = transformJob(data);
      
      // Update local state immediately
      setJobs(prevJobs => [newJobTransformed, ...prevJobs]);
      
      return newJobTransformed;
    } catch (err) {
      console.error('Create job error:', err);
      throw err;
    }
  };

  // Update job posting
  const updateJob = async (jobId, jobData) => {
    if (!currentUser || userRole !== 'recruiter') {
      throw new Error('Only recruiters can update job postings');
    }

    try {
      const updateData = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        description: jobData.description,
        requirements: jobData.requirements,
        benefits: jobData.benefits,
        status: jobData.status,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) delete updateData[key];
      });

      const { error: updateError } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', jobId);

      if (updateError) throw updateError;
      
      // Update local state immediately
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, ...jobData, updatedAt: new Date().toISOString() } : job
      ));
    } catch (err) {
      throw err;
    }
  };

  // Delete job posting
  const deleteJob = async (jobId) => {
    if (!currentUser || userRole !== 'recruiter') {
      throw new Error('Only recruiters can delete job postings');
    }

    try {
      const { error: deleteError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (deleteError) throw deleteError;
      
      // Update local state immediately
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (err) {
      throw err;
    }
  };

  // Get single job by ID
  const getJob = useCallback(async (jobId) => {
    try {
      console.log('🔍 Fetching job with ID:', jobId);
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      console.log('📊 Job fetch response - Data:', data, 'Error:', fetchError);

      if (fetchError) {
        console.error('❌ Job fetch error:', fetchError.message);
        throw fetchError;
      }

      const transformedJob = data ? transformJob(data) : null;
      console.log('✅ Job successfully transformed:', transformedJob);
      return transformedJob;
    } catch (err) {
      console.error('❌ Error in getJob:', err.message || err);
      throw err;
    }
  }, []);

  // Real-time listener for jobs
  useEffect(() => {
    // Initial fetch
    fetchJobs();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('jobs-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newJob = transformJob(payload.new);
            if (newJob.status === 'active') {
              setJobs(prev => [newJob, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            setJobs(prev => prev.map(job => 
              job.id === payload.new.id ? transformJob(payload.new) : job
            ).filter(job => job.status === 'active'));
          } else if (payload.eventType === 'DELETE') {
            setJobs(prev => prev.filter(job => job.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    fetchRecruiterJobs,
    createJob,
    updateJob,
    deleteJob,
    getJob
  };
};

export default useJobs;
