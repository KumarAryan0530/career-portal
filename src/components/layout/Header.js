// Header/Navbar Component
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../shared/Button';

const headerStyles = {
  header: {
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    boxShadow: '0 4px 12px rgba(196, 30, 58, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: '#fff'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    fontFamily: "'Playfair Display', serif"
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandBy: {
    fontSize: '0.65rem',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
    marginTop: '-2px'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  navLink: {
    color: 'rgba(255,255,255,0.9)',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  navLinkActive: {
    background: 'rgba(255,255,255,0.2)',
    color: '#fff'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1rem',
    border: '2px solid rgba(255,255,255,0.3)',
    cursor: 'pointer'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    minWidth: '200px',
    overflow: 'hidden',
    animation: 'slideDown 0.2s ease-out'
  },
  dropdownHeader: {
    padding: '1rem',
    borderBottom: '1px solid #E0DADA',
    background: '#FFF5F5'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    color: '#2D2D2D',
    textDecoration: 'none',
    transition: 'background 0.2s',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.95rem'
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    padding: '0.5rem',
    cursor: 'pointer'
  }
};

const Header = () => {
  const { currentUser, userRole, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const candidateLinks = [
    { path: '/candidate/dashboard', label: 'Dashboard' },
    { path: '/candidate/jobs', label: 'Browse Jobs' },
    { path: '/candidate/applications', label: 'My Applications' }
  ];

  const recruiterLinks = [
    { path: '/recruiter/dashboard', label: 'Dashboard' },
    { path: '/recruiter/jobs', label: 'Manage Jobs' },
    { path: '/recruiter/applicants', label: 'Applicants' }
  ];

  const navLinks = userRole === 'recruiter' ? recruiterLinks : candidateLinks;
  
  // Logo should go to dashboard when logged in, home when not
  const logoDestination = currentUser 
    ? (userRole === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard')
    : '/';

  return (
    <header style={headerStyles.header}>
      <div style={headerStyles.container}>
        <Link to={logoDestination} style={headerStyles.logo}>
          <div style={headerStyles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
            </svg>
          </div>
          <div style={headerStyles.logoContainer}>
            <span style={headerStyles.logoText}>CareerHub</span>
            <span style={headerStyles.brandBy}>By Kumar Aryan</span>
          </div>
        </Link>

        {currentUser ? (
          <nav style={headerStyles.nav}>
            <ul style={headerStyles.navLinks}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{
                      ...headerStyles.navLink,
                      ...(location.pathname === link.path ? headerStyles.navLinkActive : {})
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ position: 'relative' }}>
              <div
                style={headerStyles.avatar}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {getInitials(userProfile?.fullName || currentUser.displayName)}
              </div>

              {showDropdown && (
                <div style={headerStyles.dropdown}>
                  <div style={headerStyles.dropdownHeader}>
                    <div style={{ fontWeight: '600', color: '#2D2D2D' }}>
                      {userProfile?.fullName || currentUser.displayName}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#C41E3A', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      marginTop: '0.5rem'
                    }}>
                      {userRole}
                    </div>
                  </div>
                  
                  <Link
                    to={userRole === 'recruiter' ? '/recruiter/profile' : '/candidate/profile'}
                    style={headerStyles.dropdownItem}
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile Settings
                  </Link>
                  
                  <button
                    style={{ ...headerStyles.dropdownItem, color: '#D32F2F' }}
                    onClick={handleLogout}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        ) : (
          <div style={headerStyles.userMenu}>
            <Link to="/login">
              <Button variant="ghost" style={{ color: '#fff' }}>Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
