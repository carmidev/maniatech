const { createClient } = require('@supabase/supabase-js');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';

const supabase = createClient(url, serviceKey);

async function checkOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, items, created_at')
    .order('created_at', { ascending: false })
    .limit(3);

  console.log('Latest Orders:', JSON.stringify(data, null, 2));
}

checkOrders();
