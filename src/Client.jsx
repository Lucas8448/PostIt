import React, { useState, useEffect } from 'react';
import { database } from './firebaseConfig';
import { ref, push, onValue, set } from 'firebase/database';

const DigitInput = ({ onDigitsChange }) => {
  const [digits, setDigits] = useState(new Array(6).fill(""));

  const handleChange = (event, index) => {
    const value = event.target.value;
    if (!value.match(/[0-9]/) && value !== "") {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    onDigitsChange(newDigits.join(""));

    if (value && index < 5) {
      document.getElementById(`digit${index + 1}`).focus();
    }
  };

  const handleKeyUp = (event, index) => {
    if (event.key === "Backspace" && index > 0) {
      document.getElementById(`digit${index - 1}`).focus();
    }
  };

  return (
    <div className="digitInputContainer">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          id={`digit${index}`}
          type="text"
          maxLength="1"
          value={digits[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyUp={(e) => handleKeyUp(e, index)}
          placeholder="0"
          className="digitInput"
        />
      ))}
    </div>
  );
};

const Client = ({ submitter, submitter_email }) => {
  const [digitSessionId, setDigitSessionId] = useState('');
  const [idea, setIdea] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [sessionEntered, setSessionEntered] = useState(false);

  useEffect(() => {
    if (digitSessionId.length === 6) {
      const ideasRef = ref(database, `sessions/${digitSessionId}/ideas`);
      onValue(ideasRef, (snapshot) => {
        const ideasData = snapshot.val();
        const loadedIdeas = ideasData ? Object.keys(ideasData).map(key => ({
          id: key,
          content: ideasData[key].content
        })) : [];
        setIdeas(loadedIdeas);
      });
    }
  }, [digitSessionId]);

  const handleSessionSubmit = () => {
    if (!digitSessionId || digitSessionId.length !== 6) {
      alert('Please enter a 6-digit session ID.');
      return;
    }
    setSessionEntered(true);
  };

  const submitIdea = async () => {
    if (!digitSessionId || digitSessionId.length !== 6) {
      alert('Please enter a 6-digit session ID.');
      return;
    }
    if (!idea) {
      alert('Please enter an idea.');
      return;
    }
    const newIdeaRef = push(ref(database, `sessions/${digitSessionId}/ideas`));
    await set(newIdeaRef, {
      content: idea,
      createdAt: Date.now()
    });

    const submitterRef = ref(database, `sessions/${digitSessionId}/submitters/${newIdeaRef.key}`);
    await set(submitterRef, {
      submitterUID: submitter,
      submitterEmail: submitter_email
    });

    setIdea('');
  };

  return (
    <div className="container">
      <div className="container-box">
        {!sessionEntered ? (
          <>
            <DigitInput onDigitsChange={setDigitSessionId} />
            <button className="button" onClick={handleSessionSubmit}>
              Enter Session
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Client;