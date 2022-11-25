const openBrowser = require('./cjs/index');
const http = require('node:http');

const OB = new openBrowser({
  id: true,
  port: 4000,
});

http
  .createServer((req, res) => {
    res.write('hello world\n');
    res.end();
  })
  .listen(4000, () => {
    OB.open();
  });
