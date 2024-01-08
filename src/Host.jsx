import React, { useState, useEffect } from 'react';
import { database } from './firebaseConfig';
import { ref, push, onValue, remove } from 'firebase/database';

const Host = () => {
  const [sessionId, setSessionId] = useState('');
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const newSessionRef = push(ref(database, 'sessions'));
    setSessionId(newSessionRef.key);

    const ideasRef = ref(database, `sessions/${newSessionRef.key}/ideas`);
    onValue(ideasRef, (snapshot) => {
      const ideasData = snapshot.val();
      const loadedIdeas = [];
      for (const key in ideasData) {
        loadedIdeas.push({ id: key, ...ideasData[key] });
      }
      setIdeas(loadedIdeas);
    });

    return () => remove(ideasRef);
  }, []);

  return (
    <div>
      <h2>Host Panel</h2>
      <p>Session ID: {sessionId}</p>
      <div>
        <h3>Ideas Submitted:</h3>
        <ul>
          {ideas.map((idea) => (
            <li key={idea.id}>{idea.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Host;