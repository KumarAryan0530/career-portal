// Candidate Profile Page
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useResumeUpload } from '../../hooks/useResumeUpload';
import { Button, Input, Textarea, FileUpload, Tag, Spinner } from '../shared';
import toast from 'react-hot-toast';

const profileStyles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '300px 1fr',
    gap: '2rem',
    alignItems: 'start'
  },
  sidebar: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    padding: '2rem',
    textAlign: 'center',
    position: 'sticky',
    top: '90px'
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    color: '#fff',
    fontSize: '3rem',
    fontWeight: '600',
    boxShadow: '0 8px 24px rgba(196, 30, 58, 0.3)'
  },
  name: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.5rem'
  },
  email: {
    color: '#666',
    marginBottom: '1rem'
  },
  badge: {
    display: 'inline-block',
    padding: '0.35rem 1rem',
    background: '#FFF5F5',
    color: '#C41E3A',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  divider: {
    height: '1px',
    background: '#E0DADA',
    margin: '1.5rem 0'
  },
  sidebarInfo: {
    textAlign: 'left'
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
    color: '#666',
    fontSize: '0.95rem'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden'
  },
  cardHeader: {
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #E0DADA',
    background: 'linear-gradient(180deg, #FFF5F5 0%, #fff 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2D2D2D',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  cardBody: {
    padding: '2rem'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem'
  },
  formFull: {
    gridColumn: 'span 2'
  },
  skillsInput: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  resumeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#FFF5F5',
    borderRadius: '12px',
    border: '1px solid #E0DADA'
  },
  resumeIcon: {
    width: '48px',
    height: '48px',
    background: '#C41E3A',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff'
  },
  resumeInfo: {
    flex: 1
  },
  resumeName: {
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  resumeDate: {
    fontSize: '0.85rem',
    color: '#666'
  }
};

const CandidateProfile = () => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { uploadResume, uploading, progress } = useResumeUpload();
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState({
    personal: false,
    professional: false,
    resume: false
  });
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    bio: '',
    title: '',
    experience: '',
    education: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        linkedIn: userProfile.linkedIn || '',
        portfolio: userProfile.portfolio || '',
        bio: userProfile.bio || '',
        title: userProfile.title || '',
        experience: userProfile.experience || '',
        education: userProfile.education || '',
        skills: userProfile.skills || []
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSaveSection = async (section) => {
    setSaving(true);
    try {
      await updateUserProfile(formData);
      setEditMode(prev => ({ ...prev, [section]: false }));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file) => {
    try {
      await uploadResume(file);
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={profileStyles.container}>
      {/* Sidebar */}
      <div style={profileStyles.sidebar}>
        <div style={profileStyles.avatar}>
          {getInitials(userProfile?.fullName)}
        </div>
        <h2 style={profileStyles.name}>{userProfile?.fullName || 'User'}</h2>
        <p style={profileStyles.email}>{currentUser?.email}</p>
        <span style={profileStyles.badge}>Candidate</span>

        <div style={profileStyles.divider} />

        <div style={profileStyles.sidebarInfo}>
          {userProfile?.title && (
            <div style={profileStyles.infoItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              {userProfile.title}
            </div>
          )}
          {userProfile?.location && (
            <div style={profileStyles.infoItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {userProfile.location}
            </div>
          )}
          {userProfile?.phone && (
            <div style={profileStyles.infoItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              {userProfile.phone}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={profileStyles.mainContent}>
        {/* Personal Information */}
        <div style={profileStyles.card}>
          <div style={profileStyles.cardHeader}>
            <h3 style={profileStyles.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Personal Information
            </h3>
            {!editMode.personal ? (
              <Button variant="ghost" size="sm" onClick={() => setEditMode(prev => ({ ...prev, personal: true }))}>
                Edit
              </Button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="ghost" size="sm" onClick={() => setEditMode(prev => ({ ...prev, personal: false }))}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleSaveSection('personal')} loading={saving}>
                  Save
                </Button>
              </div>
            )}
          </div>
          <div style={profileStyles.cardBody}>
            <div style={profileStyles.formGrid}>
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!editMode.personal}
              />
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode.personal}
              />
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                disabled={!editMode.personal}
              />
              <Input
                label="LinkedIn Profile"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                disabled={!editMode.personal}
              />
              <div style={profileStyles.formFull}>
                <Input
                  label="Portfolio Website"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                  disabled={!editMode.personal}
                />
              </div>
              <div style={profileStyles.formFull}>
                <Textarea
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  disabled={!editMode.personal}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div style={profileStyles.card}>
          <div style={profileStyles.cardHeader}>
            <h3 style={profileStyles.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Professional Information
            </h3>
            {!editMode.professional ? (
              <Button variant="ghost" size="sm" onClick={() => setEditMode(prev => ({ ...prev, professional: true }))}>
                Edit
              </Button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="ghost" size="sm" onClick={() => setEditMode(prev => ({ ...prev, professional: false }))}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => handleSaveSection('professional')} loading={saving}>
                  Save
                </Button>
              </div>
            )}
          </div>
          <div style={profileStyles.cardBody}>
            <div style={profileStyles.formGrid}>
              <Input
                label="Job Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                disabled={!editMode.professional}
              />
              <Input
                label="Years of Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 5 years"
                disabled={!editMode.professional}
              />
              <div style={profileStyles.formFull}>
                <Textarea
                  label="Education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Your educational background..."
                  rows={3}
                  disabled={!editMode.professional}
                />
              </div>
              <div style={profileStyles.formFull}>
                <label className="form-label">Skills</label>
                {editMode.professional && (
                  <div style={profileStyles.skillsInput}>
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button onClick={handleAddSkill}>Add</Button>
                  </div>
                )}
                <div style={profileStyles.skillsList}>
                  {formData.skills.map((skill, index) => (
                    <Tag
                      key={index}
                      removable={editMode.professional}
                      onRemove={() => handleRemoveSkill(skill)}
                    >
                      {skill}
                    </Tag>
                  ))}
                  {formData.skills.length === 0 && (
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>No skills added yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume */}
        <div style={profileStyles.card}>
          <div style={profileStyles.cardHeader}>
            <h3 style={profileStyles.cardTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C41E3A" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Resume
            </h3>
          </div>
          <div style={profileStyles.cardBody}>
            {userProfile?.resumeUrl ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={profileStyles.resumeCard}>
                  <div style={profileStyles.resumeIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div style={profileStyles.resumeInfo}>
                    <div style={profileStyles.resumeName}>{userProfile.resumeName || 'Resume'}</div>
                    <div style={profileStyles.resumeDate}>
                      Last updated: {userProfile.updatedAt ? new Date(userProfile.updatedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <a href={userProfile.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm">View</Button>
                  </a>
                </div>
              </div>
            ) : null}

            <FileUpload
              label={userProfile?.resumeUrl ? 'Upload New Resume' : 'Upload Resume'}
              onFileSelect={handleResumeUpload}
              uploading={uploading}
              progress={progress}
              helpText="PDF, DOC, DOCX up to 5MB"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
