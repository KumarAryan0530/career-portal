// Recruiter Dashboard
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../hooks/useJobs';
import { useApplications } from '../../hooks/useApplications';
import { Button, Status, Spinner } from '../shared';
import { format } from 'date-fns';

const dashboardStyles = {
  header: {
    marginBottom: '2rem'
  },
  greeting: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.5rem'
  },
  subtext: {
    color: '#666'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden'
  },
  statCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#2D2D2D'
  },
  statLabel: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.25rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem'
  },
  section: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #E0DADA',
    background: 'linear-gradient(180deg, #FFF5F5 0%, #fff 100%)'
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2D2D2D'
  },
  sectionBody: {
    padding: '0'
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #E0DADA',
    transition: 'background 0.2s'
  },
  listItemInfo: {
    flex: 1
  },
  listItemTitle: {
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  listItemMeta: {
    fontSize: '0.9rem',
    color: '#666'
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#666'
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '2rem'
  },
  actionCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
    color: 'inherit'
  },
  actionIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  actionTitle: {
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  actionDesc: {
    fontSize: '0.9rem',
    color: '#666'
  }
};

const RecruiterDashboard = () => {
  const { userProfile } = useAuth();
  const { jobs, fetchRecruiterJobs, loading: jobsLoading } = useJobs();
  const { applications, fetchRecruiterApplications, loading: appsLoading } = useApplications();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    newApplications: 0,
    interviews: 0
  });

  useEffect(() => {
    fetchRecruiterJobs();
    fetchRecruiterApplications();
  }, [fetchRecruiterJobs, fetchRecruiterApplications]);

  useEffect(() => {
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const totalApplicants = applications.length;
    const newApplications = applications.filter(a => a.status === 'pending').length;
    const interviews = applications.filter(a => a.status === 'interview').length;

    setStats({ activeJobs, totalApplicants, newApplications, interviews });
  }, [jobs, applications]);

  const recentApplications = applications.slice(0, 5);
  const activeJobs = jobs.filter(j => j.status === 'active').slice(0, 5);

  return (
    <div>
      <div style={dashboardStyles.header}>
        <h1 style={dashboardStyles.greeting}>
          Welcome back, {userProfile?.fullName?.split(' ')[0] || 'Recruiter'}!
        </h1>
        <p style={dashboardStyles.subtext}>
          Here's an overview of your recruitment activities
        </p>
      </div>

      {/* Quick Actions */}
      <div style={dashboardStyles.quickActions}>
        <Link to="/recruiter/jobs/new" style={dashboardStyles.actionCard}>
          <div style={{ ...dashboardStyles.actionIcon, background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <div>
            <div style={dashboardStyles.actionTitle}>Post New Job</div>
            <div style={dashboardStyles.actionDesc}>Create a new job listing</div>
          </div>
        </Link>
        <Link to="/recruiter/applicants" style={dashboardStyles.actionCard}>
          <div style={{ ...dashboardStyles.actionIcon, background: 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <div style={dashboardStyles.actionTitle}>View Applicants</div>
            <div style={dashboardStyles.actionDesc}>Review all applications</div>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={dashboardStyles.statsGrid}>
        <div style={dashboardStyles.statCard}>
          <div style={{ ...dashboardStyles.statCardBorder, background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)' }} />
          <div style={{ ...dashboardStyles.statIcon, background: '#FFF5F5', color: '#C41E3A' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <div style={dashboardStyles.statValue}>{stats.activeJobs}</div>
          <div style={dashboardStyles.statLabel}>Active Jobs</div>
        </div>

        <div style={dashboardStyles.statCard}>
          <div style={{ ...dashboardStyles.statCardBorder, background: '#0288D1' }} />
          <div style={{ ...dashboardStyles.statIcon, background: '#E1F5FE', color: '#0288D1' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div style={dashboardStyles.statValue}>{stats.totalApplicants}</div>
          <div style={dashboardStyles.statLabel}>Total Applicants</div>
        </div>

        <div style={dashboardStyles.statCard}>
          <div style={{ ...dashboardStyles.statCardBorder, background: '#ED6C02' }} />
          <div style={{ ...dashboardStyles.statIcon, background: '#FFF4E5', color: '#ED6C02' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div style={dashboardStyles.statValue}>{stats.newApplications}</div>
          <div style={dashboardStyles.statLabel}>Pending Review</div>
        </div>

        <div style={dashboardStyles.statCard}>
          <div style={{ ...dashboardStyles.statCardBorder, background: '#2E7D32' }} />
          <div style={{ ...dashboardStyles.statIcon, background: '#E8F5E9', color: '#2E7D32' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div style={dashboardStyles.statValue}>{stats.interviews}</div>
          <div style={dashboardStyles.statLabel}>Scheduled Interviews</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={dashboardStyles.grid}>
        {/* Recent Applications */}
        <div style={dashboardStyles.section}>
          <div style={dashboardStyles.sectionHeader}>
            <h2 style={dashboardStyles.sectionTitle}>Recent Applications</h2>
            <Link to="/recruiter/applicants">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div style={dashboardStyles.sectionBody}>
            {appsLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Spinner />
              </div>
            ) : recentApplications.length === 0 ? (
              <div style={dashboardStyles.emptyState}>
                No applications yet
              </div>
            ) : (
              recentApplications.map(app => (
                <div key={app.id} style={dashboardStyles.listItem}>
                  <div style={dashboardStyles.listItemInfo}>
                    <div style={dashboardStyles.listItemTitle}>{app.candidateName}</div>
                    <div style={dashboardStyles.listItemMeta}>
                      Applied for {app.jobTitle}
                    </div>
                  </div>
                  <Status status={app.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Jobs */}
        <div style={dashboardStyles.section}>
          <div style={dashboardStyles.sectionHeader}>
            <h2 style={dashboardStyles.sectionTitle}>Active Job Postings</h2>
            <Link to="/recruiter/jobs">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div style={dashboardStyles.sectionBody}>
            {jobsLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Spinner />
              </div>
            ) : activeJobs.length === 0 ? (
              <div style={dashboardStyles.emptyState}>
                <p style={{ marginBottom: '1rem' }}>No active jobs</p>
                <Link to="/recruiter/jobs/new">
                  <Button size="sm">Post a Job</Button>
                </Link>
              </div>
            ) : (
              activeJobs.map(job => (
                <Link
                  to={`/recruiter/jobs/${job.id}`}
                  key={job.id}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={dashboardStyles.listItem}>
                    <div style={dashboardStyles.listItemInfo}>
                      <div style={dashboardStyles.listItemTitle}>{job.title}</div>
                      <div style={dashboardStyles.listItemMeta}>
                        {job.applicantCount || 0} applicants • Posted {format(new Date(job.createdAt), 'MMM d')}
                      </div>
                    </div>
                    <Status status={job.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
