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
  }, []);

  const connectToHost = () => {
    if (!peer) return;
    const connection = peer.connect(hostId);
    setupConnection(connection);
  };

  const setupConnection = (connection) => {
    setConn(connection);
    connection.on('open', () => {
      alert('Connected to the host!');
    });

    connection.on('data', data => {
      setMessages(data); // Update messages with received ideas
    });
  };

  const sendMessage = () => {
    if (conn && conn.open) {
      conn.send(message); // Send the message when the button is clicked
      setMessage('');
    }
  };

  return (
    <div>
      <h2>User Panel</h2>
      <input
        type="text"
        value={hostId}
        onChange={e => setHostId(e.target.value)}
        placeholder="Host ID"
      />
      <button onClick={connectToHost}>Connect to Host</button>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type your idea here"
      />
      <button onClick={sendMessage}>Send Idea</button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default Client;