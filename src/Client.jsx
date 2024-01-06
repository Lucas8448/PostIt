import React, { useState, useEffect, useCallback } from 'react';
import Peer from 'peerjs';

const Client = () => {
  const [hostId, setHostId] = useState('');
  const [message, setMessage] = useState('');
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  
  const setupConnection = useCallback((connection) => {
    setConn(connection);
    connection.on('open', () => {
      alert('Connected to the host!');
    });

    connection.on('data', data => {
      handleData(data, connection.peer);
    });

    connection.on('error', err => {
      console.error('Connection error:', err);
      setConn(null);
    });
  }, []);
    
  const connectToHost = useCallback(() => {
    if (!peer) return;
    const connection = peer.connect("PostIt" + hostId);
    setupConnection(connection);
  }, [peer, hostId, setupConnection]);

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on('open', id => {
      setPeer(newPeer);
    });

    newPeer.on('connection', c => {
      setConn(c);
      setupConnection(c);
    });

    const intervalId = setInterval(() => {
      if (conn && !conn.open) {
        console.log('Connection lost. Attempting to reconnect...');
        connectToHost();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [peer, conn, connectToHost, setupConnection]);

  

  const sendMessage = () => {
    if (conn && conn.open) {
      const dataToSend = JSON.stringify({ message });
      conn.send(dataToSend);
      setMessage('');
    }
  };
  
  const handleData = (data, id) => {
    console.log(`Data received from ${id}:`, JSON.parse(data));
  };

  return (
    <div className="container">
      <h2 className="header">User Panel</h2>
      {!conn && (
        <>
          <input
            className="input"
            type="text"
            value={hostId}
            onChange={e => setHostId(e.target.value)}
            placeholder="Host ID"
          />
          <button className="button" onClick={connectToHost}>Connect to Host</button>
        </>
      )}
      {conn && (
        <>
          <input
            className="input"
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <button className="button" onClick={sendMessage}>Send Message</button>
        </>
      )}
    </div>
  );
};

export default Client;