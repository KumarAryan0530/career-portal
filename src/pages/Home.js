// Home/Landing Page
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/shared';
import { useAuth } from '../contexts/AuthContext';

// Styles for logged-in welcome page
const welcomeStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #fff 50%, #FFF5F5 100%)'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 3rem',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#C41E3A',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandBy: {
    fontSize: '0.6rem',
    color: '#888',
    fontWeight: '400',
    marginTop: '-2px'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 2rem',
    textAlign: 'center'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '2rem',
    boxShadow: '0 10px 40px rgba(196, 30, 58, 0.3)'
  },
  welcomeText: {
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '0.5rem'
  },
  userName: {
    fontSize: '3rem',
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: '1rem'
  },
  userRole: {
    display: 'inline-block',
    padding: '0.5rem 1.5rem',
    background: '#FFF5F5',
    border: '1px solid #FFCDD2',
    borderRadius: '20px',
    color: '#C41E3A',
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '2rem'
  },
  message: {
    fontSize: '1.1rem',
    color: '#666',
    maxWidth: '500px',
    lineHeight: '1.6',
    marginBottom: '2.5rem'
  },
  button: {
    padding: '1rem 3rem',
    fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(196, 30, 58, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  logoutBtn: {
    marginTop: '1.5rem',
    padding: '0.75rem 2rem',
    fontSize: '0.95rem',
    background: 'transparent',
    color: '#666',
    border: '1px solid #E0DADA',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

// Logged-in Welcome Component
const WelcomePage = ({ userProfile, userRole, logout, navigate }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleGetInto = () => {
    if (userRole === 'recruiter') {
      navigate('/recruiter/dashboard');
    } else {
      navigate('/candidate/dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const displayName = userProfile?.fullName || userProfile?.email?.split('@')[0] || 'User';

  return (
    <div style={welcomeStyles.container}>
      <nav style={welcomeStyles.nav}>
        <Link to="/" style={welcomeStyles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#C41E3A"/>
            <path d="M10 10h12v3H10zM10 15h8v3H10zM10 20h10v3H10z" fill="#fff"/>
          </svg>
          <div style={welcomeStyles.logoTextContainer}>
            <span>CareerHub</span>
            <span style={welcomeStyles.brandBy}>By Kumar Aryan</span>
          </div>
        </Link>
      </nav>

      <div style={welcomeStyles.content}>
        <div style={welcomeStyles.avatar}>
          {getInitials(displayName)}
        </div>
        <p style={welcomeStyles.welcomeText}>Welcome back,</p>
        <h1 style={welcomeStyles.userName}>{displayName}!</h1>
        <span style={welcomeStyles.userRole}>{userRole || 'User'}</span>
        <p style={welcomeStyles.message}>
          {userRole === 'recruiter' 
            ? "Ready to find your next great hire? Let's discover talented candidates for your open positions."
            : "Ready to take the next step in your career? Let's explore exciting opportunities waiting for you."
          }
        </p>
        <button 
          style={welcomeStyles.button}
          onClick={handleGetInto}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(196, 30, 58, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(196, 30, 58, 0.4)';
          }}
        >
          Get Into It →
        </button>
        <button 
          style={welcomeStyles.logoutBtn}
          onClick={handleLogout}
          onMouseOver={(e) => {
            e.target.style.background = '#f5f5f5';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 3rem',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#C41E3A',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  navLinks: {
    display: 'flex',
    gap: '1rem'
  },
  heroContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '4rem 3rem',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #fff 50%, #FFF5F5 100%)'
  },
  heroInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
    alignItems: 'center'
  },
  heroText: {
    maxWidth: '560px'
  },
  heroTag: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    background: '#FFF5F5',
    border: '1px solid #FFCDD2',
    borderRadius: '20px',
    color: '#C41E3A',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '1.5rem'
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '700',
    lineHeight: '1.1',
    color: '#2D2D2D',
    marginBottom: '1.5rem'
  },
  heroTitleAccent: {
    color: '#C41E3A'
  },
  heroDescription: {
    fontSize: '1.25rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '2rem'
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  },
  heroBadges: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  heroBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  heroVisual: {
    position: 'relative'
  },
  visualCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 20px 60px rgba(196, 30, 58, 0.15)',
    transform: 'rotate(-2deg)'
  },
  visualHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #E0DADA'
  },
  visualAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: '600'
  },
  visualInfo: {
    flex: 1
  },
  visualName: {
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  visualRole: {
    color: '#666',
    fontSize: '0.9rem'
  },
  visualStatus: {
    padding: '0.375rem 0.75rem',
    background: '#E8F5E9',
    color: '#2E7D32',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  visualStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  },
  visualStat: {
    textAlign: 'center',
    padding: '1rem',
    background: '#F9F9F9',
    borderRadius: '12px'
  },
  visualStatValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#C41E3A'
  },
  visualStatLabel: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '0.25rem'
  },
  floatingCard: {
    position: 'absolute',
    background: '#fff',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  features: {
    padding: '6rem 3rem',
    background: '#fff'
  },
  featuresInner: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: '4rem'
  },
  sectionTitleText: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2D2D2D',
    marginBottom: '1rem'
  },
  sectionSubtitle: {
    fontSize: '1.125rem',
    color: '#666',
    maxWidth: '600px',
    margin: '0 auto'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem'
  },
  featureCard: {
    padding: '2rem',
    background: '#F9F9F9',
    borderRadius: '20px',
    transition: 'all 0.3s'
  },
  featureIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFEBEE 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#C41E3A',
    marginBottom: '1.5rem'
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.75rem'
  },
  featureDesc: {
    color: '#666',
    lineHeight: '1.6'
  },
  roles: {
    padding: '6rem 3rem',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #fff 100%)'
  },
  rolesInner: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  rolesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem'
  },
  roleCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden'
  },
  roleCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px'
  },
  roleTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '1rem'
  },
  roleDesc: {
    color: '#666',
    marginBottom: '1.5rem',
    lineHeight: '1.6'
  },
  roleFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 1.5rem 0'
  },
  roleFeatureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0',
    color: '#444'
  },
  roleCheck: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#E8F5E9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2E7D32',
    flexShrink: 0
  },
  cta: {
    padding: '6rem 3rem',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    textAlign: 'center'
  },
  ctaInner: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '1rem'
  },
  ctaDesc: {
    fontSize: '1.125rem',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '2rem'
  },
  footer: {
    padding: '3rem',
    background: '#2D2D2D',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)'
  },
  footerLogo: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '0.5rem'
  }
};

