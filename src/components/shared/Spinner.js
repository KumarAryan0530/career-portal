// Loading Spinner Component
import React from 'react';

const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    sm: 20,
    md: 32,
    lg: 48,
    xl: 64
  };

  const colors = {
    primary: '#C41E3A',
    white: '#FFFFFF',
    gray: '#666666'
  };

  const sizeValue = sizes[size] || size;
  const colorValue = colors[color] || color;

  return (
    <svg
      className={className}
      width={sizeValue}
      height={sizeValue}
      viewBox="0 0 38 38"
      xmlns="http://www.w3.org/2000/svg"
      stroke={colorValue}
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="3">
          <circle strokeOpacity=".25" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 18 18"
              to="360 18 18"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </g>
    </svg>
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
  >
    <Spinner size="xl" />
    <p style={{ marginTop: '1rem', color: '#666', fontSize: '1rem' }}>{message}</p>
  </div>
);

export const LoadingCard = () => (
  <div
    style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px'
    }}
  >
    <Spinner size="lg" />
    <p style={{ marginTop: '1rem', color: '#666' }}>Loading...</p>
  </div>
);

export default Spinner;
