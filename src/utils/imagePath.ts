export function getImagePath(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // En producción de GitHub Pages, necesitamos el prefijo /DolceCandy
  // Forzamos el prefijo si estamos en el dominio de github.io
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  const basePath = isGitHubPages ? '/DolceCandy' : '';
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
