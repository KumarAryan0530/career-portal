// Header/Navbar Component
import React, { useState, useEffect } from 'react';
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
  // Mobile Menu Button
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    padding: '0.5rem',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.2s'
  },
  // Mobile Nav Overlay
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
    transition: 'opacity 0.3s ease'
  },
  // Mobile Nav Drawer
  mobileNav: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '280px',
    maxWidth: '85vw',
    height: '100%',
    background: '#fff',
    zIndex: 999,
    transition: 'transform 0.3s ease',
    overflowY: 'auto',
    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)'
  },
  mobileNavHeader: {
    padding: '1.25rem',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  mobileNavClose: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: '#fff',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  mobileNavUser: {
    padding: '1.5rem',
    borderBottom: '1px solid #E0DADA',
    background: '#FFF5F5'
  },
  mobileNavUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  mobileNavAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: '1.25rem'
  },
  mobileNavLinks: {
    padding: '1rem 0'
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    color: '#2D2D2D',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background 0.2s',
    borderLeft: '3px solid transparent'
  },
  mobileNavLinkActive: {
    background: '#FFF5F5',
    color: '#C41E3A',
    borderLeftColor: '#C41E3A'
  },
  mobileNavFooter: {
    padding: '1rem 1.5rem',
    borderTop: '1px solid #E0DADA',
    marginTop: 'auto'
  }
};

// Media query hook
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
};

const Header = () => {
  const { currentUser, userRole, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
      <div style={{
        ...headerStyles.container,
        padding: isMobile ? '0 1rem' : '0 1.5rem',
        height: isMobile ? '60px' : '70px'
      }}>
        <Link to={logoDestination} style={headerStyles.logo}>
          <div style={{
            ...headerStyles.logoIcon,
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px'
          }}>
            <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
            </svg>
          </div>
          <div style={headerStyles.logoContainer}>
            <span style={{
              ...headerStyles.logoText,
              fontSize: isMobile ? '1.25rem' : '1.5rem'
            }}>CareerHub</span>
            <span style={headerStyles.brandBy}>By Kumar Aryan</span>
          </div>
        </Link>

        {currentUser ? (
          <>
            {/* Desktop Navigation */}
            {!isMobile && (
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
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                style={{
                  ...headerStyles.mobileMenuBtn,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
            )}

            {/* Mobile Navigation Drawer */}
            {isMobile && mobileMenuOpen && (
              <>
                <div 
                  style={headerStyles.mobileOverlay}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div style={headerStyles.mobileNav}>
                  <div style={headerStyles.mobileNavHeader}>
                    <Link to={logoDestination} style={{ ...headerStyles.logo, gap: '0.5rem' }}>
                      <div style={{ ...headerStyles.logoIcon, width: '32px', height: '32px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
                        </svg>
                      </div>
                      <span style={{ ...headerStyles.logoText, fontSize: '1.1rem' }}>CareerHub</span>
                    </Link>
                    <button
                      style={headerStyles.mobileNavClose}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Close menu"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  
                  <div style={headerStyles.mobileNavUser}>
                    <div style={headerStyles.mobileNavUserInfo}>
                      <div style={headerStyles.mobileNavAvatar}>
                        {getInitials(userProfile?.fullName || currentUser.displayName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2D2D2D' }}>
                          {userProfile?.fullName || currentUser.displayName}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                          {currentUser.email}
                        </div>
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: '#C41E3A', 
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginTop: '0.25rem'
                        }}>
                          {userRole}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <nav style={headerStyles.mobileNavLinks}>
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        style={{
                          ...headerStyles.mobileNavLink,
                          ...(location.pathname === link.path ? headerStyles.mobileNavLinkActive : {})
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      to={userRole === 'recruiter' ? '/recruiter/profile' : '/candidate/profile'}
                      style={{
                        ...headerStyles.mobileNavLink,
                        ...(location.pathname.includes('/profile') ? headerStyles.mobileNavLinkActive : {})
                      }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile Settings
                    </Link>
                  </nav>
                  
                  <div style={headerStyles.mobileNavFooter}>
                    <button
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        background: '#FFF5F5',
                        border: '1px solid #FFCDD2',
                        borderRadius: '10px',
                        color: '#D32F2F',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.95rem'
                      }}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{
            ...headerStyles.userMenu,
            gap: isMobile ? '0.5rem' : '1rem'
          }}>
            <Link to="/login">
              <Button variant="ghost" style={{ 
                color: '#fff',
                padding: isMobile ? '0.5rem 0.75rem' : undefined,
                fontSize: isMobile ? '0.875rem' : undefined
              }}>Login</Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary" style={{
                padding: isMobile ? '0.5rem 1rem' : undefined,
                fontSize: isMobile ? '0.875rem' : undefined
              }}>Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
