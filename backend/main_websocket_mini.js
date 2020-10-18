const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', function connection(ws, req) {
  console.log('connection to backend');
  console.log(wss.clients.size);
});
wss.on('data', (data) => {
  console.log(data);
  console.log(wss.clients.size);
});
