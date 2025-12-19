// Button Component with Skeuomorphic Design
import React from 'react';
import '../../styles/components/Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    fullWidth && 'btn-full',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="icon">{icon}</span>}
    </button>
  );
};

export default Button;
