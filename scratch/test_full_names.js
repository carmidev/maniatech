const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oroqqrrdhqzaftqsuopt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w'
);

async function testFullNames() {
    const tests = [
        { msg: 'PICKUP + Dolce Candy Campo Claro', data: { delivery_method: 'PICKUP', pickup_store: 'Dolce Candy Campo Claro', delivery_address: null, customer_name: 'Test', customer_email: 'test@test.com', total_amount: 1, payment_method: 'zelle' } },
        { msg: 'PICKUP + Dolce Candy El Bosque', data: { delivery_method: 'PICKUP', pickup_store: 'Dolce Candy El Bosque', delivery_address: null, customer_name: 'Test', customer_email: 'test@test.com', total_amount: 1, payment_method: 'zelle' } },
        { msg: 'PICKUP + campoclaro (re-test)', data: { delivery_method: 'PICKUP', pickup_store: 'campoclaro', delivery_address: null, customer_name: 'Test', customer_email: 'test@test.com', total_amount: 1, payment_method: 'zelle' } },
    ];

    for (const t of tests) {
        const { error } = await supabase.from('orders').insert(t.data);
        console.log(`${t.msg}: ${error ? error.message : 'SUCCESS'}`);
    }
}

testFullNames();
