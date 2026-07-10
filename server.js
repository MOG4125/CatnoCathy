const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/pty' });

wss.on('connection', function (ws) {
  const shell = process.env.SHELL || (process.platform === 'win32' ? 'powershell.exe' : 'bash');
  const env = Object.assign({}, process.env);

  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.cwd(),
    env
  });

  ptyProcess.on('data', function (data) {
    try { ws.send(JSON.stringify({ type: 'output', data })); } catch (err) { }
  });

  ws.on('message', function (msg) {
    let m;
    try { m = JSON.parse(msg); } catch (err) { return; }
    if (m.type === 'input') {
      ptyProcess.write(m.data);
    } else if (m.type === 'resize') {
      ptyProcess.resize(m.cols, m.rows);
    }
  });

  ws.on('close', function () {
    try { ptyProcess.kill(); } catch (err) { }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`Web terminal listening on http://0.0.0.0:${PORT}`);
});
