const fs = require('fs');
const content = fs.readFileSync('front-end/src/pages/AdminDashboard.jsx', 'utf8');

const lines = content.split('\n');
for (let i = 405; i <= 440; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
