const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const http = require('http');

const routes = require("./routes");

const port = process.env.PORT || 3000;
const app = express();

// Port
app.set('port', port);

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
app.use(routes);

const server = http
  .createServer(app)
  .listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
  });
