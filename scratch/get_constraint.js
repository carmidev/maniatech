const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://oroqqrrdhqzaftqsuopt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getConstraint() {
  const { data, error } = await supabase.rpc('get_order_constraints');
  if (error) {
    // If RPC doesn't exist, try to guess or use a raw query if enabled (usually not for anon/service)
    // But let's try to query the information_schema via a trick or just guess.
    console.error('RPC Error:', error);
    
    // Plan B: Try to insert different variants and see which one passes? No.
    // Plan C: Try to read common migration names? No.
    
    // Let's try to run a simple SQL query if we have an 'exec_sql' function
    const { data: sqlData, error: sqlError } = await supabase.rpc('exec_sql', { 
        sql_query: "SELECT check_clause FROM information_schema.check_constraints WHERE constraint_name = 'check_delivery_logic_new'" 
    });
    if (sqlError) {
        console.error('SQL RPC Error:', sqlError);
    } else {
        console.log('Constraint:', sqlData);
    }
  } else {
    console.log('Constraints:', data);
  }
}

getConstraint();
