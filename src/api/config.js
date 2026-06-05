// Central API base URL — change VITE_API_URL in .env to point to Render on production
const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const API_BASE = base.endsWith('/') ? base.slice(0, -1) : base;
