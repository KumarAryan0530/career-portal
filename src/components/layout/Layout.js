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
  mainMobile: {
    padding: '1rem 0'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem'
  },
  containerMobile: {
    padding: '0 1rem'
  }
};

// Responsive hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

const Layout = ({ children, fullWidth = false }) => {
  const isMobile = useIsMobile();
  
  return (
    <div style={layoutStyles.wrapper}>
      <Header />
      <main style={{
        ...layoutStyles.main,
        ...(isMobile ? layoutStyles.mainMobile : {})
      }}>
        {fullWidth ? (
          children || <Outlet />
        ) : (
          <div style={{
            ...layoutStyles.container,
            ...(isMobile ? layoutStyles.containerMobile : {})
          }}>
            {children || <Outlet />}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
