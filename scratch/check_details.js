const { createClient } = require('@supabase/supabase-js');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';

const supabase = createClient(url, serviceKey);

async function checkDetails() {
  const { data: prod } = await supabase.from('products').select('id, name').eq('id', '3eb71d4e-185a-463f-b466-7f783b2b8067').single();
  const { data: inv } = await supabase.from('inventory').select('*').eq('product_id', '3eb71d4e-185a-463f-b466-7f783b2b8067');
  console.log('Product:', prod);
  console.log('Inventory:', inv);
}

checkDetails();
