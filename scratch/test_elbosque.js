const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://oroqqrrdhqzaftqsuopt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w'
);

async function testElBosque() {
    const variants = [
        'Dolce Candy El Bosque',
        'Dolce Candy el bosque',
        'El Bosque',
        'elbosque',
        'Tienda El Bosque',
        'Sede El Bosque',
        'bosque'
    ];

    for (const v of variants) {
        const { error } = await supabase.from('orders').insert({
            delivery_method: 'PICKUP',
            pickup_store: v,
            customer_name: 'Test',
            customer_email: 'test@test.com',
            total_amount: 1,
            payment_method: 'zelle'
        });
        console.log(`PICKUP + ${v}: ${error ? error.message : 'SUCCESS'}`);
    }
}

testElBosque();
