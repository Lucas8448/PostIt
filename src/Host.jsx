import React, { useState, useEffect, useCallback } from 'react';
import Peer from 'peerjs';

const Host = () => {
  const [peerId, setPeerId] = useState('');
  const [connections, setConnections] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [message, setMessage] = useState('');

  function generateID() {
    let numbers = '';
    for (let i = 0; i < 4; i++) {
      numbers += Math.floor(Math.random() * 10);
    }
    return numbers;
  }

  const setupConnection = useCallback((connection) => {
    setConnections(prevConnections => [...prevConnections, connection]);
    connection.on('open', () => {
      alert('A client has connected!');
    });

    connection.on('data', data => {
      handleData(data)
    });

    connection.on('error', err => {
      console.error('Connection error:', err);
      setConnections(prevConnections => prevConnections.filter(c => c !== connection));
    });

    connection.on('close', () => {
      setConnections(prevConnections => prevConnections.filter(c => c !== connection));
    });
  }, []);

  useEffect(() => {
    const newPeer = new Peer("PostIt" + generateID());
    newPeer.on('open', id => {
      setPeerId(id.slice(6));
    });

    newPeer.on('connection', setupConnection);

    return () => {
      connections.forEach(c => c.close());
    };
  }, [setupConnection, connections]);

  const sendData = () => {
    setIdeas(prevIdeas => [...prevIdeas, message]);
    connections.forEach(conn => {
      if (conn && conn.open) {
        conn.send({ message });
      }
    });
    setMessage('');
  };

  const handleData = (data) => {
    setIdeas(prevIdeas => [...prevIdeas, data.message]);
  };

  return (
    <div>
      <h2>Host Panel</h2>
      <p>Host ID: {peerId}</p>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type your idea here"
      />
      <button onClick={sendData}>Send Idea</button>
      <ul>
        {ideas.map((idea, index) => (
          <li key={index}>{idea}</li>
        ))}
      </ul>
    </div>
  );
};

export default Host;