export function getImagePath(path: string | undefined): string | undefined {
  if (!path) return undefined;
  
  if (path.includes('/api/proxy/supabase')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oroqqrrdhqzaftqsuopt.supabase.co';
    path = path.replace(/https?:\/\/localhost:\d+\/api\/proxy\/supabase/g, supabaseUrl);
    path = path.replace(/^\/api\/proxy\/supabase/g, supabaseUrl);
  }
  
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  // En producción (GitHub Pages), NEXT_PUBLIC_BASE_PATH vendrá de la Acción de GitHub
  // En local será un string vacío.
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  
  return `${basePath}${cleanPath}`;
}
