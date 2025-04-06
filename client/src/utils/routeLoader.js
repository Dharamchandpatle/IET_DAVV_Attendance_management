import { lazy } from 'react';

export const lazyLoad = (componentPath) => {
  const Component = lazy(() => 
    import(`../pages/${componentPath}`).then(module => ({
      default: module[componentPath.split('/').pop().replace('.jsx', '')] || module.default
    }))
  );

  return Component;
};

// Pre-fetch critical routes
export const prefetchRoutes = () => {
  const criticalRoutes = [
    'Login',
    'Register',
    'StudentDashboard',
    'FacultyDashboard',
    'AdminDashboard'
  ];

  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `/static/js/${route.toLowerCase()}.chunk.js`;
    link.as = 'script';
    document.head.appendChild(link);
  });
};