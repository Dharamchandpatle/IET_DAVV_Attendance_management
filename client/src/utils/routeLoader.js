import React from 'react';

// Use Vite's import.meta.glob to build a map of available page modules.
// This avoids dynamic-import restrictions and supports nested folders.
const modules = import.meta.glob('../pages/**/*.jsx');

export function lazyLoad(name) {
  const path = `../pages/${name}.jsx`;
  const importer = modules[path];
  if (!importer) {
    throw new Error(`Unknown page import: ${path}`);
  }
  // importer is a function that returns a promise resolving the module
  return React.lazy(() => importer());
}

export default lazyLoad;
