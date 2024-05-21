const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
  //   fs.readFile('sample.txt', (err, data) => {
  //     res.end(data);
  //   });

  const stream = fs.createReadStream('sample.txt');
  stream.pipe();
});
server.listen(3000);
