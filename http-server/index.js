const http = require('http');
const fs = require('fs');

fs.readFile('home.html', (err, home) => {
  if (err) {
    throw err;
  }
  http
    .createServer((req, res) => {
      res.writeHeader(200, { 'Content-Type': 'text/html' });
      res.write(home);
      res.end();
    })
    .listen(3000);
});
