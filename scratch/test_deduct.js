const { createClient } = require('@supabase/supabase-js');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';

const supabase = createClient(url, serviceKey);

async function testDeduct() {
  const productId = '76b999fa-7d3c-43fb-bd8c-e65b851ee81b'; // Prueba de pistola
  
  const { data: invData, error: invError } = await supabase
    .from('inventory')
    .select('location_id, quantity')
    .eq('product_id', productId);

  console.log('Current Inventory:', invData);

  if (invData && invData.length > 0) {
    const loc = invData[0];
    const newQty = loc.quantity - 1;
    
    console.log(`Updating ${productId} at ${loc.location_id} to ${newQty}...`);
    
    const { data, error } = await supabase
      .from('inventory')
      .update({ quantity: newQty })
      .eq('product_id', productId)
      .eq('location_id', loc.location_id)
      .select();
      
    console.log('Update result:', data);
    if (error) console.error('Update error:', error);
  }
}

testDeduct();
