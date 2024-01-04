import React, { useState, useEffect } from 'react';
import Peer from 'peerjs';

const Host = () => {
 const [peerId, setPeerId] = useState('');
 const [conn, setConn] = useState(null);
 const [ideas, setIdeas] = useState([]);
 const [message, setMessage] = useState('');

 function generateID() {
   let numbers = '';
   for (let i = 0; i < 4; i++) {
     numbers += Math.floor(Math.random() * 10);
   }
   return numbers;
 }

 useEffect(() => {
   const newPeer = new Peer(generateID());
   newPeer.on('open', id => {
     setPeerId(id);
   });

   newPeer.on('connection', c => {
     setConn(c);
     setupConnection(c);
   });
 }, []);

 const setupConnection = (connection) => {
   setConn(connection);
   connection.on('open', () => {
     alert('A client has connected!');
   });

   connection.on('data', data => {
     handleData(data)
   });
 };

 const sendData = () => {
   if (conn && conn.open) {
     setIdeas(prevIdeas => [...prevIdeas, message]);
     conn.send({ message });
     setMessage('');
   }
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