// Card Component with Skeuomorphic Design
import React from 'react';
import '../../styles/components/Card.css';

const Card = ({
  children,
  variant = 'default',
  clickable = false,
  className = '',
  onClick,
  ...props
}) => {
  const classes = [
    'card',
    variant !== 'default' && `card-${variant}`,
    clickable && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', actions }) => (
  <div className={`card-header ${className}`}>
    <div className="card-header-content">
      {children}
    </div>
    {actions && <div className="card-header-actions">{actions}</div>}
  </div>
);

const CardBody = ({ children, compact = false, className = '' }) => (
  <div className={`card-body ${compact ? 'card-body-compact' : ''} ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
