// Textarea Component
import React, { forwardRef } from 'react';
import '../../styles/components/Form.css';

const Textarea = forwardRef(({
  label,
  name,
  value,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  helpText,
  maxLength,
  className = '',
  onChange,
  onBlur,
  ...props
}, ref) => {
  const textareaClasses = [
    'form-textarea',
    error && 'form-textarea-error',
    className
  ].filter(Boolean).join(' ');

  const charCount = value?.length || 0;

  return (
    <div className="form-group">
      {label && (
        <label className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className={textareaClasses}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      
      {maxLength && (
        <div className="form-help" style={{ textAlign: 'right' }}>
          {charCount}/{maxLength}
        </div>
      )}
      
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
      
      {helpText && !error && !maxLength && (
        <div className="form-help">{helpText}</div>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
