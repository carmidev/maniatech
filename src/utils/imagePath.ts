export function getImagePath(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // Support GitHub Pages basePath
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${cleanPath}`;
}
