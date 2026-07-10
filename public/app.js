(function () {
  const termContainer = document.getElementById('terminal');

  const term = new window.Terminal({ cols: 80, rows: 24, cursorBlink: true });
  const fitAddon = new window.FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.open(termContainer);

  function wsUrl() {
    const loc = window.location;
    const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    return protocol + '//' + loc.host + '/pty';
  }

  const socket = new WebSocket(wsUrl());

  socket.addEventListener('open', function () {
    fitAndInform();
    term.focus();
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

  term.onData(function (data) {
    socket.send(JSON.stringify({ type: 'input', data }));
  });

  function fitAndInform() {
    fitAddon.fit();
    const cols = term.cols;
    const rows = term.rows;
    socket.send(JSON.stringify({ type: 'resize', cols, rows }));
  }

  window.addEventListener('resize', function () {
    fitAndInform();
  });
})();
