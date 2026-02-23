// proxy.js — Claude API CORS proxy for interview-prep-app.html
// No npm dependencies needed. Run with: node proxy.js
// Then set provider to "Claude" in the app's Settings modal.

const http = require('http');
const https = require('https');

const PORT = 3001;
const ANTHROPIC_HOST = 'api.anthropic.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version, anthropic-beta',
};

const server = http.createServer((req, res) => {
  // Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/v1/messages') {
    res.writeHead(404, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Only POST /v1/messages is supported' }));
    return;
  }

  // Collect request body
  const chunks = [];
  req.on('data', chunk => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);

    const proxyReq = https.request({
      hostname: ANTHROPIC_HOST,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        'x-api-key': req.headers['x-api-key'] || '',
        'anthropic-version': req.headers['anthropic-version'] || '2023-06-01',
      },
    }, proxyRes => {
      const respChunks = [];
      proxyRes.on('data', c => respChunks.push(c));
      proxyRes.on('end', () => {
        const respBody = Buffer.concat(respChunks);
        res.writeHead(proxyRes.statusCode, {
          ...CORS_HEADERS,
          'Content-Type': 'application/json',
        });
        res.end(respBody);
      });
    });

    proxyReq.on('error', err => {
      res.writeHead(502, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'Proxy error: ' + err.message } }));
    });

    proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Claude proxy running on http://127.0.0.1:${PORT}`);
  console.log(`Forward: POST /v1/messages → https://${ANTHROPIC_HOST}/v1/messages`);
  console.log('Set provider to "Claude" in the app Settings, then paste your API key.');
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Kill the other process or change PORT in proxy.js.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
