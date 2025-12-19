// Login Page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input } from '../shared';
import toast from 'react-hot-toast';

const loginStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #FFF5F5 0%, #FFE8E8 100%)'
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  rightPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden'
  },
  formCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '3rem',
    width: '100%',
    maxWidth: '450px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '2rem'
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
    marginBottom: '2rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: '-0.5rem',
    marginBottom: '1rem'
  },
  forgotLink: {
    color: '#C41E3A',
    fontSize: '0.9rem',
    textDecoration: 'none'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
    color: '#999',
    fontSize: '0.9rem'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#E0DADA'
  },
  dividerText: {
    padding: '0 1rem'
  },
  signupText: {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#666'
  },
  signupLink: {
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
    lineHeight: 1.6
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)'
  }
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to login';
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.leftPanel}>
        <div style={loginStyles.formCard}>
          <div style={loginStyles.logo}>
            <div style={loginStyles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
              </svg>
            </div>
            <span style={loginStyles.logoText}>CareerHub</span>
          </div>

          <h1 style={loginStyles.title}>Welcome Back</h1>
          <p style={loginStyles.subtitle}>Sign in to your account to continue</p>

          <form style={loginStyles.form} onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              required
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              }
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              }
            />

            <div style={loginStyles.forgotPassword}>
              <a href="#forgot" style={loginStyles.forgotLink}>Forgot password?</a>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          <p style={loginStyles.signupText}>
            Don't have an account?{' '}
            <Link to="/signup" style={loginStyles.signupLink}>
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <div style={loginStyles.rightPanel}>
        <div style={{ ...loginStyles.decorCircle, width: '400px', height: '400px', top: '-100px', right: '-100px' }} />
        <div style={{ ...loginStyles.decorCircle, width: '300px', height: '300px', bottom: '-50px', left: '-50px' }} />
        
        <div style={loginStyles.heroContent}>
          <h2 style={loginStyles.heroTitle}>Find Your Dream Career</h2>
          <p style={loginStyles.heroText}>
            Connect with top employers and discover opportunities that match your skills and ambitions. 
            Your next career move starts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
