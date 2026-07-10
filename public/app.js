(function () {
  const termContainer = document.getElementById('terminal');

  const term = new window.Terminal({ cols: 80, rows: 24, cursorBlink: true });
  const fitAddon = new window.FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.open(termContainer);

  // Prevent default mobile keyboard behavior
  document.addEventListener('touchmove', function (e) {
    if (e.target.closest('#terminal')) {
      e.preventDefault();
    }
  }, { passive: false });

  function wsUrl() {
    const loc = window.location;
    // For Netlify, connect to the WebSocket function endpoint
    const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    
    // Netlify WebSocket API
    if (loc.hostname === 'localhost' && loc.port === '3000') {
      // Local development
      return protocol + '//' + loc.host + '/pty';
    } else {
      // Netlify production - use the WebSocket API endpoint
      return protocol + '//' + loc.host + '/.netlify/functions/pty';
    }
  }

  const socket = new WebSocket(wsUrl());

  socket.addEventListener('open', function () {
    fitAndInform();
    term.focus();
    // Ensure mobile keyboard is visible
    if (document.body.style) {
      document.body.style.position = 'relative';
    }
  });

  socket.addEventListener('message', function (ev) {
    try {
      const m = JSON.parse(ev.data);
      if (m.type === 'output') term.write(m.data);
    } catch (err) {
      // not JSON? write raw
      term.write(ev.data);
    }
  });

  socket.addEventListener('error', function (err) {
    console.error('WebSocket error:', err);
    term.write('\r\n[Connection Error]\r\n');
  });

  socket.addEventListener('close', function () {
    term.write('\r\n[Connection Closed]\r\n');
  });

  term.onData(function (data) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'input', data }));
    }
  });

  function fitAndInform() {
    fitAddon.fit();
    const cols = term.cols;
    const rows = term.rows;
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'resize', cols, rows }));
    }
  }

  window.addEventListener('resize', function () {
    fitAndInform();
  });

  // Handle orientation change for mobile devices
  window.addEventListener('orientationchange', function () {
    setTimeout(fitAndInform, 100);
  });
})();
