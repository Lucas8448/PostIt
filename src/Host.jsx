import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const Host = () => {
  const [peerId, setPeerId] = useState('');
  const [clients, setClients] = useState({});

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', id => {
      setPeerId(id);
      console.log(`Host peer ID: ${id}`);
    });

    peer.on('connection', conn => {
      conn.on('data', data => {
        if (data.type === 'name') {
          // Verify user name here
          const isVerified = verifyUserName(data.name);
          conn.send({ type: 'verification', status: isVerified });

          if (isVerified) {
            setClients(prevClients => ({ ...prevClients, [data.name]: conn }));
          }
        }
      });
    });
  }, []);

  const verifyUserName = (name) => {
    // Implement your verification logic here
    return true;  // For demonstration purposes, everyone is verified
  };

  return (
    <div>
      <h2>Host Panel</h2>
      <p>Host ID: {peerId}</p>
      <p>Connected Users:</p>
      <ul>
        {Object.keys(clients).map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Host;