const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8070 });
wss.on("connection", function connection(ws, req) {
  console.log("connection to backend");
  console.log(wss.clients.size);
});
