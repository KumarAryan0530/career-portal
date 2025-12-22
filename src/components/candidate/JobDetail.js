// Job Detail Page with Application
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { useApplications } from '../../hooks/useApplications';
import { useResumeUpload } from '../../hooks/useResumeUpload';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Tag, JobType, Spinner, Modal, FileUpload, Textarea } from '../shared';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const jobDetailStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '2rem',
    alignItems: 'start'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    textDecoration: 'none',
    marginBottom: '1.5rem',
    fontSize: '0.95rem'
  },
  mainContent: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  },
  header: {
    padding: '2rem',
    borderBottom: '1px solid #E0DADA',
    background: 'linear-gradient(180deg, #FFF5F5 0%, #fff 100%)'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: '0.5rem'
  },
  company: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#C41E3A',
    fontSize: '1.1rem',
    fontWeight: '500'
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginTop: '1rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    fontSize: '0.95rem'
  },
  body: {
    padding: '2rem'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  description: {
    color: '#444',
    lineHeight: 1.8,
    whiteSpace: 'pre-line'
  },
  list: {
    paddingLeft: '1.5rem',
    color: '#444',
    lineHeight: 1.8
  },
  listItem: {
    marginBottom: '0.5rem'
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  sidebar: {
    position: 'sticky',
    top: '90px'
  },
  applyCard: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '1.5rem',
    marginBottom: '1.5rem'
  },
  salary: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#C41E3A',
    marginBottom: '0.25rem'
  },
  salaryPeriod: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1.5rem'
  },
  applyButton: {
    marginBottom: '1rem'
  },
  appliedBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    background: '#E8F5E9',
    borderRadius: '12px',
    color: '#2E7D32',
    fontWeight: '600'
  },
  infoCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    padding: '1.5rem'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #E0DADA'
  },
  infoLabel: {
    color: '#666',
    fontSize: '0.9rem',
    minWidth: '100px'
  },
  infoValue: {
    color: '#2D2D2D',
    fontWeight: '500'
  }
};

