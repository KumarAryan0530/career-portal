// Modal Component
import React, { useEffect, useCallback } from 'react';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s ease-out'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #E0DADA',
    background: 'linear-gradient(180deg, #fff 0%, #F9F9F9 100%)'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2D2D2D',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    color: '#666',
    borderRadius: '8px',
    transition: 'all 0.2s'
  },
  body: {
    padding: '1.5rem',
    overflowY: 'auto',
    flex: 1
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #E0DADA',
    background: '#FFF5F5'
  }
};

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const sizes = {
    sm: '400px',
    md: '600px',
    lg: '800px',
    xl: '1000px'
  };

  return (
    <div
      style={modalStyles.overlay}
      onClick={closeOnOverlay ? onClose : undefined}
    >
      <div
        style={{ ...modalStyles.modal, maxWidth: sizes[size] || sizes.md }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={modalStyles.header}>
          <h3 style={modalStyles.title}>{title}</h3>
          <button
            style={modalStyles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div style={modalStyles.body}>
          {children}
        </div>
        
        {footer && (
          <div style={modalStyles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
