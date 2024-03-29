import React, { useState, useEffect, useCallback } from 'react';
import { database } from './firebaseConfig';
import { ref, push, onValue, set } from 'firebase/database';
import DigitInput from './components/DigitInput';
import PostIt from './components/PostIt';

const Client = ({ submitter, submitter_email }) => {
  const [sessionId, setSessionId] = useState('');
  const [digitCode, setDigitCode] = useState('');
  const [idea, setIdea] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [sessionEntered, setSessionEntered] = useState(false);

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
  
  const handleSessionSubmit = useCallback(() => {
    if (!digitCode) {
      alert('Please enter a session ID.');
      return;
    }
    setSessionId(digitCode);
    setSessionEntered(true);
  }, [digitCode]);
  
  useEffect(() => {
    if (digitCode.length === 6) {
      handleSessionSubmit();
    }
  }, [digitCode, handleSessionSubmit]);

  const handleDigitsChange = (digits) => {
    setDigitCode(digits);
  };

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
      <div className="container-box">
        <div className='control'>
          {!sessionEntered ? (
            <>
              <DigitInput onDigitsChange={handleDigitsChange} digitCount={6} />
              <button className="unstyled-button" onClick={handleSessionSubmit}>
                Enter Session
              </button>
            </>
          ) : (
            <>
              <div className="ideas-container">
                {ideas.map((idea) => (
                  <PostIt
                    key={idea.id}
                    id={idea.id}
                    content={idea.content}
                  />
                ))}
              </div>
              <div className="add-note-container">
                <input
                  className="input-box"
                  type="text"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Enter your idea here"
                />
                <button className="submit-idea" onClick={submitIdea}>
                  Submit Idea
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Client;

