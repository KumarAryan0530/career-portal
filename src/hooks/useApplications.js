// Custom hook for job application operations
import { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '../config/supabase';
import { useAuth } from '../contexts/AuthContext';
import { scoreResume } from '../utils/resumeScorer';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

// Helper function to extract text from PDF
const extractTextFromPDF = async (data) => {
  try {
    console.log('Starting PDF extraction...');
    const arrayBuffer = await data.arrayBuffer();
    console.log('ArrayBuffer created, size:', arrayBuffer.byteLength);
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log('PDF loaded, pages:', pdf.numPages);
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
      console.log(`Page ${i} extracted, text length: ${pageText.length}`);
    }
    
    console.log('Total extracted text length:', fullText.length);
    console.log('First 100 chars:', fullText.substring(0, 100));
    return fullText;
  } catch (error) {
    console.error('PDF extraction failed:', error);
    return '';
  }
};

// Helper function to fetch resume text from Supabase URL
const fetchResumeText = async (resumeUrl) => {
  if (!resumeUrl) {
    console.log('No resume URL provided');
    return '';
  }
  
  try {
    console.log('Fetching resume from:', resumeUrl);
    
    // Extract the file path from the public URL
    // URL format: https://...supabase.co/storage/v1/object/public/resumes/{path}
    const urlParts = resumeUrl.split('/resumes/');
    if (urlParts.length < 2) {
      console.warn('Invalid resume URL format');
      return '';
    }
    
    const filePath = urlParts[1];
    console.log('Resume file path:', filePath);
    
    // Download the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .download(filePath);
    
    if (error || !data) {
      console.warn('Could not fetch resume from storage:', error);
      return `Resume: ${filePath}`;
    }
    
    console.log('File downloaded, size:', data.size, 'type:', data.type);
    
    let text = '';
    
    // Check if it's a PDF
    if (filePath.toLowerCase().endsWith('.pdf') || data.type === 'application/pdf') {
      console.log('Processing as PDF file');
      text = await extractTextFromPDF(data);
    } else {
      // Try to extract as plain text
      console.log('Processing as text file');
      try {
        text = await data.text();
      } catch (textError) {
        console.warn('Could not extract text from file', textError);
        text = `Resume file: ${filePath}`;
      }
    }
    
    console.log('Final extracted text length:', text.length);
    
    // If text is empty or very short, use filename as fallback
    if (!text || text.trim().length < 10) {
      console.warn('Text extraction resulted in empty/very short content, using fallback');
      text = `Candidate Resume: ${filePath}\n\n[Resume uploaded successfully. Please ensure file contains readable text.]`;
    }
    
    return text;
  } catch (err) {
    console.warn('Error fetching resume text:', err);
    return '';
  }
};

// Helper function to score resume and save to database
const scoreAndSaveApplication = async (applicationId, resumeText, jobDescription) => {
  if (!resumeText) return null;
  
  try {
    // Score the resume
    const scoreData = scoreResume(resumeText, jobDescription || 'Job Position');
    
    // Try to save to database (optional - if table exists)
    try {
      const { error: dbError } = await supabase
        .from('application_scores')
        .upsert({
          application_id: applicationId,
          overall_score: scoreData.overallScore,
          technical_score: scoreData.scores.technical,
          experience_score: scoreData.scores.experience,
          education_score: scoreData.scores.education,
          completeness_score: scoreData.scores.completeness,
          relevance_score: scoreData.scores.relevance,
          ranking: scoreData.ranking,
          confidence: scoreData.confidence,
          matched_skills: scoreData.breakdown.matchedSkills,
          missing_skills: scoreData.breakdown.missingSkills,
          experience_diff: scoreData.breakdown.experienceDiff,
          education_match: scoreData.breakdown.educationMatch,
          keyword_matches: scoreData.breakdown.keywordMatches,
          metadata: scoreData.metadata,
          scored_at: new Date().toISOString()
        }, {
          onConflict: 'application_id'
        });
      
      if (dbError) {
        console.log('Database score save skipped (table may not exist)');
      }
    } catch (dbErr) {
      console.log('Database not available - ATS score calculated but not persisted');
    }
    
    return scoreData;
  } catch (err) {
    console.error('Error scoring application:', err);
    return null;
  }
};

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

      // Automatically score the resume using ATS AI model
      // This happens in the background - don't block the application submission
      (async () => {
        try {
          console.log('Starting automatic ATS scoring for application:', insertedApp.id);
          
          // Fetch resume text from Supabase Storage
          const resumeText = await fetchResumeText(applicationData.resumeUrl);
          
          if (resumeText) {
            // Score the resume
            const jobDesc = jobData.description || jobData.title || '';
            await scoreAndSaveApplication(insertedApp.id, resumeText, jobDesc);
            console.log('ATS scoring completed for application:', insertedApp.id);
          } else {
            console.log('Resume text could not be fetched - ATS scoring skipped');
          }
        } catch (scoringErr) {
          console.error('Error during automatic ATS scoring:', scoringErr);
          // Don't throw - application is already created
        }
      })();

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
