// Candidate Applications Page
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplications } from '../../hooks/useApplications';
import { Button, Status, Spinner, EmptyState, Select } from '../shared';
import { format } from 'date-fns';

const applicationsStyles = {
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
    alignItems: 'center'
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    flex: 1,
    background: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2D2D2D'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '0.25rem'
  },
  applicationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  applicationCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    transition: 'all 0.2s'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.5rem',
    background: 'linear-gradient(180deg, #FFF5F5 0%, #fff 100%)',
    borderBottom: '1px solid #E0DADA'
  },
  jobInfo: {
    flex: 1
  },
  jobTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  company: {
    color: '#C41E3A',
    fontWeight: '500',
    marginBottom: '0.5rem'
  },
  appliedDate: {
    color: '#666',
    fontSize: '0.9rem'
  },
  cardBody: {
    padding: '1.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem'
  },
  infoItem: {
    
  },
  infoLabel: {
    fontSize: '0.8rem',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.25rem'
  },
  infoValue: {
    color: '#2D2D2D',
    fontWeight: '500'
  },
  cardFooter: {
    padding: '1rem 1.5rem',
    background: '#FAFAFA',
    borderTop: '1px solid #E0DADA',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timeline: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#666'
  },
  resumeLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#C41E3A',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500'
  }
};

const CandidateApplications = () => {
  const { applications, fetchCandidateApplications, loading } = useApplications();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCandidateApplications();
  }, [fetchCandidateApplications]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'interview', label: 'Interview' },
    { value: 'offered', label: 'Offered' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  const filteredApplications = applications
    .filter(app => filter === 'all' || app.status === filter)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.appliedAt) - new Date(a.appliedAt);
      }
      return new Date(a.appliedAt) - new Date(b.appliedAt);
    });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offered: applications.filter(a => a.status === 'offered').length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div style={applicationsStyles.header}>
        <h1 style={applicationsStyles.title}>My Applications</h1>
        <div style={applicationsStyles.filters}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={statusOptions}
            placeholder="Filter by status"
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
            placeholder="Sort by"
          />
        </div>
      </div>

      {/* Stats */}
      <div style={applicationsStyles.stats}>
        <div style={applicationsStyles.statCard}>
          <div style={applicationsStyles.statValue}>{stats.total}</div>
          <div style={applicationsStyles.statLabel}>Total</div>
        </div>
        <div style={applicationsStyles.statCard}>
          <div style={{ ...applicationsStyles.statValue, color: '#ED6C02' }}>{stats.pending}</div>
          <div style={applicationsStyles.statLabel}>Pending</div>
        </div>
        <div style={applicationsStyles.statCard}>
          <div style={{ ...applicationsStyles.statValue, color: '#0288D1' }}>{stats.interview}</div>
          <div style={applicationsStyles.statLabel}>Interviews</div>
        </div>
        <div style={applicationsStyles.statCard}>
          <div style={{ ...applicationsStyles.statValue, color: '#2E7D32' }}>{stats.offered}</div>
          <div style={applicationsStyles.statLabel}>Offers</div>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          }
          title={filter === 'all' ? "No applications yet" : `No ${filter} applications`}
          description={filter === 'all' 
            ? "Start applying to jobs to track your applications here" 
            : "Try changing the filter to see other applications"}
          action={filter === 'all'}
          actionLabel="Browse Jobs"
          onAction={() => window.location.href = '/candidate/jobs'}
        />
      ) : (
        <div style={applicationsStyles.applicationsList}>
          {filteredApplications.map(app => (
            <div key={app.id} style={applicationsStyles.applicationCard}>
              <div style={applicationsStyles.cardHeader}>
                <div style={applicationsStyles.jobInfo}>
                  <h3 style={applicationsStyles.jobTitle}>{app.jobTitle}</h3>
                  <div style={applicationsStyles.company}>{app.company}</div>
                  <div style={applicationsStyles.appliedDate}>
                    Applied on {format(new Date(app.appliedAt), 'MMMM d, yyyy')}
                  </div>
                </div>
                <Status status={app.status} />
              </div>

              <div style={applicationsStyles.cardBody}>
                <div style={applicationsStyles.infoItem}>
                  <div style={applicationsStyles.infoLabel}>Status Updated</div>
                  <div style={applicationsStyles.infoValue}>
                    {format(new Date(app.updatedAt), 'MMM d, yyyy')}
                  </div>
                </div>
                <div style={applicationsStyles.infoItem}>
                  <div style={applicationsStyles.infoLabel}>Resume</div>
                  <a 
                    href={app.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={applicationsStyles.resumeLink}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    {app.resumeName || 'View Resume'}
                  </a>
                </div>
                {app.recruiterNotes && (
                  <div style={{ ...applicationsStyles.infoItem, gridColumn: 'span 2' }}>
                    <div style={applicationsStyles.infoLabel}>Recruiter Notes</div>
                    <div style={applicationsStyles.infoValue}>{app.recruiterNotes}</div>
                  </div>
                )}
              </div>

              <div style={applicationsStyles.cardFooter}>
                <div style={applicationsStyles.timeline}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {Math.ceil((new Date() - new Date(app.appliedAt)) / (1000 * 60 * 60 * 24))} days ago
                </div>
                <Link to={`/candidate/jobs/${app.jobId}`}>
                  <Button variant="ghost" size="sm">View Job</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateApplications;
