import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const App = () => {
  const [peerId, setPeerId] = useState('');
  const [friendPeerId, setFriendPeerId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on('open', id => {
      console.log('Connected to Signaling Server ID:', id);
      setPeerId(id);
    });

    newPeer.on('connection', c => {
      setConn(c);
      setFriendPeerId(c.peer);
      setIsConnected(true);

      c.on('data', data => {
        printMsg(`Friend: ${data}`);
      });
    });

    setPeer(newPeer);
  }, []);

  const connectToFriend = () => {
    const connection = peer.connect(friendPeerId);
    setConn(connection);
    connection.on('open', () => {
      setIsConnected(true);
    });

    connection.on('data', data => {
      printMsg(`Friend: ${data}`);
    });
  };

  const sendMessage = () => {
    if (conn && conn.open) {
      conn.send(message);
      printMsg(`Me: ${message}`);
      setMessage('');
    }
  };

  const printMsg = (msg) => {
    setMessages(prevMessages => [...prevMessages, msg]);
  };

  return (
    <div>
      <h2>P2P Chat</h2>
      <p>Your ID: <b>{peerId}</b></p>
      <p>Share this ID with your friend so they can connect to you.</p>

      <input 
        type="text" 
        value={friendPeerId} 
        onChange={(e) => setFriendPeerId(e.target.value)} 
        placeholder="Enter friend's ID here" 
        disabled={isConnected}
      />
      <button onClick={connectToFriend} disabled={isConnected || !friendPeerId}>Connect to Friend</button><br/>

      <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type your message here" 
        disabled={!isConnected}
      />
      <button onClick={sendMessage} disabled={!isConnected || !message}>Send Message</button><br/>

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      {isConnected ? <p>Connected with {friendPeerId}</p> : <p>Not connected</p>}
    </div>
  );
};

export default App;