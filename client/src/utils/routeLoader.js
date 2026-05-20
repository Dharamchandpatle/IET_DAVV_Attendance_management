import { lazy } from 'react';

// Map of page modules for lazy loading.
const pages = import.meta.glob('../pages/**/*.jsx');

// Resolves a page component by name for route-based lazy loading.
export const lazyLoad = (componentPath) => {
  const normalized = componentPath.endsWith('.jsx') ? componentPath : `${componentPath}.jsx`;
  const exportName = normalized.split('/').pop().replace('.jsx', '');
  const importer = pages[`../pages/${normalized}`];

  if (!importer) {
    throw new Error(`Unknown page: ${componentPath}`);
  }

  return lazy(() =>
    importer().then((module) => ({
      default: module[exportName] || module.default
    }))
  );
};