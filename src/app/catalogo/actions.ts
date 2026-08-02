"use server";

import { createClient } from "@supabase/supabase-js";

export async function getProductsWithInventory() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si no hay credenciales válidas de Supabase, retornar inmediatamente sin esperar timeout de DNS
  if (!url || !key || url.includes('placeholder') || key === 'placeholder') {
    return { success: false, error: 'DB disconnected' };
  }

  const supabaseAdmin = createClient(url, key);

  try {
    let allProducts: any[] = [];
    let hasMore = true;
    let page = 0;
    const limit = 200; // Reducido a 200 para carga ultra rápida

    const fetchPromise = (async () => {
      while (hasMore && page < 5) { // Límite de seguridad
        const { data, error } = await supabaseAdmin
          .from('products')
          .select('*, inventory(quantity)')
          .eq('is_archived', false)
          .gt('price', 0)
          .not('images', 'is', null)
          .order('created_at', { ascending: false })
          .range(page * limit, (page + 1) * limit - 1);

        if (error) throw error;

        if (data && data.length > 0) {
          allProducts = [...allProducts, ...data];
          if (data.length < limit) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      }
      return allProducts;
    })();

    // Timeout de 2.5 segundos máximo para evitar bloquear la navegación
    const timeoutPromise = new Promise<any[]>((_, reject) =>
      setTimeout(() => reject(new Error('DB Timeout')), 2500)
    );

    const data = await Promise.race([fetchPromise, timeoutPromise]);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error?.message || 'DB error' };
  }
}
