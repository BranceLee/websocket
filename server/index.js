/* eslint-disable no-param-reassign */
const http = require('http');
const io = require('socket.io')();
const socketAuth = require('socketio-auth');

const PORT = 3000;
const server = http.createServer();

// Mock user verification
const verifyUser = async token => new Promise((resovle) => {
  setTimeout(() => {
    const users = [{
      id: 1,
      name: 'Alice',
      token: 'jwt_token',
    }];

    const user = users.find(u => u.token === token);
    if (!user) {
      resovle(null);
      return;
    }
    resovle(user);
  }, 1000);
});


io.attach(server);

// io.on('connection', (socket) => {
//   console.log(`Socket ${socket.id} connected`);

//   socket.on('disconnect', () => {
//     console.log(`Socket ${socket.id} disconnected.`);
//   });
// });

socketAuth(io, {
  authenticate: async (socket, data, callback) => {
    const { token } = data;

    const user = await verifyUser(token);
    if (user) {
      socket.user = user;
      return callback(null, true);
    }
    return callback({ message: 'Unthorized' });
  },

  postAuthenticate: (socket) => {
    console.log(`${socket.id} authenticated.`);
  },

  disconnect: (socket) => {
    console.log(`${socket.id} disconnected.`);
  },
});

server.listen(PORT);
