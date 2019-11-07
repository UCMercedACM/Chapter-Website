const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const SERVER_PORT = 4100;

// MetaData
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// Static file declaration
app.use(express.static(path.join(__dirname, 'client/dist/client')));

// Feedback response
app.get('/api/feedback', function(req, res) {
  res.set("Content-Type", "application/json");

  console.log(req);

  /* Send email here */

  res.send('{"message":"Email sent."}');
});

app.post('/api/feedback', function(req, res) {
  res.set("Content-Type", "application/json");

  res.send(req.body.name);
});

// 404 error handling
app.use((req, res) => {
  res.status(404).json({
    message: 'resource not found',
  });
});

// Workers can share any TCP connection
// In this case it is an HTTP server
app.listen(process.env.PORT || SERVER_PORT, () => {
  console.log(`Server started on the http://localhost:${SERVER_PORT}`);
});