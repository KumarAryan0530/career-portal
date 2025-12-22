// Job Form for Creating and Editing Jobs
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Select, Textarea, Spinner } from '../shared';
import toast from 'react-hot-toast';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#666'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #FFF5F5'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  skillsInput: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem'
  },
  skillsTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  skillTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.375rem 0.75rem',
    background: '#FFF5F5',
    borderRadius: '20px',
    fontSize: '0.875rem',
    color: '#C41E3A'
  },
  removeSkill: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    color: '#C41E3A'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid #E0DADA'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    textDecoration: 'none',
    marginBottom: '1rem',
    cursor: 'pointer'
  }
};

const jobTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

const workModes = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' }
];

const experienceLevels = [
  { value: '0-1', label: '0-1 Years' },
  { value: '1-3', label: '1-3 Years' },
  { value: '3-5', label: '3-5 Years' },
  { value: '5-8', label: '5-8 Years' },
  { value: '8-10', label: '8-10 Years' },
  { value: '10+', label: '10+ Years' }
];

const noticePeriods = [
  { value: 'immediate', label: 'Immediate' },
  { value: '15-days', label: '15 Days' },
  { value: '30-days', label: '30 Days' },
  { value: '45-days', label: '45 Days' },
  { value: '60-days', label: '60 Days' },
  { value: '90-days', label: '90 Days' }
];

const departments = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'other', label: 'Other' }
];

const initialFormState = {
  title: '',
  department: '',
  location: '',
  workMode: 'onsite',
  type: 'full-time',
  experienceLevel: '1-3',
  noOfPositions: 1,
  noticePeriod: '30-days',
  salaryMin: '',
  salaryMax: '',
  description: '',
  requirements: '',
  benefits: '',
  skills: [],
  status: 'active'
};

const MAX_SKILLS = 5;

const JobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { currentUser, userProfile } = useAuth();
  const { createJob, updateJob, getJob } = useJobs();
  
  const [formData, setFormData] = useState(initialFormState);
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const loadJob = async () => {
        try {
          const job = await getJob(id);
          if (job) {
            setFormData({
              title: job.title || '',
              department: job.department || '',
              location: job.location || '',
              workMode: job.workMode || 'onsite',
              type: job.type || 'full-time',
              experienceLevel: job.experienceLevel || '1-3',
              noOfPositions: job.noOfPositions || 1,
              noticePeriod: job.noticePeriod || '30-days',
              salaryMin: job.salaryMin ? String(job.salaryMin) : '',
              salaryMax: job.salaryMax ? String(job.salaryMax) : '',
              description: job.description || '',
              requirements: job.requirements || '',
              benefits: job.benefits || '',
              skills: job.skills || [],
              status: job.status || 'active'
            });
          }
        } catch (error) {
          toast.error('Failed to load job');
          navigate('/recruiter/jobs');
        } finally {
          setFetchingJob(false);
        }
      };
      loadJob();
    }
  }, [id, isEditing, getJob, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill) && formData.skills.length < MAX_SKILLS) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput('');
    } else if (formData.skills.length >= MAX_SKILLS) {
      toast.error(`Maximum ${MAX_SKILLS} skills allowed`);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const jobData = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        companyName: userProfile?.companyName || 'Company',
        recruiterId: currentUser.uid,
        recruiterEmail: currentUser.email
      };

      if (isEditing) {
        await updateJob(id, jobData);
        toast.success('Job updated successfully!');
      } else {
        await createJob(jobData);
        toast.success('Job posted successfully!');
      }
      navigate('/recruiter/jobs');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update job' : 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setSubmitting(true);
    try {
      const jobData = {
        ...formData,
        status: 'draft',
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        companyName: userProfile?.companyName || 'Company',
        recruiterId: currentUser.uid,
        recruiterEmail: currentUser.email
      };

      if (isEditing) {
        await updateJob(id, jobData);
      } else {
        await createJob(jobData);
      }
      toast.success('Job saved as draft!');
      navigate('/recruiter/jobs');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setSubmitting(false);
    }
  };

  if (fetchingJob) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <Spinner size="lg" />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading job details...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div 
        style={styles.backLink}
        onClick={() => navigate('/recruiter/jobs')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Jobs
      </div>

      <div style={styles.header}>
        <h1 style={styles.title}>{isEditing ? 'Edit Job Posting' : 'Create Job Posting'}</h1>
        <p style={styles.subtitle}>
          {isEditing ? 'Update the job details below' : 'Fill in the details to create a new job listing'}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Basic Information */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Basic Information</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              label="Job Role / Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Software Engineer"
              required
            />
            <div style={styles.row}>
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={[{ value: '', label: 'Select Department' }, ...departments]}
              />
              <Input
                label="No. of Positions *"
                name="noOfPositions"
                type="number"
                min="1"
                value={formData.noOfPositions}
                onChange={handleChange}
                placeholder="e.g. 2"
                required
              />
            </div>
            <div style={styles.row}>
              <Input
                label="Location *"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad, Mumbai"
                required
              />
              <Select
                label="Work Mode"
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                options={workModes}
              />
            </div>
            <div style={styles.row}>
              <Select
                label="Job Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={jobTypes}
              />
              <Select
                label="Experience Required"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                options={experienceLevels}
              />
            </div>
            <div style={styles.row}>
              <Select
                label="Notice Period"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                options={noticePeriods}
              />
            </div>
          </div>
        </div>

        {/* Budget / Compensation */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Budget / Compensation</h2>
          <div style={styles.row}>
            <Input
              label="Minimum Budget (LPA)"
              name="salaryMin"
              type="number"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="e.g. 8"
            />
            <Input
              label="Maximum Budget (LPA)"
              name="salaryMax"
              type="number"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="e.g. 15"
            />
          </div>
        </div>

        {/* Job Description */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Job Description</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Textarea
              label="Description *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              rows={6}
              required
            />
            <Textarea
              label="Requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List the qualifications, skills, and experience required for this role..."
              rows={4}
            />
            <Textarea
              label="Benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              placeholder="Health insurance, 401k, flexible hours, remote work options..."
              rows={3}
            />
          </div>
        </div>

        {/* Skills */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Required Skills (Max {MAX_SKILLS})</h2>
          <div style={styles.skillsInput}>
            <Input
              placeholder="Add a skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              style={{ flex: 1 }}
              disabled={formData.skills.length >= MAX_SKILLS}
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleAddSkill}
              disabled={formData.skills.length >= MAX_SKILLS}
            >
              Add
            </Button>
          </div>
          <div style={styles.skillsTags}>
            {formData.skills.map(skill => (
              <span key={skill} style={styles.skillTag}>
                {skill}
                <button
                  type="button"
                  style={styles.removeSkill}
                  onClick={() => handleRemoveSkill(skill)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </span>
            ))}
            {formData.skills.length === 0 && (
              <span style={{ color: '#888', fontSize: '0.9rem' }}>No skills added yet</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
            {formData.skills.length}/{MAX_SKILLS} skills added
          </p>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/recruiter/jobs')}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSaveAsDraft}
            disabled={submitting}
          >
            Save as Draft
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : (isEditing ? 'Update Job' : 'Post Job')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;