const JobDetail = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const { getJob } = useJobs();
  const { applyToJob, checkExistingApplication } = useApplications();
  const { uploadResume, uploading, progress } = useResumeUpload();
  const { userProfile } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeFile: null,
    resumeUrl: '',
    resumeName: ''
  });

  useEffect(() => {
    const loadJob = async () => {
      try {
        console.log('📄 JobDetail: Loading job with ID:', jobId);
        const jobData = await getJob(jobId);
        console.log('📄 JobDetail: Received job data:', jobData);
        
        if (jobData) {
          setJob(jobData);
          
          // Check if user has already applied
          const existingApp = await checkExistingApplication(jobId);
          setHasApplied(!!existingApp);
        } else {
          console.warn('⚠️ Job data is null/undefined for ID:', jobId);
          toast.error('Job not found');
          navigate('/candidate/jobs');
        }
      } catch (error) {
        console.error('❌ Error loading job:', error);
        console.error('📋 Error details:', {
          message: error.message,
          code: error.code,
          status: error.status,
          details: error.details
        });
        toast.error('Failed to load job details: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId, getJob, checkExistingApplication, navigate]);

  const handleFileSelect = async (file) => {
    try {
      const result = await uploadResume(file, jobId);
      setApplicationData(prev => ({
        ...prev,
        resumeFile: file,
        resumeUrl: result.url,
        resumeName: result.name
      }));
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleApply = async () => {
    // Use existing resume if no new one uploaded
    const resumeUrl = applicationData.resumeUrl || userProfile?.resumeUrl;
    const resumeName = applicationData.resumeName || userProfile?.resumeName;

    if (!resumeUrl) {
      toast.error('Please upload a resume');
      return;
    }

    setApplying(true);
    try {
      await applyToJob(jobId, {
        resumeUrl,
        resumeName,
        coverLetter: applicationData.coverLetter
      });
      
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setHasApplied(true);
    } catch (error) {
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div>
      <Link to="/candidate/jobs" style={jobDetailStyles.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Jobs
      </Link>

      <div style={jobDetailStyles.container}>
        {/* Main Content */}
        <div style={jobDetailStyles.mainContent}>
          <div style={jobDetailStyles.header}>
            <div style={jobDetailStyles.headerTop}>
              <div>
                <h1 style={jobDetailStyles.title}>{job.title}</h1>
                <div style={jobDetailStyles.company}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
                  </svg>
                  {job.company}
                </div>
              </div>
              <JobType type={job.type} />
            </div>

            <div style={jobDetailStyles.meta}>
              <span style={jobDetailStyles.metaItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {job.location}
              </span>
              <span style={jobDetailStyles.metaItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                {job.experience || 'All levels'}
              </span>
              <span style={jobDetailStyles.metaItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>

          <div style={jobDetailStyles.body}>
            {/* Description */}
            <div style={jobDetailStyles.section}>
              <h2 style={jobDetailStyles.sectionTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Job Description
              </h2>
              <p style={jobDetailStyles.description}>{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div style={jobDetailStyles.section}>
                <h2 style={jobDetailStyles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  Requirements
                </h2>
                <ul style={jobDetailStyles.list}>
                  {job.requirements.map((req, index) => (
                    <li key={index} style={jobDetailStyles.listItem}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div style={jobDetailStyles.section}>
                <h2 style={jobDetailStyles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  Responsibilities
                </h2>
                <ul style={jobDetailStyles.list}>
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} style={jobDetailStyles.listItem}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div style={jobDetailStyles.section}>
                <h2 style={jobDetailStyles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  Required Skills
                </h2>
                <div style={jobDetailStyles.skills}>
                  {job.skills.map((skill, index) => (
                    <Tag key={index}>{skill}</Tag>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div style={jobDetailStyles.section}>
                <h2 style={jobDetailStyles.sectionTitle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  Benefits
                </h2>
                <ul style={jobDetailStyles.list}>
                  {job.benefits.map((benefit, index) => (
                    <li key={index} style={jobDetailStyles.listItem}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={jobDetailStyles.sidebar}>
          <div style={jobDetailStyles.applyCard}>
            <div style={jobDetailStyles.salary}>{job.salary}</div>
            <div style={jobDetailStyles.salaryPeriod}>per year</div>

            {hasApplied ? (
              <div style={jobDetailStyles.appliedBadge}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Already Applied
              </div>
            ) : (
              <div style={jobDetailStyles.applyButton}>
                <Button fullWidth onClick={() => setShowApplyModal(true)}>
                  Apply Now
                </Button>
              </div>
            )}

            <Button variant="secondary" fullWidth>
              Save Job
            </Button>
          </div>

          <div style={jobDetailStyles.infoCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Job Information</h3>
            
            <div style={jobDetailStyles.infoItem}>
              <span style={jobDetailStyles.infoLabel}>Job Type</span>
              <span style={jobDetailStyles.infoValue}>{job.type}</span>
            </div>
            
            <div style={jobDetailStyles.infoItem}>
              <span style={jobDetailStyles.infoLabel}>Location</span>
              <span style={jobDetailStyles.infoValue}>{job.location}</span>
            </div>
            
            <div style={jobDetailStyles.infoItem}>
              <span style={jobDetailStyles.infoLabel}>Experience</span>
              <span style={jobDetailStyles.infoValue}>{job.experience || 'Not specified'}</span>
            </div>
            
            <div style={{ ...jobDetailStyles.infoItem, borderBottom: 'none' }}>
              <span style={jobDetailStyles.infoLabel}>Applicants</span>
              <span style={jobDetailStyles.infoValue}>{job.applicantCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for this Position"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} loading={applying}>
              Submit Application
            </Button>
          </>
        }
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{job.title}</h4>
          <p style={{ color: '#666' }}>{job.company}</p>
        </div>

        <FileUpload
          label="Upload Resume"
          onFileSelect={handleFileSelect}
          uploading={uploading}
          progress={progress}
          currentFile={applicationData.resumeName || userProfile?.resumeName}
          helpText={userProfile?.resumeUrl ? 'Upload a new resume or use your profile resume' : 'PDF, DOC, DOCX up to 5MB'}
        />

        <Textarea
          label="Cover Letter (Optional)"
          name="coverLetter"
          value={applicationData.coverLetter}
          onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
          placeholder="Tell the employer why you're the perfect fit for this role..."
          rows={6}
          maxLength={2000}
        />
      </Modal>
    </div>
  );
};

export default JobDetail;
