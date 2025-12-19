// Select Component
import React, { forwardRef } from 'react';
import '../../styles/components/Form.css';

const Select = forwardRef(({
  label,
  name,
  value,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error,
  helpText,
  className = '',
  onChange,
  onBlur,
  ...props
}, ref) => {
  const selectClasses = [
    'form-select',
    error && 'form-select-error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      {label && (
        <label className={`form-label ${required ? 'form-label-required' : ''}`}>
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        className={selectClasses}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
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

Select.displayName = 'Select';

export default Select;
