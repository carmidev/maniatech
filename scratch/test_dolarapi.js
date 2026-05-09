const https = require('https');

https.get('https://ve.dolarapi.com/v1/dolares/oficial', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("DOLARAPI:", data); });
}).on("error", (err) => { console.log("Error dolarapi: " + err.message); });

https.get('https://ve.dolarapi.com/v1/euros/oficial', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => { console.log("DOLARAPI EURO:", data); });
}).on("error", (err) => { console.log("Error dolarapi euro: " + err.message); });
