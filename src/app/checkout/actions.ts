"use server";

import { createClient } from "@supabase/supabase-js";

export async function createOrderAndDeductInventory(orderData: any, items: any[]) {
  // Use service role key to bypass RLS for inventory update
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Insert order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Deduct inventory for each item
    for (const item of items) {
      // Fetch current inventory locations for the product
      const { data: invData, error: invError } = await supabaseAdmin
        .from('inventory')
        .select('location_id, quantity')
        .eq('product_id', item.id)
        .order('quantity', { ascending: false });

      if (invError) throw invError;

      let remainingToDeduct = item.quantity;
      if (invData && invData.length > 0) {
        for (const loc of invData) {
          if (remainingToDeduct <= 0) break;
          
          const deduction = Math.min(loc.quantity, remainingToDeduct);
          const newQty = loc.quantity - deduction;
          
          await supabaseAdmin
            .from('inventory')
            .update({ quantity: newQty })
            .eq('product_id', item.id)
            .eq('location_id', loc.location_id);
            
          remainingToDeduct -= deduction;
        }
      }
    }

    return { success: true, order };
  } catch (error: any) {
    console.error("Error creating order or deducting inventory:", error);
    return { success: false, error: error.message };
  }
}
