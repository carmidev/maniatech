export function getImagePath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // Support GitHub Pages basePath
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  
  if (path.startsWith("/")) {
    return `${basePath}${path}`;
  }
  return `${basePath}/${path}`;
}
