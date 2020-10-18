const express = require('express');
const app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json()); // for parsing application/json
app.use(bodyparser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.post('/checkPost', function (req, res) {
  console.log('hit');
  // console.log(req);
  res.send('hey');
});

app.get('/checkScam', function (req, res) {
  console.log('hit');
  console.log(req.query);
  // console.log(req);
  res.send(false);
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
