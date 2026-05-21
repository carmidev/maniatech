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
      .eq('is_archived', false);

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message };
  }
}
