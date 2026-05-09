const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkConstraints() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'orders' });
  if (error) {
     console.error("Error with RPC, trying direct SQL via raw pg if possible, else just give the generic SQL");
  } else {
     console.log(data);
  }
}
checkConstraints();
