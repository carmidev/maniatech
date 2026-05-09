const https = require('https');

https.get('https://pydolarvenezuela-api.vercel.app/api/v1/dollar/page?page=bcv', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("DOLLAR:", data); });
}).on("error", (err) => { console.log("Error dollar: " + err.message); });

https.get('https://pydolarvenezuela-api.vercel.app/api/v1/dollar/unit/bcv', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("UNIT BCV:", data); });
}).on("error", (err) => { console.log("Error unit: " + err.message); });
