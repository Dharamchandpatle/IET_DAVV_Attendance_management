import gsap from 'gsap';

export const navigateWithTransition = async (navigate, path, options = {}) => {
  const {
    duration = 0.3,
    onBeforeNavigate,
    onAfterNavigate
  } = options;

  // Pre-load the target route module
  const routeName = path.split('/')[1] || 'LandingPage';
  const capitalized = routeName.charAt(0).toUpperCase() + routeName.slice(1);
  
  try {
    // Optional callback before navigation
    if (onBeforeNavigate) {
      await onBeforeNavigate();
    }

    // Fade out current page
    await gsap.to('.page-content', {
      opacity: 0,
      y: -20,
      duration: duration / 2,
      ease: 'power2.inOut'
    });

    // Navigate to new route
    navigate(path);

    // Fade in new page
    gsap.fromTo('.page-content',
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: duration / 2,
        delay: 0.1,
        ease: 'power2.out',
        clearProps: 'all'
      }
    );

    // Optional callback after navigation
    if (onAfterNavigate) {
      onAfterNavigate();
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

// Helper to preload pages on hover/interaction
export const preloadRoute = (routePath) => {
  const routeName = routePath.split('/')[1] || 'LandingPage';
  const capitalized = routeName.charAt(0).toUpperCase() + routeName.slice(1);
  
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
