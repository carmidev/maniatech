const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function checkProducts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('products')
    .select('id, name, images');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Products:', JSON.stringify(data, null, 2));
}

checkProducts();
