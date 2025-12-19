// Empty State Component
import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionLabel,
  onAction
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        border: '2px dashed #E0DADA'
      }}
    >
      {icon && (
        <div
          style={{
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFF5F5',
            borderRadius: '50%',
            marginBottom: '1.5rem',
            color: '#C41E3A'
          }}
        >
          {icon}
        </div>
      )}
      
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2D2D2D',
          marginBottom: '0.5rem'
        }}
      >
        {title}
      </h3>
      
      {description && (
        <p
          style={{
            color: '#666',
            maxWidth: '400px',
            marginBottom: action ? '1.5rem' : 0
          }}
        >
          {description}
        </p>
      )}
      
      {action && actionLabel && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};

export default EmptyState;
