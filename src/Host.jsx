import React, { useState, useEffect, useCallback } from 'react';
import Peer from 'peerjs';

const Host = () => {
  const [peerId, setPeerId] = useState('');
  const [connections, setConnections] = useState([]);
  const [data, setData] = useState('');

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
      handleData(data, connection.peer);
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
    const newPeer = new Peer({
      config: {
        'iceServers': [
          { url: 'stun:stun.l.google.com:19302' },
          { url: 'stun:stun1.l.google.com:19302' },
          { url: 'stun:stun2.l.google.com:19302' },
          { url: 'stun:stun3.l.google.com:19302' },
          { url: 'stun:stun4.l.google.com:19302' },
        ],
      }
    },"PostIt" + generateID());
    newPeer.on('open', id => {
      setPeerId(id.slice(6));
    });

    newPeer.on('connection', setupConnection);

    return () => {
      connections.forEach(c => c.close());
    };
  }, [setupConnection, connections]);

  const sendData = () => {
    const dataToSend = JSON.stringify({ data });
    connections.forEach(conn => {
      if (conn && conn.open) {
        conn.send(dataToSend);
      }
    });
    setData('');
  };

  const handleData = (data, id) => {
    console.log(`Data received from ${id}:`, JSON.parse(data));
  };

  return (
    <div>
      <h2>Host Panel</h2>
      <p>Host ID: {peerId}</p>
      <input
        type="text"
        value={data}
        onChange={e => setData(e.target.value)}
        placeholder="Enter your data"
      />
      <button onClick={sendData}>Send Data</button>
    </div>
  );
};

export default Host;