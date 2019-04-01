const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app); // eslint-disable-line
const path = require('path');

const SERVER_PORT = 60000;

// MetaData
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

//Static file declaration
app.use(express.static(path.join(__dirname, '/../client/build')));

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/../client/build')));
  //
  app.get('*', (req, res) => {
    res.sendfile(path.join(__dirname = 'client/build/index.html'));
  })
}

//build mode
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/public/index.html'));
})

// 404 error handling
app.use((req, res) => {
  res.status(404).json({
    message: 'resource not found',
  });
});

// Workers can share any TCP connection
// In this case it is an HTTP server
http.listen(process.env.PORT || SERVER_PORT, () => {
  console.log(`Server started on the http://localhost:${SERVER_PORT}`);
});