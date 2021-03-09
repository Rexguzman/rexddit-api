const helmet = require("helmet");
const express = require('express');
const app = express();
const cors = require('cors')
const Ddos = require('ddos')

const { config } = require('./config/index');

const ddos = new Ddos({burst:5, limit:10})

const authApi = require('./routes/auth');
const channelsApi = require('./routes/channels.js');
const userApi = require('./routes/user.js');

const {
  logErrors,
  wrapErrors,
  errorHandler
} = require('./utils/middleware/errorHandlers.js');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

app.use(ddos.express);

// body parser
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: ['https://rexddit-frontend.vercel.app', 'http://192.168.31.101:3005'],
  method: "GET,HEAD,PUT,PATCH,POST,DELETE",
  
}));
app.use(helmet());

// routes
authApi(app);
channelsApi(app);
userApi(app);

// Catch 404
app.use(notFoundHandler);

// Errors middleware
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, function() {
  console.log(`Listening http://localhost:${config.port}`);
});