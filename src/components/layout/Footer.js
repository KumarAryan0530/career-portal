// Footer Component
import React from 'react';
import { Link } from 'react-router-dom';

const footerStyles = {
  footer: {
    background: '#2D2D2D',
    color: '#fff',
    marginTop: 'auto'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 1.5rem 1.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  column: {
    
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: '#C41E3A',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    fontFamily: "'Playfair Display', serif"
  },
  description: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.95rem',
    lineHeight: '1.6'
  },
  heading: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#fff'
  },
  links: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  link: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    display: 'block',
    padding: '0.35rem 0',
    transition: 'color 0.2s'
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  copyright: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.9rem'
  },
  social: {
    display: 'flex',
    gap: '1rem'
  },
  socialLink: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    transition: 'all 0.2s'
  }
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer style={footerStyles.footer}>
      <div style={footerStyles.container}>
        <div style={footerStyles.grid}>
          <div style={footerStyles.column}>
            <div style={footerStyles.logo}>
              <div style={footerStyles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
                </svg>
              </div>
              <span style={footerStyles.logoText}>CareerHub</span>
            </div>
            <p style={footerStyles.description}>
              Your professional career portal for finding the perfect job opportunity or the ideal candidate.
            </p>
          </div>

          <div style={footerStyles.column}>
            <h4 style={footerStyles.heading}>For Candidates</h4>
            <ul style={footerStyles.links}>
              <li><Link to="/candidate/jobs" style={footerStyles.link}>Browse Jobs</Link></li>
              <li><Link to="/signup" style={footerStyles.link}>Create Account</Link></li>
              <li><Link to="/candidate/applications" style={footerStyles.link}>Track Applications</Link></li>
            </ul>
          </div>

          <div style={footerStyles.column}>
            <h4 style={footerStyles.heading}>For Recruiters</h4>
            <ul style={footerStyles.links}>
              <li><Link to="/recruiter/jobs" style={footerStyles.link}>Post a Job</Link></li>
              <li><Link to="/signup" style={footerStyles.link}>Employer Account</Link></li>
              <li><Link to="/recruiter/applicants" style={footerStyles.link}>View Applicants</Link></li>
            </ul>
          </div>

          <div style={footerStyles.column}>
            <h4 style={footerStyles.heading}>Company</h4>
            <ul style={footerStyles.links}>
              <li><a href="#about" style={footerStyles.link}>About Us</a></li>
              <li><a href="#contact" style={footerStyles.link}>Contact</a></li>
              <li><a href="#privacy" style={footerStyles.link}>Privacy Policy</a></li>
              <li><a href="#terms" style={footerStyles.link}>Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div style={footerStyles.bottom}>
          <p style={footerStyles.copyright}>
            © {year} CareerHub. All rights reserved.
          </p>
          <div style={footerStyles.social}>
            <a href="#linkedin" style={footerStyles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a href="#twitter" style={footerStyles.socialLink}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
