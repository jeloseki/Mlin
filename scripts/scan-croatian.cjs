const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/Ivica/Documents/GitHub/Mlin/src';
const re = /[\u010D\u0107\u0111\u0161\u017E\u010C\u0106\u0110\u0160\u017D]|gre\u0161ka|greska|pobjed|poraz|igra[\u010Dc]|otklju[\u010Dc]/i;
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) { walk(p); continue; }
    if (!/\.(js|jsx|json|css|html)$/.test(f)) continue;
    const lines = fs.readFileSync(p, 'utf8').split('\n');
    lines.forEach((l, i) => { if (re.test(l)) console.log(`${p}:${i + 1}: ${l.trim()}`); });
  }
}
walk(dir);

