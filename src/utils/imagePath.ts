export function getImagePath(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // En producción (GitHub Pages), NEXT_PUBLIC_BASE_PATH vendrá de la Acción de GitHub
  // En local será un string vacío.
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  
  return `${basePath}${cleanPath}`;
}
