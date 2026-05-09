const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oroqqrrdhqzaftqsuopt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w'
);

async function listFunctions() {
  const { data, error } = await supabase.rpc('get_functions_metadata');
  if (error) {
    console.error('Error fetching functions:', error);
    // Try a direct query to pg_proc if rpc fails
    const { data: pgData, error: pgError } = await supabase.from('_pg_functions').select('*').limit(10);
    if (pgError) console.error('PG Error:', pgError);
    else console.log('PG Functions:', pgData);
  } else {
    console.log('Functions:', data);
  }
}

listFunctions();
