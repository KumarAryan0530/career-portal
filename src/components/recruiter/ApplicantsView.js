// Applicants View - View and manage job applicants
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplications } from '../../hooks/useApplications';
import { useJobs } from '../../hooks/useJobs';
import { Button, Input, Select, Status, Spinner, Modal, EmptyState, Badge } from '../shared';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const styles = {
  header: {
    marginBottom: '2rem'
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    textDecoration: 'none',
    marginBottom: '1rem',
    cursor: 'pointer'
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
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap'
  },
  statBadge: {
    padding: '0.5rem 1rem',
    background: '#fff',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#666',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent'
  },
  statBadgeActive: {
    borderColor: '#C41E3A',
    background: '#FFF5F5'
  },
  applicantsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  applicantCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '1rem',
    alignItems: 'start'
  },
  applicantInfo: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'start'
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: '600',
    flexShrink: 0
  },
  applicantDetails: {
    flex: 1
  },
  applicantName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  applicantMeta: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.5rem'
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  jobName: {
    fontSize: '0.875rem',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    alignItems: 'flex-end'
  },
  statusActions: {
    display: 'flex',
    gap: '0.5rem'
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
  },
  resumeLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    color: '#C41E3A',
    fontSize: '0.9rem',
    textDecoration: 'none',
    marginTop: '0.5rem'
  },
  modalContent: {
    padding: '1rem 0'
  },
  coverLetter: {
    background: '#F9F9F9',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '1rem',
    whiteSpace: 'pre-wrap',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    color: '#444'
  }
};

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'interview', label: 'Interview' },
  { value: 'offered', label: 'Offered' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' }
];

