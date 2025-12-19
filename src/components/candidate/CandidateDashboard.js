// Candidate Dashboard
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../hooks/useApplications';
import { useJobs } from '../../hooks/useJobs';
import { Card, Button, Status, Spinner } from '../shared';
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
    color: '#666',
    fontSize: '1rem'
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
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2D2D2D'
  },
  applicationCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    borderLeft: '4px solid #C41E3A',
    transition: 'all 0.2s'
  },
  applicationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem'
  },
  applicationTitle: {
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  applicationCompany: {
    color: '#C41E3A',
    fontSize: '0.9rem'
  },
  applicationDate: {
    color: '#666',
    fontSize: '0.85rem'
  },
  jobCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  profileCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    color: '#fff',
    fontSize: '2rem',
    fontWeight: '600'
  },
  profileName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  profileEmail: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  },
  profileCompletion: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #E0DADA'
  },
  progressBar: {
    height: '8px',
    background: '#E0DADA',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '0.5rem'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  }
};

const CandidateDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const { applications, fetchCandidateApplications, loading: appsLoading } = useApplications();
  const { jobs, loading: jobsLoading } = useJobs();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    interviews: 0,
    offers: 0
  });

  useEffect(() => {
    fetchCandidateApplications();
  }, [fetchCandidateApplications]);

  useEffect(() => {
    if (applications.length > 0) {
      setStats({
        totalApplications: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        interviews: applications.filter(a => a.status === 'interview').length,
        offers: applications.filter(a => a.status === 'offered').length
      });
    }
  }, [applications]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const calculateProfileCompletion = () => {
    const fields = ['fullName', 'email', 'phone', 'bio', 'skills', 'experience', 'education', 'resumeUrl'];
    const completed = fields.filter(field => {
      const value = userProfile?.[field];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    }).length;
    return Math.round((completed / fields.length) * 100);
  };

  const recentJobs = jobs.slice(0, 5);
  const recentApplications = applications.slice(0, 5);
  const profileCompletion = calculateProfileCompletion();

  return (
    <div>
      <div style={dashboardStyles.header}>
        <h1 style={dashboardStyles.greeting}>
          Welcome back, {userProfile?.fullName?.split(' ')[0] || 'User'}!
        </h1>
        <p style={dashboardStyles.subtext}>
          Here's what's happening with your job search
        </p>
      </div>

      {/* Stats Grid */}
      <div style={dashboardStyles.statsGrid}>
        <div style={dashboardStyles.statCard}>
          <div style={{ ...dashboardStyles.statCardBorder, background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)' }} />
          <div style={{ ...dashboardStyles.statIcon, background: '#FFF5F5', color: '#C41E3A' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <div style={dashboardStyles.statValue}>{stats.totalApplications}</div>
          <div style={dashboardStyles.statLabel}>Total Applications</div>
        </div>

        <div style={dashboardStyles.statCard}>
          <div style={{ ...dashboardStyles.statCardBorder, background: '#ED6C02' }} />
          <div style={{ ...dashboardStyles.statIcon, background: '#FFF4E5', color: '#ED6C02' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div style={dashboardStyles.statValue}>{stats.pending}</div>
          <div style={dashboardStyles.statLabel}>Pending Review</div>
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
          <div style={dashboardStyles.statValue}>{stats.interviews}</div>
          <div style={dashboardStyles.statLabel}>Interviews</div>
        </div>

        <div style={dashboardStyles.statCard}>
          <div style={{ ...dashboardStyles.statCardBorder, background: '#2E7D32' }} />
          <div style={{ ...dashboardStyles.statIcon, background: '#E8F5E9', color: '#2E7D32' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div style={dashboardStyles.statValue}>{stats.offers}</div>
          <div style={dashboardStyles.statLabel}>Offers Received</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={dashboardStyles.grid}>
        <div>
          {/* Recent Applications */}
          <div style={dashboardStyles.section}>
            <div style={dashboardStyles.sectionHeader}>
              <h2 style={dashboardStyles.sectionTitle}>Recent Applications</h2>
              <Link to="/candidate/applications">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

            {appsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Spinner />
              </div>
            ) : recentApplications.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                background: '#fff', 
                borderRadius: '12px',
                border: '2px dashed #E0DADA'
              }}>
                <p style={{ color: '#666', marginBottom: '1rem' }}>No applications yet</p>
                <Link to="/candidate/jobs">
                  <Button size="sm">Browse Jobs</Button>
                </Link>
              </div>
            ) : (
              recentApplications.map(app => (
                <div key={app.id} style={dashboardStyles.applicationCard}>
                  <div style={dashboardStyles.applicationHeader}>
                    <div>
                      <div style={dashboardStyles.applicationTitle}>{app.jobTitle}</div>
                      <div style={dashboardStyles.applicationCompany}>{app.company}</div>
                    </div>
                    <Status status={app.status} />
                  </div>
                  <div style={dashboardStyles.applicationDate}>
                    Applied {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recommended Jobs */}
          <div style={dashboardStyles.section}>
            <div style={dashboardStyles.sectionHeader}>
              <h2 style={dashboardStyles.sectionTitle}>Recommended Jobs</h2>
              <Link to="/candidate/jobs">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

            {jobsLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Spinner />
              </div>
            ) : recentJobs.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                background: '#fff', 
                borderRadius: '12px',
                border: '2px dashed #E0DADA'
              }}>
                <p style={{ color: '#666' }}>No jobs available at the moment</p>
              </div>
            ) : (
              recentJobs.map(job => (
                <Link to={`/candidate/jobs/${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                  <div style={dashboardStyles.jobCard}>
                    <div style={{ fontWeight: '600', color: '#2D2D2D', marginBottom: '0.25rem' }}>
                      {job.title}
                    </div>
                    <div style={{ color: '#C41E3A', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {job.company}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', color: '#666', fontSize: '0.85rem' }}>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                      <span>•</span>
                      <span>{job.salary}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Profile Card */}
          <div style={dashboardStyles.profileCard}>
            <div style={dashboardStyles.avatar}>
              {getInitials(userProfile?.fullName)}
            </div>
            <div style={dashboardStyles.profileName}>
              {userProfile?.fullName || 'User'}
            </div>
            <div style={dashboardStyles.profileEmail}>
              {currentUser?.email}
            </div>
            <Link to="/candidate/profile">
              <Button variant="secondary" size="sm" fullWidth>
                Edit Profile
              </Button>
            </Link>

            <div style={dashboardStyles.profileCompletion}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#666' }}>Profile Completion</span>
                <span style={{ color: '#C41E3A', fontWeight: '600' }}>{profileCompletion}%</span>
              </div>
              <div style={dashboardStyles.progressBar}>
                <div style={{ ...dashboardStyles.progressFill, width: `${profileCompletion}%` }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ ...dashboardStyles.profileCard, marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'left' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/candidate/jobs" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" fullWidth size="sm">
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/candidate/profile" style={{ textDecoration: 'none' }}>
                <Button variant="secondary" fullWidth size="sm">
                  Update Resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
