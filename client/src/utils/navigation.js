import gsap from 'gsap';

// Cache for preloaded routes
const preloadedRoutes = new Set();

// Preload a route to make subsequent navigation faster
export const preloadRoute = async (route) => {
  if (preloadedRoutes.has(route)) return;
  
  try {
    // Add route to cache before starting preload
    preloadedRoutes.add(route);
    
    // In a real app, this would prefetch the route data
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.error('Failed to preload route:', error);
    // Remove from cache if preload failed
    preloadedRoutes.delete(route);
  }
};

// Smooth navigation with transitions
export const navigateWithTransition = async (navigate, to, options = {}) => {
  const {
    duration = 0.3,
    fadeOut = true,
    type = 'fade'
  } = options;

  // Start exit animation
  if (fadeOut) {
    await gsap.to('.dashboard-content', {
      opacity: 0,
      y: 20,
      duration: duration,
      ease: 'power2.inOut'
    });
  }

  // Navigate to new route
  navigate(to);

  // Entrance animation will be handled by the mounted component
  // But we can preload the next route data
  preloadRoute(to);
};

// Handle back/forward navigation
export const handlePopState = (event) => {
  // Smooth transition for browser back/forward
  gsap.to('.dashboard-content', {
    opacity: 0,
    y: 20,
    duration: 0.2,
    ease: 'power2.inOut',
    onComplete: () => {
      gsap.to('.dashboard-content', {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: 0.1
      });
    }
  });
};

// Add popstate listener
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', handlePopState);
}

// Clean up function to remove listener
export const cleanup = () => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', handlePopState);
  }
};

// Helper to preload routes
export const preloadRouteOld = (routePath) => {
  const routeName = routePath.split('/')[1] || 'LandingPage';
  const capitalized = routeName.charAt(0).toUpperCase() + routeName.slice(1);
  
  // Preload the chunk
  import(`../pages/${capitalized}.jsx`).catch(console.error);
};

export const roleBasedRedirect = (role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'faculty':
      return '/faculty';
    case 'student':
      return '/student';
    default:
      return '/';
  }
};
