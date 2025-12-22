// Job Management for Recruiters - Create, Edit, Delete Jobs
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { Button, Input, Select, Badge, Status, Spinner, Modal, EmptyState } from '../shared';
import { format } from 'date-fns';

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#2D2D2D'
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  searchWrapper: {
    position: 'relative',
    flex: '1',
    minWidth: '200px',
    maxWidth: '400px'
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#888'
  },
  searchInput: {
    paddingLeft: '2.75rem'
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#fff',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#666',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  statNumber: {
    fontWeight: '600',
    color: '#2D2D2D'
  },
  jobsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  jobCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '1rem',
    alignItems: 'start',
    transition: 'all 0.2s'
  },
  jobInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  jobTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2D2D2D'
  },
  jobMeta: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    color: '#666',
    fontSize: '0.9rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem'
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem'
  },
  jobActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  applicantCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: '#FFF5F5',
    borderRadius: '8px',
    color: '#C41E3A',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  iconButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

const JobManagement = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { jobs, fetchRecruiterJobs, deleteJob, updateJob, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRecruiterJobs();
  }, [fetchRecruiterJobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    draft: jobs.filter(j => j.status === 'draft').length
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    setDeleting(true);
    try {
      await deleteJob(jobToDelete.id);
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    await updateJob(job.id, { status: newStatus });
  };

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Job Postings</h1>
        <Link to="/recruiter/jobs/new">
          <Button>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div style={styles.statBadge}>
          <span style={styles.statNumber}>{stats.total}</span> Total Jobs
        </div>
        <div style={styles.statBadge}>
          <span style={{ ...styles.statNumber, color: '#2E7D32' }}>{stats.active}</span> Active
        </div>
        <div style={styles.statBadge}>
          <span style={{ ...styles.statNumber, color: '#ED6C02' }}>{stats.draft}</span> Drafts
        </div>
        <div style={styles.statBadge}>
          <span style={{ ...styles.statNumber, color: '#666' }}>{stats.closed}</span> Closed
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'closed', label: 'Closed' }
          ]}
        />
      </div>

      {/* Jobs List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner size="lg" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          }
          title={searchTerm || statusFilter !== 'all' ? 'No matching jobs' : 'No jobs posted yet'}
          description={searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Start by posting your first job listing'}
          action={
            !searchTerm && statusFilter === 'all' && (
              <Link to="/recruiter/jobs/new">
                <Button>Post Your First Job</Button>
              </Link>
            )
          }
        />
      ) : (
        <div style={styles.jobsGrid}>
          {filteredJobs.map(job => (
            <div key={job.id} style={styles.jobCard}>
              <div style={styles.jobInfo}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Link to={`/recruiter/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                  </Link>
                  <Status status={job.status} />
                </div>
                <div style={styles.jobMeta}>
                  <span style={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {job.location}
                  </span>
                  <span style={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <div style={styles.tags}>
                  <Badge variant="tag">{job.type}</Badge>
                  {job.department && <Badge variant="tag">{job.department}</Badge>}
                  {job.experienceLevel && <Badge variant="tag">{job.experienceLevel}</Badge>}
                </div>
              </div>
              <div style={styles.jobActions}>
                <Link to={`/recruiter/jobs/${job.id}/applicants`} style={{ textDecoration: 'none' }}>
                  <div style={styles.applicantCount}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {job.applicantCount || 0}
                  </div>
                </Link>
                <Link to={`/recruiter/jobs/${job.id}/edit`}>
                  <button
                    style={{ ...styles.iconButton, background: '#F5F5F5' }}
                    title="Edit Job"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                </Link>
                <button
                  style={{ ...styles.iconButton, background: job.status === 'active' ? '#E8F5E9' : '#FFF4E5' }}
                  onClick={() => handleToggleStatus(job)}
                  title={job.status === 'active' ? 'Close Job' : 'Reopen Job'}
                >
                  {job.status === 'active' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ED6C02" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>
                <button
                  style={{ ...styles.iconButton, background: '#FFEBEE' }}
                  onClick={() => handleDeleteClick(job)}
                  title="Delete Job"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Job Posting"
      >
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>
          Are you sure you want to delete <strong>"{jobToDelete?.title}"</strong>? 
          This action cannot be undone. All applications for this job will also be removed.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleting}>
            {deleting ? <Spinner size="sm" /> : 'Delete Job'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default JobManagement;
