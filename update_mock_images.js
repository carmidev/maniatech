const fs = require('fs');

const path = 'src/app/mock-data.ts';
let data = fs.readFileSync(path, 'utf8');

const replacements = [
  { old: 'pulparindo.jpg', new: 'pulparindo.png' },
  { old: 'skittles-sour.jpg', new: 'skittles-sour.png' },
  { old: 'reeses.jpg', new: 'reeses.png' },
  { old: 'sour-hearts.jpg', new: 'sour-hearts.png' },
  { old: 'lucas.jpg', new: 'lucas.png' },
  { old: 'mms.jpg', new: 'mms.png' },
  { old: 'jolly.jpg', new: 'jolly.png' },
  { old: 'warheads.jpg', new: 'warheads.png' },
  { old: 'sprite.jpg', new: 'sprite.png' },
  { old: 'vidal.jpg', new: 'vidal.png' },
  { old: 'feastables.jpg', new: 'feastable.png' }
];

replacements.forEach(rep => {
  data = data.replaceAll(`"/images/catalog/${rep.old}"`, `"/images/catalog/${rep.new}"`);
});

fs.writeFileSync(path, data);
console.log('mock-data.ts images updated');
