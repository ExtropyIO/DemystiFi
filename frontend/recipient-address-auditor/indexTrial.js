var WebSocketClient = require('websocket').client;

async function auditApi(address) {
  var client = new WebSocketClient();
  client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
  });

  client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
      console.log('Connection Error: ' + error.toString());
    });
    connection.on('close', function () {
      console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        console.log("Received: '" + message.utf8Data + "'");
      }
    });

    function sendNumber() {
      if (connection.connected) {
        var number = Math.round(Math.random() * 0xffffff);
        connection.sendUTF(number.toString());
        setTimeout(sendNumber, 1000);
      }
    }
    sendNumber();
  });

  client.connect('ws://localhost:8080/');

  // return new Promise((resolve) => {
  //   const scam01 = '0x0F0C81fE3cbEc74AFD6F92862785dba626297187';
  //   // API call here
  //   let something = axios.post('127.0.0.1:8081/checkScam', {
  //     params: { data: address },
  //   });
  //   resolve(true);
  // });

  return true;
}

auditApi();
