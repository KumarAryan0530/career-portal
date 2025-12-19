// Badge Component
import React from 'react';
import '../../styles/components/Badge.css';

const Badge = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
};

export const Tag = ({
  children,
  variant = 'default',
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`tag ${variant !== 'default' ? `tag-${variant}` : ''} ${removable ? 'tag-removable' : ''} ${className}`}
      {...props}
    >
      {children}
      {removable && (
        <button type="button" className="tag-remove" onClick={onRemove}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </span>
  );
};

export const Status = ({
  status,
  className = '',
  ...props
}) => {
  const statusConfig = {
    pending: { label: 'Pending', class: 'status-pending' },
    reviewing: { label: 'Reviewing', class: 'status-reviewing' },
    interview: { label: 'Interview', class: 'status-interview' },
    offered: { label: 'Offered', class: 'status-offered' },
    hired: { label: 'Hired', class: 'status-hired' },
    rejected: { label: 'Rejected', class: 'status-rejected' },
    active: { label: 'Active', class: 'status-active' },
    closed: { label: 'Closed', class: 'status-closed' }
  };

  const config = statusConfig[status] || { label: status, class: 'status-neutral' };

  return (
    <span className={`status ${config.class} ${className}`} {...props}>
      <span className={`status-dot status-dot-${status === 'pending' ? 'warning' : status === 'active' || status === 'hired' || status === 'offered' ? 'success' : status === 'rejected' ? 'error' : 'info'}`} />
      {config.label}
    </span>
  );
};

export const JobType = ({
  type,
  className = '',
  ...props
}) => {
  const typeConfig = {
    'full-time': { label: 'Full-time', class: 'job-type-fulltime' },
    'part-time': { label: 'Part-time', class: 'job-type-parttime' },
    'contract': { label: 'Contract', class: 'job-type-contract' },
    'remote': { label: 'Remote', class: 'job-type-remote' },
    'internship': { label: 'Internship', class: 'job-type-internship' }
  };

  const config = typeConfig[type] || { label: type, class: '' };

  return (
    <span className={`job-type ${config.class} ${className}`} {...props}>
      {config.label}
    </span>
  );
};

export default Badge;
