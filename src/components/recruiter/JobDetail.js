import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { Button } from '../shared';

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem'
  },
  backButton: {
    marginBottom: '2rem'
  },
  backLink: {
    color: '#C41E3A',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  header: {
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #E0E0E0'
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#333',
    margin: 0
  },
  company: {
    fontSize: '0.95rem',
    color: '#666',
    marginTop: '0.5rem'
  },
  meta: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#333',
    marginBottom: '1rem'
  },
  content: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#555',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem'
  },
  skillTag: {
    backgroundColor: '#F5F5F5',
    border: '1px solid #DDD',
    borderRadius: '4px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    color: '#666'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1rem',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#C41E3A',
    fontSize: '1rem'
  },
  notFound: {
    textAlign: 'center',
    padding: '3rem'
  }
};

const JobDetail = () => {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { getJob } = useJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const jobData = await getJob(id);
        if (jobData) {
          setJob(jobData);
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error loading job:', err);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, getJob]);

  if (loading) {
    return <div style={styles.loading}>Loading job details...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        <p>{error}</p>
        <Link to="/recruiter/jobs" style={styles.backLink}>← Back to Jobs</Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={styles.notFound}>
        <h2>Job Not Found</h2>
        <p>The job you're looking for doesn't exist.</p>
        <Link to="/recruiter/jobs" style={styles.backLink}>← Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backButton}>
        <Link to="/recruiter/jobs" style={styles.backLink}>
          ← Back to Jobs
        </Link>
      </div>

      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.title}>{job.title}</h1>
            <div style={styles.company}>{job.company}</div>
          </div>
          <div style={styles.buttonGroup}>
            <Link to={`/recruiter/jobs/${job.id}/edit`}>
              <Button>Edit Job</Button>
            </Link>
          </div>
        </div>

        <div style={styles.meta}>
          {job.location && (
            <div style={styles.metaItem}>
              <span>📍</span>
              <span>{job.location}</span>
            </div>
          )}
          {job.salaryMin && job.salaryMax && (
            <div style={styles.metaItem}>
              <span>💰</span>
              <span>₹{job.salaryMin} - ₹{job.salaryMax} LPA</span>
            </div>
          )}
          {job.type && (
            <div style={styles.metaItem}>
              <span>⏱️</span>
              <span>{job.type}</span>
            </div>
          )}
          {job.workMode && (
            <div style={styles.metaItem}>
              <span>🏢</span>
              <span>{job.workMode}</span>
            </div>
          )}
          {job.experienceLevel && (
            <div style={styles.metaItem}>
              <span>📊</span>
              <span>{job.experienceLevel} years</span>
            </div>
          )}
          {job.noOfPositions && (
            <div style={styles.metaItem}>
              <span>👥</span>
              <span>{job.noOfPositions} position{job.noOfPositions > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {job.description && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Description</h2>
          <div style={styles.content}>{job.description}</div>
        </div>
      )}

      {job.requirements && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Requirements</h2>
          <div style={styles.content}>{job.requirements}</div>
        </div>
      )}

      {job.benefits && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Benefits</h2>
          <div style={styles.content}>{job.benefits}</div>
        </div>
      )}

      {job.skills && job.skills.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Required Skills</h2>
          <div style={styles.skillsList}>
            {job.skills.map(skill => (
              <div key={skill} style={styles.skillTag}>
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {job.department && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Department</h2>
          <p style={styles.content}>{job.department}</p>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
