import React, { useState, useEffect, useCallback } from 'react';
import Peer from 'peerjs';

const Host = () => {
  const [peerId, setPeerId] = useState('');
  const [notes, setNotes] = useState([]);
  const [connections, setConnections] = useState([]);

  function generateID() {
    let numbers = '';
    for (let i = 0; i < 4; i++) {
      numbers += Math.floor(Math.random() * 10);
    }
    return numbers;
  }

  const sendData = useCallback(() => {
    const dataToSend = JSON.stringify({ action: 'updateNotes', notes });
    connections.forEach(conn => {
      if (conn && conn.open) {
        conn.send(dataToSend);
      }
    });
  }, [notes, connections]);

  const acceptClient = useCallback((clientName) => {
    setNotes(prevNotes => [...prevNotes, { name: clientName, notes: [] }]);
    sendData();
  }, [sendData]);

  const handleData = useCallback((data, id) => {
    const parsedData = JSON.parse(data);
    const action = parsedData.action;
    switch (action) {
      case 'updateNotes':
        console.log('Received updated notes:', parsedData.notes);
        setNotes(parsedData.notes);
        break;
      case 'requestToJoin':
        if (window.confirm('Do you want to accept this client?')) {
          acceptClient(id);
        }
        break;
      default:
        console.log(`Data received from ${id}:`, parsedData);
    }
  }, [acceptClient]);

  const setupConnection = useCallback((connection) => {
    setConnections(prevConnections => [...prevConnections, connection]);
    connection.on('open', () => {
      alert('A client has connected!');
    });

    connection.on('data', data => {
      handleData(data, connection.peer);
    });
  }, [handleData]);

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

  return (
    <div>
      <h2>Host Panel</h2>
      <p>Host ID: {peerId}</p>
      {notes.map((note, index) => (
        <div key={index}>
          <h3>{note.name}'s Notes:</h3>
          {note.notes.map((noteItem, index) => (
            <p key={index}>{noteItem}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Host;