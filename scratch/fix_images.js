const https = require('https');

const baseUrl = 'https://oroqqrrdhqzaftqsuopt.supabase.co/rest/v1/products';
const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';

function makeRequest(url, method, body = null) {
  return new Promise((resolve, reject) => {
    const headers = {
      'apikey': apikey,
      'Authorization': `Bearer ${apikey}`,
      'Prefer': 'return=representation'
    };
    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    const options = { method, headers };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : null);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function fixImages() {
  try {
    const products = await makeRequest(`${baseUrl}?select=id,name,images`, 'GET');
    if (!products) {
      console.log('No products found or error.');
      return;
    }
    console.log(`Checking ${products.length} products...`);

    for (const product of products) {
      if (!product.images || !Array.isArray(product.images)) continue;

      let changed = false;
      const newImages = product.images.map(img => {
        if (typeof img !== 'string') return img;
        
        let newImg = img;
        if (img.includes('localhost:3000/api/proxy/supabase')) {
          newImg = img.replace(/http:\/\/localhost:3000\/api\/proxy\/supabase/g, 'https://oroqqrrdhqzaftqsuopt.supabase.co');
          changed = true;
        } else if (img.includes('dolce-candy-admin.vercel.app/api/proxy/supabase')) {
          newImg = img.replace(/https:\/\/dolce-candy-admin\.vercel\.app\/api\/proxy\/supabase/g, 'https://oroqqrrdhqzaftqsuopt.supabase.co');
          changed = true;
        }
        return newImg;
      });

      if (changed) {
        console.log(`Fixing images for: ${product.name}`);
        await makeRequest(`${baseUrl}?id=eq.${product.id}`, 'PATCH', { images: newImages });
      }
    }
    console.log('Finished fixing images.');
  } catch (err) {
    console.error('Error during execution:', err);
  }
}

fixImages();
