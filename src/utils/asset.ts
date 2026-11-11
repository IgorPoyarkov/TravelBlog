const BASE = import.meta.env.BASE_URL;

/**
 * Resolves a public/ asset path against Vite's base, so assets keep working
 * when the app is served from a subpath (e.g. GitHub Pages /TravelBlog/).
 */
export function asset(path: string): string {
  return `${BASE}${path.replace(/^\//, "")}`;
}