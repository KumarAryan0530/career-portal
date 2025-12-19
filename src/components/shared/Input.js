// Input Component with Skeuomorphic Design
import React, { forwardRef } from 'react';
import '../../styles/components/Form.css';

const Input = forwardRef(({
  label,
  type = 'text',
  name,
  value,
  placeholder,
  required = false,
  disabled = false,
  error,
  success,
  helpText,
  icon,
  actionIcon,
  onAction,
  className = '',
  onChange,
  onBlur,
  ...props
}, ref) => {
  const inputClasses = [
    'form-input',
    error && 'form-input-error',
    success && 'form-input-success',
    className
  ].filter(Boolean).join(' ');

  const inputElement = (
    <input
      ref={ref}
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={inputClasses}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
    />
  );

  return (
    <div className="form-group">
      {label && (
        <label className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
        </label>
      )}
      
      {icon || actionIcon ? (
        <div className="form-input-wrapper">
          {icon && <span className="form-input-icon">{icon}</span>}
          {inputElement}
          {actionIcon && (
            <button
              type="button"
              className="form-input-action"
              onClick={onAction}
              tabIndex={-1}
            >
              {actionIcon}
            </button>
          )}
        </div>
      ) : inputElement}
      
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
      
      {helpText && !error && (
        <div className="form-help">{helpText}</div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
