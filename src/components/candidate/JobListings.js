// Job Listings Page for Candidates
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '../../hooks/useJobs';
import { Button, Input, Select, Tag, JobType, Spinner, EmptyState } from '../shared';
import { format } from 'date-fns';

const jobListStyles = {
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
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  searchInput: {
    flex: 2,
    minWidth: '250px'
  },
  filterSelect: {
    flex: 1,
    minWidth: '150px'
  },
  resultsInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  resultsCount: {
    color: '#666'
  },
  sortSelect: {
    width: '200px'
  },
  jobsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  jobCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderLeft: '4px solid #C41E3A',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  jobCardHover: {
    transform: 'translateX(4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
  },
  jobHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  jobTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2D2D2D',
    marginBottom: '0.25rem'
  },
  jobCompany: {
    color: '#C41E3A',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  jobMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
    color: '#666',
    fontSize: '0.9rem'
  },
  jobMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem'
  },
  jobDescription: {
    color: '#666',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    marginBottom: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  jobSkills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  jobFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #E0DADA'
  },
  jobDate: {
    color: '#999',
    fontSize: '0.85rem'
  }
};

const JobListings = () => {
  const { jobs, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    experience: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [hoveredJob, setHoveredJob] = useState(null);

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'remote', label: 'Remote' },
    { value: 'internship', label: 'Internship' }
  ];

  const experienceOptions = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'lead', label: 'Lead/Manager' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'salary-high', label: 'Highest Salary' },
    { value: 'salary-low', label: 'Lowest Salary' }
  ];

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(job =>
        job.title?.toLowerCase().includes(search) ||
        job.company?.toLowerCase().includes(search) ||
        job.description?.toLowerCase().includes(search) ||
        job.skills?.some(skill => skill.toLowerCase().includes(search))
      );
    }

    // Type filter
    if (filters.type) {
      result = result.filter(job => job.type === filters.type);
    }

    // Location filter
    if (filters.location) {
      result = result.filter(job =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Experience filter
    if (filters.experience) {
      result = result.filter(job => job.experience === filters.experience);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'salary-high':
          return (b.salaryMax || 0) - (a.salaryMax || 0);
        case 'salary-low':
          return (a.salaryMin || 0) - (b.salaryMin || 0);
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [jobs, searchTerm, filters, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({ type: '', location: '', experience: '' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div style={jobListStyles.header}>
        <h1 style={jobListStyles.title}>Browse Jobs</h1>
        <p style={jobListStyles.subtitle}>
          Find your next opportunity from {jobs.length} available positions
        </p>
      </div>

      {/* Filters */}
      <div style={jobListStyles.filters}>
        <div style={jobListStyles.searchInput}>
          <Input
            placeholder="Search jobs, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            }
          />
        </div>
        <div style={jobListStyles.filterSelect}>
          <Select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            options={jobTypeOptions}
            placeholder="Job Type"
          />
        </div>
        <div style={jobListStyles.filterSelect}>
          <Select
            name="experience"
            value={filters.experience}
            onChange={handleFilterChange}
            options={experienceOptions}
            placeholder="Experience"
          />
        </div>
        <Button variant="ghost" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Results Info */}
      <div style={jobListStyles.resultsInfo}>
        <span style={jobListStyles.resultsCount}>
          Showing {filteredJobs.length} of {jobs.length} jobs
        </span>
        <div style={jobListStyles.sortSelect}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
            placeholder="Sort by"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          }
          title="No jobs found"
          description="Try adjusting your search or filters to find what you're looking for"
          action={true}
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div style={jobListStyles.jobsGrid}>
          {filteredJobs.map(job => (
            <Link
              to={`/candidate/jobs/${job.id}`}
              key={job.id}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  ...jobListStyles.jobCard,
                  ...(hoveredJob === job.id ? jobListStyles.jobCardHover : {})
                }}
                onMouseEnter={() => setHoveredJob(job.id)}
                onMouseLeave={() => setHoveredJob(null)}
              >
                <div style={jobListStyles.jobHeader}>
                  <div>
                    <h3 style={jobListStyles.jobTitle}>{job.title}</h3>
                    <div style={jobListStyles.jobCompany}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
                      </svg>
                      {job.company}
                    </div>
                  </div>
                  <JobType type={job.type} />
                </div>

                <div style={jobListStyles.jobMeta}>
                  <span style={jobListStyles.jobMetaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {job.location}
                  </span>
                  <span style={jobListStyles.jobMetaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    {job.salary}
                  </span>
                  <span style={jobListStyles.jobMetaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    {job.applicantCount || 0} applicants
                  </span>
                </div>

                <p style={jobListStyles.jobDescription}>{job.description}</p>

                {job.skills && job.skills.length > 0 && (
                  <div style={jobListStyles.jobSkills}>
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <Tag key={index}>{skill}</Tag>
                    ))}
                    {job.skills.length > 5 && (
                      <Tag>+{job.skills.length - 5} more</Tag>
                    )}
                  </div>
                )}

                <div style={jobListStyles.jobFooter}>
                  <span style={jobListStyles.jobDate}>
                    Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                  </span>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
