import React, { useState, useEffect, useCallback } from 'react';
import Peer from 'peerjs';

const Client = () => {
  const [hostId, setHostId] = useState('');
  const [notes, setNotes] = useState([]);
  const [data, setData] = useState('');
  const [peer, setPeer] = useState(null);
  const [conn, setConn] = useState(null);

  const handleData = useCallback((data, id) => {
    const parsedData = JSON.parse(data);
    const action = parsedData.action;
    switch (action) {
      case 'accepted':
        console.log('User accepted into session by host');
        alert('You have been accepted into the session by the host!');
        break;
      case 'updateNotes':
        console.log('Received updated notes:', parsedData.notes);
        setNotes(parsedData.notes);
        break;
      default:
        console.log(`Data received from ${id}:`, parsedData);
    }
  }, []);

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
  }, [handleData]);

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on('open', id => {
      setPeer(newPeer);
    });

    newPeer.on('connection', c => {
      setConn(c);
      setupConnection(c);
    });

    return () => {
      if (conn) {
        conn.close();
      }
    };
  }, [setupConnection, conn]);

  const connectToHost = useCallback(() => {
    if (!peer) return;
    const connection = peer.connect("PostIt" + hostId);
    setupConnection(connection);
  }, [peer, hostId, setupConnection]);

  const sendNote = (event) => {
    event.preventDefault();
    if (conn && conn.open) {
      const dataToSend = JSON.stringify({ action: 'addNote', note: data });
      conn.send(dataToSend);
      setData('');
    }
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
          <form onSubmit={sendNote}>
            <input type="text" value={data} onChange={e => setData(e.target.value)} placeholder="Enter your note" />
            <button type="submit">Submit Note</button>
          </form>
          {notes.map((note, index) => (
            <div key={index}>
              <h3>{note.name}'s Notes:</h3>
              {note.notes.map((noteItem, index) => (
                <p key={index}>{noteItem}</p>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Client;