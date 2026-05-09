const { createClient } = require('@supabase/supabase-js');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';

const supabase = createClient(url, apikey);

async function check() {
  const { data, error } = await supabase.from('products').select('*, inventory(quantity)').limit(3);
  console.log('Data:', JSON.stringify(data, null, 2));
  if (error) console.error('Error:', error);
}

check();
