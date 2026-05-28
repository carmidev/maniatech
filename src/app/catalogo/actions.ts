"use server";

import { createClient } from "@supabase/supabase-js";

export async function getProductsWithInventory() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, inventory(quantity)')
      .eq('is_archived', false)
      .gt('price', 0)
      .not('images', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filtro estricto: Solo productos que tengan TODOS los campos (menos reseña) y foto real
    const validData = data.filter(p => 
      p.name && p.name.trim() !== '' &&
      p.sku && p.sku.trim() !== '' &&
      p.description && p.description.trim() !== '' &&
      p.category && Array.isArray(p.category) && p.category.length > 0 &&
      p.images && 
      p.images.length > 0 && 
      !p.images[0].includes('placehold.co') &&
      !p.images[0].includes('predeterminada')
    );

    return { success: true, data: validData };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message };
  }
}
