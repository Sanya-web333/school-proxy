const http = require('http');
const httpProxy = require('http-proxy');

const TARGET = 'http://169.40.37.52:8080';

const proxy = httpProxy.createProxyServer({
  target: TARGET,
  ws: true,
  changeOrigin: true
});

proxy.on('error', (err, req, res) => {
  console.log('Proxy error:', err.message);
  if (res.writeHead) {
    res.writeHead(502);
    res.end('Bad gateway');
  }
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('Proxy running on port', PORT);
});
