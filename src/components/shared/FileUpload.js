// File Upload Component with Progress
import React, { useRef, useState } from 'react';
import Spinner from './Spinner';
import '../../styles/components/Form.css';

const FileUpload = ({
  accept = '.pdf,.doc,.docx',
  maxSize = 5, // MB
  onFileSelect,
  uploading = false,
  progress = 0,
  currentFile = null,
  error,
  label = 'Upload Resume',
  helpText = 'PDF, DOC, DOCX up to 5MB'
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      alert(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      
      <div
        className={`form-file-label ${dragActive ? 'drag-active' : ''}`}
        style={{
          borderColor: dragActive ? '#C41E3A' : error ? '#D32F2F' : '#E0DADA',
          background: dragActive ? '#FFF9F9' : '#FFF5F5',
          cursor: uploading ? 'default' : 'pointer'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!uploading ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        
        {uploading ? (
          <div style={{ textAlign: 'center' }}>
            <Spinner size="lg" />
            <div style={{ marginTop: '1rem' }}>
              <div
                style={{
                  width: '200px',
                  height: '8px',
                  background: '#E0DADA',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #C41E3A 0%, #A01830 100%)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
              <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                Uploading... {progress}%
              </p>
            </div>
          </div>
        ) : currentFile ? (
          <div style={{ textAlign: 'center' }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E7D32"
              strokeWidth="2"
              style={{ marginBottom: '0.5rem' }}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <polyline points="9 15 11 17 15 13"></polyline>
            </svg>
            <p style={{ color: '#2D2D2D', fontWeight: '500' }}>{currentFile}</p>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Click to replace
            </p>
          </div>
        ) : (
          <>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#666"
              strokeWidth="1.5"
              style={{ marginBottom: '0.5rem' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <p className="form-file-text">
              <span style={{ color: '#C41E3A', fontWeight: '500' }}>Click to upload</span>
              {' '}or drag and drop
            </p>
            <p className="form-file-hint">{helpText}</p>
          </>
        )}
      </div>
      
      {error && (
        <div className="form-error-message">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
