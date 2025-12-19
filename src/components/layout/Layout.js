// Main Layout Component
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const layoutStyles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    flex: 1,
    padding: '2rem 0'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem'
  }
};

const Layout = ({ children, fullWidth = false }) => {
  return (
    <div style={layoutStyles.wrapper}>
      <Header />
      <main style={layoutStyles.main}>
        {fullWidth ? (
          children || <Outlet />
        ) : (
          <div style={layoutStyles.container}>
            {children || <Outlet />}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
