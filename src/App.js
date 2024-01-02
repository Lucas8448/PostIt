import React, { useEffect, useState } from 'react';
import Peer from 'peerjs';

const App = () => {
  const [peer, setPeer] = useState(null);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [peerId, setPeerId] = useState('');
  const [otherPeerId, setOtherPeerId] = useState(''); // Add this line

  useEffect(() => {
    const peerInstance = new Peer();
    setPeer(peerInstance);

    peerInstance.on('open', id => {
      setPeerId(id);
      console.log('My peer ID is: ' + id);
    });

    peerInstance.on('connection', conn => {
      setConnection(conn);

      conn.on('data', data => {
        setMessages(prevMessages => [...prevMessages, data]);
      });
    });
  }, []);

  const connectToPeer = (id) => {
  if (!peer) return;

  const conn = peer.connect(id);
  setConnection(conn);

  conn.on('open', () => {
      conn.on('data', data => {
        setMessages(prevMessages => [...prevMessages, data]);
      });
    });
  };

  const sendMessage = () => {
    if (!connection || !message) return;

    connection.send(message);
    setMessage('');
  };

  return (
    <div>
      <p>Your Peer ID: {peerId}</p>
      <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
      <input type="text" placeholder="Other Peer ID" onChange={e => setOtherPeerId(e.target.value)} />
      <button onClick={() => connectToPeer(otherPeerId)}>Connect to Other Peer</button>
    </div>
  );
};

export default App;