// Signup Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input } from '../shared';
import toast from 'react-hot-toast';

const signupStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFE8E8 100%)'
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    overflowY: 'auto'
  },
  formCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem'
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(196, 30, 58, 0.4)'
  },
  logoText: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#2D2D2D',
    fontFamily: "'Playfair Display', serif"
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '0.5rem',
    color: '#2D2D2D'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '1.5rem'
  },
  roleSelector: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  roleOption: {
    flex: 1,
    padding: '1.25rem 1rem',
    border: '2px solid #E0DADA',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    background: '#fff'
  },
  roleOptionActive: {
    borderColor: '#C41E3A',
    background: '#FFF5F5',
    boxShadow: '0 0 0 3px rgba(196, 30, 58, 0.15)'
  },
  roleIcon: {
    width: '40px',
    height: '40px',
    margin: '0 auto 0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px'
  },
  roleLabel: {
    fontWeight: '600',
    color: '#2D2D2D',
    fontSize: '0.95rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  formRow: {
    display: 'flex',
    gap: '1rem'
  },
  terms: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    margin: '1rem 0',
    fontSize: '0.9rem',
    color: '#666'
  },
  checkbox: {
    marginTop: '0.2rem',
    accentColor: '#C41E3A'
  },
  termsLink: {
    color: '#C41E3A',
    textDecoration: 'none'
  },
  loginText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#666'
  },
  loginLink: {
    color: '#C41E3A',
    fontWeight: '600',
    textDecoration: 'none'
  },
  heroContent: {
    textAlign: 'center',
    color: '#fff',
    maxWidth: '500px',
    position: 'relative',
    zIndex: 1
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
    fontFamily: "'Playfair Display', serif"
  },
  heroText: {
    fontSize: '1.1rem',
    opacity: 0.9,
    lineHeight: 1.6,
    marginBottom: '2rem'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px'
  },
  featureIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)'
  }
};

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('candidate');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (role === 'recruiter' && !formData.company.trim()) {
      newErrors.company = 'Company name is required for recruiters';
    }

    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(formData.email, formData.password, role, {
        fullName: formData.fullName,
        phone: formData.phone,
        company: formData.company
      });
      
      toast.success('Account created successfully!');
      navigate(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={signupStyles.container}>
      <div style={signupStyles.leftPanel}>
        <div style={{ ...signupStyles.decorCircle, width: '400px', height: '400px', top: '-100px', left: '-100px' }} />
        <div style={{ ...signupStyles.decorCircle, width: '300px', height: '300px', bottom: '-50px', right: '-50px' }} />
        
        <div style={signupStyles.heroContent}>
          <h2 style={signupStyles.heroTitle}>Start Your Journey</h2>
          <p style={signupStyles.heroText}>
            Join thousands of professionals who have found their perfect match through CareerHub.
          </p>
          
          <div style={signupStyles.features}>
            <div style={signupStyles.feature}>
              <div style={signupStyles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span>Access to thousands of job opportunities</span>
            </div>
            <div style={signupStyles.feature}>
              <div style={signupStyles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <span>Secure cloud storage for your documents</span>
            </div>
            <div style={signupStyles.feature}>
              <div style={signupStyles.featureIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <span>Connect with top employers directly</span>
            </div>
          </div>
        </div>
      </div>

      <div style={signupStyles.rightPanel}>
        <div style={signupStyles.formCard}>
          <div style={signupStyles.logo}>
            <div style={signupStyles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
              </svg>
            </div>
            <span style={signupStyles.logoText}>CareerHub</span>
          </div>

          <h1 style={signupStyles.title}>Create Account</h1>
          <p style={signupStyles.subtitle}>Choose your account type to get started</p>

          <div style={signupStyles.roleSelector}>
            <div
              style={{
                ...signupStyles.roleOption,
                ...(role === 'candidate' ? signupStyles.roleOptionActive : {})
              }}
              onClick={() => setRole('candidate')}
            >
              <div style={{ ...signupStyles.roleIcon, background: role === 'candidate' ? '#C41E3A' : '#E0DADA' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={role === 'candidate' ? '#fff' : '#666'} strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div style={signupStyles.roleLabel}>Candidate</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>Looking for jobs</div>
            </div>
            
            <div
              style={{
                ...signupStyles.roleOption,
                ...(role === 'recruiter' ? signupStyles.roleOptionActive : {})
              }}
              onClick={() => setRole('recruiter')}
            >
              <div style={{ ...signupStyles.roleIcon, background: role === 'recruiter' ? '#C41E3A' : '#E0DADA' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={role === 'recruiter' ? '#fff' : '#666'} strokeWidth="2">
                  <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
                </svg>
              </div>
              <div style={signupStyles.roleLabel}>Recruiter</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>Hiring talent</div>
            </div>
          </div>

          <form style={signupStyles.form} onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.fullName}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
            />

            {role === 'recruiter' && (
              <Input
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company Inc."
                error={errors.company}
                required
              />
            )}

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />

            <div style={signupStyles.formRow}>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                error={errors.password}
                required
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                error={errors.confirmPassword}
                required
              />
            </div>

            <div style={signupStyles.terms}>
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                style={signupStyles.checkbox}
              />
              <span>
                I agree to the{' '}
                <a href="#terms" style={signupStyles.termsLink}>Terms of Service</a>
                {' '}and{' '}
                <a href="#privacy" style={signupStyles.termsLink}>Privacy Policy</a>
              </span>
            </div>
            {errors.agreedToTerms && (
              <div style={{ color: '#D32F2F', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                {errors.agreedToTerms}
              </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
              Create Account
            </Button>
          </form>

          <p style={signupStyles.loginText}>
            Already have an account?{' '}
            <Link to="/login" style={signupStyles.loginLink}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
