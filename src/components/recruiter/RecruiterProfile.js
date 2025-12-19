// Recruiter Profile - Company and settings
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Textarea, Spinner } from '../shared';
import toast from 'react-hot-toast';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  header: {
    marginBottom: '2rem'
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
  profileHeader: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    marginBottom: '1.5rem'
  },
  coverArea: {
    height: '120px',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    position: 'relative'
  },
  logoArea: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0 2rem 1.5rem',
    marginTop: '-40px',
    position: 'relative'
  },
  companyLogo: {
    width: '100px',
    height: '100px',
    borderRadius: '16px',
    background: '#fff',
    border: '4px solid #fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#C41E3A',
    flexShrink: 0
  },
  headerInfo: {
    flex: 1,
    marginLeft: '1.5rem',
    paddingTop: '50px'
  },
  companyName: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  companyMeta: {
    color: '#666',
    fontSize: '0.9rem'
  },
  section: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '1.5rem',
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
    padding: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  infoLabel: {
    fontSize: '0.8rem',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.375rem'
  },
  infoValue: {
    color: '#2D2D2D',
    fontWeight: '500'
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid #E0DADA',
    marginTop: '1rem'
  },
  linkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    background: '#F9F9F9',
    borderRadius: '8px',
    marginBottom: '0.5rem'
  },
  linkIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FFF5F5',
    color: '#C41E3A'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem'
  },
  statCard: {
    textAlign: 'center',
    padding: '1.25rem',
    background: '#F9F9F9',
    borderRadius: '12px'
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#C41E3A'
  },
  statLabel: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '0.25rem'
  }
};

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '501-1000', label: '501-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Media',
  'Consulting',
  'Non-profit',
  'Other'
];

const RecruiterProfile = () => {
  const { userProfile, updateUserProfile, currentUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: '',
    location: '',
    description: '',
    linkedIn: '',
    twitter: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        companyName: userProfile.companyName || '',
        companyWebsite: userProfile.companyWebsite || '',
        companySize: userProfile.companySize || '',
        industry: userProfile.industry || '',
        location: userProfile.location || '',
        description: userProfile.description || '',
        linkedIn: userProfile.linkedIn || '',
        twitter: userProfile.twitter || ''
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: userProfile?.fullName || '',
      companyName: userProfile?.companyName || '',
      companyWebsite: userProfile?.companyWebsite || '',
      companySize: userProfile?.companySize || '',
      industry: userProfile?.industry || '',
      location: userProfile?.location || '',
      description: userProfile?.description || '',
      linkedIn: userProfile?.linkedIn || '',
      twitter: userProfile?.twitter || ''
    });
    setEditing(false);
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Mock stats - in real app, fetch from Firestore
  const stats = {
    activeJobs: 5,
    totalApplicants: 128,
    hired: 12,
    avgTimeToHire: '18 days'
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Company Profile</h1>
        <p style={styles.subtitle}>Manage your company information and settings</p>
      </div>

      {/* Profile Header Card */}
      <div style={styles.profileHeader}>
        <div style={styles.coverArea} />
        <div style={styles.logoArea}>
          <div style={styles.companyLogo}>
            {getInitials(formData.companyName)}
          </div>
          <div style={styles.headerInfo}>
            <h2 style={styles.companyName}>
              {formData.companyName || 'Your Company'}
            </h2>
            <p style={styles.companyMeta}>
              {formData.industry || 'Industry'} • {formData.location || 'Location'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Recruitment Stats</h3>
        </div>
        <div style={styles.sectionBody}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.activeJobs}</div>
              <div style={styles.statLabel}>Active Jobs</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.totalApplicants}</div>
              <div style={styles.statLabel}>Total Applicants</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.hired}</div>
              <div style={styles.statLabel}>Hired</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{stats.avgTimeToHire}</div>
              <div style={styles.statLabel}>Avg. Time to Hire</div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Company Information</h3>
          {!editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>
        <div style={styles.sectionBody}>
          {editing ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <Input
                  label="Your Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Company name"
                />
              </div>
              <div style={styles.row}>
                <Input
                  label="Company Website"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://company.com"
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
              <div style={styles.row}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2D2D2D' }}>
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #E0DADA',
                      fontSize: '1rem',
                      background: '#fff'
                    }}
                  >
                    <option value="">Select size</option>
                    {companySizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2D2D2D' }}>
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #E0DADA',
                      fontSize: '1rem',
                      background: '#fff'
                    }}
                  >
                    <option value="">Select industry</option>
                    {industries.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Textarea
                label="Company Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell candidates about your company culture, mission, and what makes you unique..."
                rows={4}
              />
              <div style={styles.row}>
                <Input
                  label="LinkedIn"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/..."
                />
                <Input
                  label="Twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="@companyhandle"
                />
              </div>
              <div style={styles.actions}>
                <Button type="button" variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : 'Save Changes'}
                </Button>
              </div>
            </form>
          ) : (
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Contact Name</span>
                <span style={styles.infoValue}>{formData.fullName || 'Not provided'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Company Name</span>
                <span style={styles.infoValue}>{formData.companyName || 'Not provided'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Website</span>
                <span style={styles.infoValue}>
                  {formData.companyWebsite ? (
                    <a href={formData.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ color: '#C41E3A' }}>
                      {formData.companyWebsite}
                    </a>
                  ) : 'Not provided'}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Location</span>
                <span style={styles.infoValue}>{formData.location || 'Not provided'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Company Size</span>
                <span style={styles.infoValue}>
                  {companySizes.find(s => s.value === formData.companySize)?.label || 'Not provided'}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Industry</span>
                <span style={styles.infoValue}>{formData.industry || 'Not provided'}</span>
              </div>
              <div style={{ ...styles.infoItem, gridColumn: '1 / -1' }}>
                <span style={styles.infoLabel}>Description</span>
                <span style={styles.infoValue}>{formData.description || 'Not provided'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Social Links */}
      {!editing && (formData.linkedIn || formData.twitter) && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>Social Links</h3>
          </div>
          <div style={styles.sectionBody}>
            {formData.linkedIn && (
              <a 
                href={formData.linkedIn} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ ...styles.linkItem, textDecoration: 'none', color: 'inherit' }}
              >
                <div style={styles.linkIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>LinkedIn</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{formData.linkedIn}</div>
                </div>
              </a>
            )}
            {formData.twitter && (
              <a 
                href={`https://twitter.com/${formData.twitter.replace('@', '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                style={{ ...styles.linkItem, textDecoration: 'none', color: 'inherit' }}
              >
                <div style={styles.linkIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>Twitter</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{formData.twitter}</div>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Account Info */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Account Information</h3>
        </div>
        <div style={styles.sectionBody}>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>{currentUser?.email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Account Type</span>
              <span style={styles.infoValue}>Recruiter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfile;