const ApplicantsView = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { applications, fetchRecruiterApplications, updateApplicationStatus, loading } = useApplications();
  const { fetchJobById } = useJobs();
  
  const [job, setJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchRecruiterApplications();
    if (jobId) {
      fetchJobById(jobId).then(setJob);
    }
  }, [fetchRecruiterApplications, jobId, fetchJobById]);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    // If jobId is provided, filter by job
    if (jobId && app.jobId !== jobId) return false;
    
    // Search filter
    const matchesSearch = 
      app.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidateEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: applications.filter(a => !jobId || a.jobId === jobId).length,
    pending: applications.filter(a => (!jobId || a.jobId === jobId) && a.status === 'pending').length,
    reviewing: applications.filter(a => (!jobId || a.jobId === jobId) && a.status === 'reviewing').length,
    interview: applications.filter(a => (!jobId || a.jobId === jobId) && a.status === 'interview').length,
    offered: applications.filter(a => (!jobId || a.jobId === jobId) && a.status === 'offered').length
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      toast.success(`Application marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openApplicantDetail = (applicant) => {
    setSelectedApplicant(applicant);
    setDetailModalOpen(true);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div>
      <div style={styles.header}>
        {jobId && (
          <div style={styles.backLink} onClick={() => navigate('/recruiter/jobs')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Jobs
          </div>
        )}
        <h1 style={styles.title}>
          {jobId && job ? `Applicants for ${job.title}` : 'All Applicants'}
        </h1>
        <p style={styles.subtitle}>
          {stats.total} total applicants • {stats.pending} pending review
        </p>
      </div>

      {/* Quick Filter Stats */}
      <div style={styles.stats}>
        <div 
          style={{
            ...styles.statBadge,
            ...(statusFilter === 'all' ? styles.statBadgeActive : {})
          }}
          onClick={() => setStatusFilter('all')}
        >
          All ({stats.total})
        </div>
        <div 
          style={{
            ...styles.statBadge,
            ...(statusFilter === 'pending' ? styles.statBadgeActive : {})
          }}
          onClick={() => setStatusFilter('pending')}
        >
          Pending ({stats.pending})
        </div>
        <div 
          style={{
            ...styles.statBadge,
            ...(statusFilter === 'reviewing' ? styles.statBadgeActive : {})
          }}
          onClick={() => setStatusFilter('reviewing')}
        >
          Reviewing ({stats.reviewing})
        </div>
        <div 
          style={{
            ...styles.statBadge,
            ...(statusFilter === 'interview' ? styles.statBadgeActive : {})
          }}
          onClick={() => setStatusFilter('interview')}
        >
          Interview ({stats.interview})
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
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
        />
      </div>

      {/* Applicants List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spinner size="lg" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
          title={searchTerm || statusFilter !== 'all' ? 'No matching applicants' : 'No applicants yet'}
          description={
            searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Applicants will appear here once candidates apply to your jobs'
          }
        />
      ) : (
        <div style={styles.applicantsGrid}>
          {filteredApplications.map(app => (
            <div key={app.id} style={styles.applicantCard}>
              <div style={styles.applicantInfo}>
                <div style={styles.avatar}>
                  {getInitials(app.candidateName)}
                </div>
                <div style={styles.applicantDetails}>
                  <div 
                    style={{ ...styles.applicantName, cursor: 'pointer' }}
                    onClick={() => openApplicantDetail(app)}
                  >
                    {app.candidateName}
                  </div>
                  <div style={styles.applicantMeta}>
                    {app.candidateEmail}
                  </div>
                  {!jobId && (
                    <div style={styles.jobName}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      {app.jobTitle}
                    </div>
                  )}
                  <div style={styles.tags}>
                    <Status status={app.status} />
                    <Badge variant="tag">
                      Applied {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                    </Badge>
                  </div>
                  {app.resumeUrl && (
                    <a 
                      href={app.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={styles.resumeLink}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      View Resume
                    </a>
                  )}
                </div>
              </div>
              <div style={styles.actions}>
                <div style={styles.statusActions}>
                  {app.status === 'pending' && (
                    <>
                      <button
                        style={{ ...styles.iconButton, background: '#E1F5FE' }}
                        onClick={() => handleStatusChange(app.id, 'reviewing')}
                        disabled={updatingStatus === app.id}
                        title="Start Review"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0288D1" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </>
                  )}
                  {(app.status === 'pending' || app.status === 'reviewing') && (
                    <button
                      style={{ ...styles.iconButton, background: '#E8F5E9' }}
                      onClick={() => handleStatusChange(app.id, 'interview')}
                      disabled={updatingStatus === app.id}
                      title="Schedule Interview"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </button>
                  )}
                  {app.status === 'interview' && (
                    <button
                      style={{ ...styles.iconButton, background: '#FFF4E5' }}
                      onClick={() => handleStatusChange(app.id, 'offered')}
                      disabled={updatingStatus === app.id}
                      title="Make Offer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ED6C02" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </button>
                  )}
                  <button
                    style={{ ...styles.iconButton, background: '#FFEBEE' }}
                    onClick={() => handleStatusChange(app.id, 'rejected')}
                    disabled={updatingStatus === app.id}
                    title="Reject"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openApplicantDetail(app)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Applicant Details"
        size="lg"
      >
        {selectedApplicant && (
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ ...styles.avatar, width: '72px', height: '72px', fontSize: '1.5rem' }}>
                {getInitials(selectedApplicant.candidateName)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {selectedApplicant.candidateName}
                </h3>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                  {selectedApplicant.candidateEmail}
                </p>
                <Status status={selectedApplicant.status} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Applied Position:</strong> {selectedApplicant.jobTitle}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Applied Date:</strong> {format(new Date(selectedApplicant.appliedAt), 'MMMM d, yyyy')}
            </div>

            {selectedApplicant.resumeUrl && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Resume:</strong>
                <a 
                  href={selectedApplicant.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.resumeLink, marginLeft: '0.5rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Download Resume
                </a>
              </div>
            )}

            {selectedApplicant.coverLetter && (
              <div>
                <strong>Cover Letter:</strong>
                <div style={styles.coverLetter}>
                  {selectedApplicant.coverLetter}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <Select
                value={selectedApplicant.status}
                onChange={(e) => {
                  handleStatusChange(selectedApplicant.id, e.target.value);
                  setSelectedApplicant({ ...selectedApplicant, status: e.target.value });
                }}
                options={statusOptions.filter(o => o.value !== 'all')}
                style={{ minWidth: '150px' }}
              />
              <Button variant="secondary" onClick={() => setDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ApplicantsView;
