require('dotenv').config();
const express = require('express');
const cors = require('cors');
const enrouten = require('express-enrouten');
const mongoose = require('mongoose');
const fs = require('fs');
const https = require('https');

const app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(enrouten({ directory: 'routes' }));
app.use('*', (req, res) => res.redirect(process.env.WEBSITE_URL));

mongoose.connect(`${process.env.MONGO_DB}`, { useNewUrlParser: true }, (err) => {
  if (!err) return console.log('Connected to the database');
  return console.log('Not connected to the database, an error has occured: ', err.message || err);
});

const options = {
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem'),
  ca: fs.readFileSync('./ssl/ca.pem')
};

const server = https.createServer(options, app);
server.listen(port, () => console.log(`Service is running on port ${port}`));

module.exports = server;
