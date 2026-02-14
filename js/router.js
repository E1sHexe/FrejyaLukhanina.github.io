/**
 * router.js — Hash-based client-side router
 * Supports routes: #home / #gallery/<name> / #contact
 */

const Router = (() => {
  const listeners = [];

  /**
   * Register a route handler.
   * @param {Function} handler - Receives { route, params }
   */
  function on(handler) {
    listeners.push(handler);
  }

  /**
   * Parse the current hash into { route, params }.
   */
  function parse() {
    const hash = location.hash.replace(/^#\/?/, '') || 'home';
    const parts = hash.split('/');
    const route = parts[0] || 'home';
    const params = parts.slice(1).map(decodeURIComponent);
    return { route, params };
  }

  /**
   * Navigate to a new hash.
   */
  function navigate(hash) {
    location.hash = hash;
  }

  /**
   * Emit the current route to all listeners.
   */
  function emit() {
    const ctx = parse();
    listeners.forEach(fn => fn(ctx));
  }

  // Listen for hash changes
  window.addEventListener('hashchange', emit);

  return { on, navigate, parse, emit };
})();
