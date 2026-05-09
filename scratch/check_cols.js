const https = require('https');

const url = 'https://oroqqrrdhqzaftqsuopt.supabase.co/rest/v1/';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yb3FxcnJkaHF6YWZ0cXN1b3B0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njg3NTQxOSwiZXhwIjoyMDkyNDUxNDE5fQ.qKlhj3a9Vx2Xpf7LpnjXa-N7TNefc1ajoev69X7BO2w';

https.get(url, { headers: { 'apikey': serviceKey, 'Authorization': `Bearer ${serviceKey}` } }, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const schema = JSON.parse(data);
      ['products', 'inventory'].forEach(tableName => {
        if (schema.definitions && schema.definitions[tableName]) {
          console.log(`--- ESTRUCTURA DE LA TABLA ${tableName.toUpperCase()} ---`);
          const props = schema.definitions[tableName].properties;
          Object.keys(props).forEach(col => {
            console.log(`- ${col} (${props[col].format || props[col].type})`);
          });
        } else {
          console.log(`No se encontró la tabla "${tableName}" en el esquema.`);
        }
      });
    } catch (err) {
      console.error('Error al procesar el esquema:', err);
    }
  });
}).on('error', (err) => {
  console.error('Error en la conexión:', err);
});
