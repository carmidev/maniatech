"use server";

import { createClient } from "@supabase/supabase-js";

export async function getProductsWithInventory() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
  );

  try {
    let allProducts: any[] = [];
    let hasMore = true;
    let page = 0;
    const limit = 1000;

    while (hasMore) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*, inventory(quantity)')
        .eq('is_archived', false)
        .gt('price', 0)
        .not('images', 'is', null)
        .order('created_at', { ascending: false })
        .range(page * limit, (page + 1) * limit - 1);

      if (error) throw error;

      if (data) {
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

    return { success: true, data: allProducts };
  } catch (error: any) {
    // Si la BD no está configurada o falla la conexión, retornar success: false silenciosamente para cargar mock data
    return { success: false, error: error?.message || 'DB disconnected' };
  }
}
