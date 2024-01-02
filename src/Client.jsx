import React, { useState } from 'react';
import Peer from 'peerjs';

const Client = () => {
  const [hostId, setHostId] = useState('');
  const [userName, setUserName] = useState('');
  const [verified, setVerified] = useState(false);
  const [conn, setConn] = useState(null);

  const connectToHost = () => {
    const peer = new Peer();

    const connection = peer.connect(hostId);
    connection.on('open', () => {
      connection.send({ type: 'name', name: userName });
    });

    connection.on('data', (data) => {
      if (data.type === 'verification') {
        setVerified(data.status);
      }
    });

    setConn(connection);
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
      <input
        type="text"
        value={userName}
        onChange={e => setUserName(e.target.value)}
        placeholder="Your Name"
      />
      <button onClick={connectToHost}>Connect to Host</button>
      {verified ? <p>You are verified and can participate.</p> : <p>Waiting for verification...</p>}
    </div>
  );
};

export default Client;