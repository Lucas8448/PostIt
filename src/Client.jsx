import React, { useState, useEffect } from 'react';
import { database } from './firebaseConfig';
import { ref, push, onValue, set } from 'firebase/database';

const Client = ({ submitter, submitter_email }) => {
  const [sessionId, setSessionId] = useState('');
  const [idea, setIdea] = useState('');
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    if (sessionId) {
      const ideasRef = ref(database, `sessions/${sessionId}/ideas`);
      onValue(ideasRef, (snapshot) => {
        const ideasData = snapshot.val();
        const loadedIdeas = ideasData ? Object.keys(ideasData).map(key => ({
          id: key,
          content: ideasData[key].content
        })) : [];
        setIdeas(loadedIdeas);
      });
    }
  }, [sessionId]);

  const submitIdea = async () => {
    if (!sessionId) {
      alert('Please enter a session ID.');
      return;
    }
    if (!idea) {
      alert('Please enter an idea.');
      return;
    }
    const newIdeaRef = push(ref(database, `sessions/${sessionId}/ideas`));
    await set(newIdeaRef, {
      content: idea,
      createdAt: Date.now()
    });

    const submitterRef = ref(database, `sessions/${sessionId}/submitters/${newIdeaRef.key}`);
    await set(submitterRef, {
      submitterUID: submitter,
      submitterEmail: submitter_email
    });

    setIdea('');
  };

  return (
    <div className="container">
      <h2 className="header">User Panel</h2>
      <input
        className="input"
        type="text"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        placeholder="Session ID"
      />
      <input
        className="input"
        type="text"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Enter your idea here"
      />
      <button className="button" onClick={submitIdea}>
        Submit Idea
      </button>
      <div>
        <h3>Submitted Ideas:</h3>
        <ul>
          {ideas.map((idea) => (
            <li key={idea.id}>{idea.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Client;