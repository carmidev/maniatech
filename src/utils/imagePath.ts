export function getImagePath(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // Detectamos si estamos en desarrollo local
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' || 
     window.location.port !== '');

  // Si no es local, forzamos el prefijo del repositorio de GitHub Pages
  const prefix = isLocal ? "" : "/DolceCandy";
  
  return `${prefix}${cleanPath}`;
}
