const fs = require('fs');

let code = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');
const nationalFormInner = fs.readFileSync('national.txt', 'utf8');

const addressListStartStr = '<div className="grid grid-cols-1 gap-3">';
const addressListEndStr = '</div>\n                </div>\n\n                <div className="flex gap-4 pt-6">';

const addressListStartIdx = code.indexOf(addressListStartStr);
const addressListEndIdx = code.indexOf(addressListEndStr, addressListStartIdx);

if (addressListStartIdx !== -1 && addressListEndIdx !== -1) {
  const oldAddressList = code.substring(addressListStartIdx, addressListEndIdx);
  
  const newAddressListAndNational = `                  {deliveryMethod === 'delivery' && (
                    <div className="grid grid-cols-1 gap-3">
                      ` + oldAddressList.substring(addressListStartStr.length).trim() + `
                  )}

                  {deliveryMethod === 'national' && (
                    <div className="p-6 rounded-3xl border-2 border-slate-100 bg-white space-y-5">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Detalles para Envío Nacional (Cobro a Destino)
                      </p>
                      ` + nationalFormInner + `
                    </div>
                  )}
`;

  code = code.substring(0, addressListStartIdx) + newAddressListAndNational + '\n                </div>\n                </div>\n\n                <div className="flex gap-4 pt-6">' + code.substring(addressListEndIdx + addressListEndStr.length);
  fs.writeFileSync('src/app/checkout/page.tsx', code);
  console.log('Successfully added national form');
} else {
  console.log('Could not find address list boundaries');
  process.exit(1);
}
