const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');

// Store active connections with their PTY processes
const connections = new Map();

exports.handler = async (event, context) => {
  // This is a WebSocket handler for Netlify Functions
  // In development, this will be called; in production, Netlify manages the upgrade
  
  if (event.requestContext.eventType === 'CONNECT') {
    return { statusCode: 200 };
  }

  if (event.requestContext.eventType === 'DISCONNECT') {
    const connectionId = event.requestContext.connectionId;
    const connection = connections.get(connectionId);
    if (connection) {
      try {
        connection.ptyProcess.kill();
      } catch (err) {}
      connections.delete(connectionId);
    }
    return { statusCode: 200 };
  }

  if (event.requestContext.eventType === 'MESSAGE') {
    const connectionId = event.requestContext.connectionId;
    let message;
    
    try {
      message = JSON.parse(event.body);
    } catch (err) {
      return { statusCode: 400 };
    }

    if (message.type === 'input' && connections.has(connectionId)) {
      connections.get(connectionId).ptyProcess.write(message.data);
    } else if (message.type === 'resize' && connections.has(connectionId)) {
      const { cols, rows } = message;
      connections.get(connectionId).ptyProcess.resize(cols, rows);
    }

    return { statusCode: 200 };
  }

  return { statusCode: 400 };
};
