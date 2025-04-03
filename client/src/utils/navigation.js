import gsap from 'gsap';

export const navigateWithTransition = (navigate, path) => {
  gsap.to('.page-content', {
    opacity: 0,
    y: -20,
    duration: 0.2,
    onComplete: () => {
      navigate(path);
    }
  });
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