const Home = () => {
  const { currentUser, userProfile, userRole, logout } = useAuth();
  const navigate = useNavigate();

  // If user is logged in, show welcome page
  if (currentUser) {
    return (
      <WelcomePage 
        userProfile={userProfile} 
        userRole={userRole} 
        logout={logout}
        navigate={navigate}
      />
    );
  }

  // Otherwise show the landing page for non-logged in users
  return (
    <div style={styles.hero}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#C41E3A"/>
            <path d="M10 10h12v3H10zM10 15h8v3H10zM10 20h10v3H10z" fill="#fff"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>CareerHub</span>
            <span style={{ fontSize: '0.6rem', color: '#888', fontWeight: '400', marginTop: '-2px' }}>By Kumar Aryan</span>
          </div>
        </Link>
        <div style={styles.navLinks}>
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.heroContent}>
        <div style={styles.heroInner}>
          <div style={styles.heroText}>
            <span style={styles.heroTag}>🚀 Your Career Journey Starts Here</span>
            <h1 style={styles.heroTitle}>
              Find Your Dream Job or{' '}
              <span style={styles.heroTitleAccent}>Perfect Candidate</span>
            </h1>
            <p style={styles.heroDescription}>
              Connect with top companies and talented professionals. Our platform makes recruitment 
              simple, efficient, and secure with cloud-based storage and real-time updates.
            </p>
            <div style={styles.heroActions}>
              <Link to="/signup">
                <Button size="lg">
                  Get Started Free
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '0.5rem' }}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">Sign In</Button>
              </Link>
            </div>
            <div style={styles.heroBadges}>
              <div style={styles.heroBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Free to use
              </div>
              <div style={styles.heroBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Cloud storage
              </div>
              <div style={styles.heroBadge}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Secure
              </div>
            </div>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.visualCard}>
              <div style={styles.visualHeader}>
                <div style={styles.visualAvatar}>JD</div>
                <div style={styles.visualInfo}>
                  <div style={styles.visualName}>John Doe</div>
                  <div style={styles.visualRole}>Software Engineer</div>
                </div>
                <span style={styles.visualStatus}>Hired!</span>
              </div>
              <div style={styles.visualStats}>
                <div style={styles.visualStat}>
                  <div style={styles.visualStatValue}>24</div>
                  <div style={styles.visualStatLabel}>Applications</div>
                </div>
                <div style={styles.visualStat}>
                  <div style={styles.visualStatValue}>8</div>
                  <div style={styles.visualStatLabel}>Interviews</div>
                </div>
                <div style={styles.visualStat}>
                  <div style={styles.visualStatValue}>3</div>
                  <div style={styles.visualStatLabel}>Offers</div>
                </div>
              </div>
            </div>
            <div style={{ ...styles.floatingCard, top: '-20px', right: '20px', transform: 'rotate(3deg)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>New Interview</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>Tomorrow at 2pm</div>
              </div>
            </div>
            <div style={{ ...styles.floatingCard, bottom: '60px', left: '-30px', transform: 'rotate(-3deg)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>5 New Jobs</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>Match your skills</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featuresInner}>
          <div style={styles.sectionTitle}>
            <h2 style={styles.sectionTitleText}>Why Choose CareerPortal?</h2>
            <p style={styles.sectionSubtitle}>
              Everything you need to find your next opportunity or hire great talent
            </p>
          </div>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Cloud Storage</h3>
              <p style={styles.featureDesc}>
                Securely store resumes and documents in the cloud. Access your files from anywhere, anytime.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Secure Authentication</h3>
              <p style={styles.featureDesc}>
                Enterprise-grade security with Firebase Authentication. Your data is always protected.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Role-Based Access</h3>
              <p style={styles.featureDesc}>
                Tailored experiences for candidates and recruiters with dedicated dashboards and features.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Smart Job Search</h3>
              <p style={styles.featureDesc}>
                Find relevant opportunities with powerful search filters by location, type, and skills.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Easy Applications</h3>
              <p style={styles.featureDesc}>
                Apply to jobs with one click. Track all your applications in a single dashboard.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 style={styles.featureTitle}>Real-time Updates</h3>
              <p style={styles.featureDesc}>
                Get instant notifications on application status changes and new matching jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section style={styles.roles}>
        <div style={styles.rolesInner}>
          <div style={styles.sectionTitle}>
            <h2 style={styles.sectionTitleText}>Choose Your Path</h2>
            <p style={styles.sectionSubtitle}>
              Whether you're looking for a job or looking to hire, we've got you covered
            </p>
          </div>
          <div style={styles.rolesGrid}>
            <div style={styles.roleCard}>
              <div style={{ ...styles.roleCardBorder, background: 'linear-gradient(135deg, #0288D1 0%, #01579B 100%)' }} />
              <h3 style={styles.roleTitle}>For Candidates</h3>
              <p style={styles.roleDesc}>
                Discover exciting opportunities from top companies and take the next step in your career.
              </p>
              <ul style={styles.roleFeatures}>
                <li style={styles.roleFeatureItem}>
                  <span style={styles.roleCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Browse thousands of job listings
                </li>
                <li style={styles.roleFeatureItem}>
                  <span style={styles.roleCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Upload and manage your resume
                </li>
                <li style={styles.roleFeatureItem}>
                  <span style={styles.roleCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Track application status
                </li>
                <li style={styles.roleFeatureItem}>
                  <span style={styles.roleCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  One-click apply to jobs
                </li>
              </ul>
              <Link to="/signup?role=candidate">
                <Button variant="secondary" style={{ width: '100%' }}>
                  Start Job Search
                </Button>
              </Link>
            </div>
            <div style={styles.roleCard}>
              <div style={{ ...styles.roleCardBorder, background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)' }} />
              <h3 style={styles.roleTitle}>For Recruiters</h3>
              <p style={styles.roleDesc}>
                Find the best talent for your team with powerful recruitment tools.
              </p>
              <ul style={styles.roleFeatures}>
                <li style={styles.roleFeatureItem}>
                  <span style={styles.roleCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Post unlimited job listings
                </li>
                <li style={styles.roleFeatureItem}>
                  <span style={styles.roleCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Review applicants easily
                </li>
                <li style={styles.roleFeatureItem}>
                  <span style={styles.roleCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Download resumes instantly
                </li>
                <li style={styles.roleFeatureItem}>
                  <span style={styles.roleCheck}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  Manage hiring pipeline
                </li>
              </ul>
              <Link to="/signup?role=recruiter">
                <Button style={{ width: '100%' }}>
                  Start Hiring
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
          <p style={styles.ctaDesc}>
            Join thousands of professionals and companies who trust CareerPortal for their recruitment needs.
          </p>
          <Link to="/signup">
            <Button variant="secondary" size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}>CareerPortal</div>
        <p>© 2024 CareerPortal. Built with React & Firebase.</p>
      </footer>
    </div>
  );
};

export default Home;
