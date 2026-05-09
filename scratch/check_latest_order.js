const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLatestOrder() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (error) {
    console.error('Error:', error);
  } else if (data && data.length > 0) {
    console.log('Latest Order:', JSON.stringify(data[0], null, 2));
  } else {
    console.log('No orders found.');
  }
}

checkLatestOrder();
