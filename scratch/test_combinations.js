const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oroqqrrdhqzaftqsuopt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w'
);

async function testCombinations() {
    const tests = [
        { msg: 'Lowercase delivery + null pickup', data: { delivery_method: 'delivery', pickup_store: null, delivery_address: 'Test', customer_name: 'Test', customer_email: 'test@test.com', total_amount: 1, payment_method: 'zelle' } },
        { msg: 'Uppercase DELIVERY + null pickup', data: { delivery_method: 'DELIVERY', pickup_store: null, delivery_address: 'Test', customer_name: 'Test', customer_email: 'test@test.com', total_amount: 1, payment_method: 'zelle' } },
        { msg: 'Lowercase pickup + store', data: { delivery_method: 'pickup', pickup_store: 'campoclaro', delivery_address: null, customer_name: 'Test', customer_email: 'test@test.com', total_amount: 1, payment_method: 'zelle' } },
        { msg: 'Uppercase PICKUP + store', data: { delivery_method: 'PICKUP', pickup_store: 'campoclaro', delivery_address: null, customer_name: 'Test', customer_email: 'test@test.com', total_amount: 1, payment_method: 'zelle' } },
    ];

    for (const t of tests) {
        const { error } = await supabase.from('orders').insert(t.data);
        console.log(`${t.msg}: ${error ? error.message : 'SUCCESS'}`);
        if (error) console.log('Constraint:', error.message.split('"')[1] || error.message);
    }
}

testCombinations();
