import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const URL = 'http://localhost:3000';

let socket;
function App() {
  const [status, setStatus] = useState('');

  const connect = () => {
    socket = io(URL, { autoConnect: false });

    socket.on('connect', () => {
      setStatus('Connected');

      socket.emit('authentication', {
        token: 'jwt_token',
      });
    });

    // Eventlisener is for unauthorized requests disconnect the socket
    // and refer to the server authenticate callback part;
    socket.on('unauthorized', (err) => {
      console.log('unauthorized', err);
      if (err && err.message) {
        setStatus(err.message);
        socket.disconnect();
      }
    });

    socket.on('disconnect', (err) => {
      console.log('disconnect', err);
    });

    socket.open();
  };

  const disconnect = () => {
    if (socket) socket.disconnect();
    setStatus('Disconnected');
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
      <div>Webpack 4.0</div>
      <div>{status}</div>
      <button type="button" onClick={disconnect}>Cancel</button>
    </div>
  );
}

export default App;
