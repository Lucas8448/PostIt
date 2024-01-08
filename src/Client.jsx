import React, { useState } from 'react';
import { database } from './firebase';
import { ref, push } from 'firebase/database';

const Client = () => {
  const [sessionId, setSessionId] = useState('');
  const [idea, setIdea] = useState('');

  const submitIdea = async () => {
    if (!sessionId) {
      alert('Please enter a session ID.');
      return;
    }
    if (!idea) {
      alert('Please enter an idea.');
      return;
    }
    const ideasRef = ref(database, `sessions/${sessionId}/ideas`);
    await push(ideasRef, {
      content: idea,
      createdAt: Date.now()
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
    </div>
  );
};

export default Client;