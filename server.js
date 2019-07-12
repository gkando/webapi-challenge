const express = require('express');
const helmet = require('helmet');

const projects = require('./routers/projectsRouter.js');
const actions = require('./routers/actionsRouter.js');
const server = express();

function logger(req, res, next) {
  console.log(`${req.method} to ${req.path}`);
  next();
};

server.use(logger);
server.use(helmet());
server.use(express.json());

server.use('/api/projects', projects);
server.use('/api/actions', actions);

server.get('/', (req, res) => {
  res.send(`<h2>Hello</h2>`)
});

module.exports = server;