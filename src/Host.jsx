import React, { useState, useEffect } from 'react';
import { database } from './firebaseConfig';
import { ref, onValue, set } from 'firebase/database';

const generateSessionKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const Host = ({ owner, owner_email }) => {
  const [sessionId, setSessionId] = useState('');
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    if (!owner) {
      console.error('Owner is undefined');
      return;
    }

    const sessionKey = generateSessionKey();
    setSessionId(sessionKey);
    const sessionRef = ref(database, `sessions/${sessionKey}`);
    set(sessionRef, { owner });

    const ideasRef = ref(database, `sessions/${sessionKey}/ideas`);
    const submittersRef = ref(database, `sessions/${sessionKey}/submitters`);

    onValue(ideasRef, (ideasSnapshot) => {
      onValue(submittersRef, (submittersSnapshot) => {
        const ideasData = ideasSnapshot.val();
        const submittersData = submittersSnapshot.val();
        const loadedIdeas = [];

        for (const key in ideasData) {
          const idea = ideasData[key];
          const submitterInfo = submittersData ? submittersData[key] : {};

          loadedIdeas.push({
            id: key,
            content: idea.content,
            submitter: submitterInfo ? submitterInfo.submitterUID : 'Unknown',
            submitterEmail: submitterInfo ? submitterInfo.submitterEmail : 'Unknown',
          });
        }

        setIdeas(loadedIdeas);
      }, { onlyOnce: true });
    });

    return () => {
      const ideasRefOff = ref(database, `sessions/${sessionKey}/ideas`);
      const submittersRefOff = ref(database, `sessions/${sessionKey}/submitters`);
      onValue(ideasRefOff, () => { }, { onlyOnce: true });
      onValue(submittersRefOff, () => { }, { onlyOnce: true });
    };
  }, [owner]);

  return (
    <div>
      <h2>Host Panel</h2>
      <p>Session ID: {sessionId}</p>
      <div>
        <h3>Ideas Submitted:</h3>
        <ul>
          {ideas.map((idea) => (
            <li key={idea.id}>
              {idea.submitter} (Email: {idea.submitterEmail}): {idea.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Host;