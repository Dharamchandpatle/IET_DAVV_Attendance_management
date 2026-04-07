import { lazy } from 'react';

const pages = import.meta.glob('../pages/**/*.jsx');

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