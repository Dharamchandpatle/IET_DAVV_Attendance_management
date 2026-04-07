import { lazy } from 'react';

export const lazyLoad = (componentPath) => {
  const exportName = componentPath.split('/').pop().replace('.jsx', '');
  const Component = lazy(() => 
    import(`../pages/${componentPath}`).then(module => ({
      default: module[exportName] || module.default
    }))
  );

  return Component;
};