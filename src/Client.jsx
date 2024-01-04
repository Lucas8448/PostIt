import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const Client = () => {
  const [hostId, setHostId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);

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
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [peer, conn]);

  const connectToHost = () => {
    if (!peer) return;
    const connection = peer.connect("PostIt" + hostId);
    setupConnection(connection);
  };

  const setupConnection = (connection) => {
    setConn(connection);
    connection.on('open', () => {
      alert('Connected to the host!');
    });

    connection.on('data', data => {
      setMessages(prevMessages => [...prevMessages, data.message]);
    });

    connection.on('error', err => {
      console.error('Connection error:', err);
      setConn(null);
    });
  };

  const sendMessage = () => {
    if (conn && conn.open) {
      conn.send({ message });
      setMessage('');
    }
  };

  return (
    <div>
      <h2>User Panel</h2>
      {!conn && <input
        type="text"
        value={hostId}
        onChange={e => setHostId(e.target.value)}
        placeholder="Host ID"
      />}
      {!conn && <button onClick={connectToHost}>Connect to Host</button>}
      {conn && <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type your idea here"
      />}
      {conn && <button onClick={sendMessage}>Send Idea</button>}
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default Client;