import React from 'react';

const DatabaseSchema = () => {
  return (
    <div className="container container-box">
      <h1>Database Schema Overview</h1>

      <h2>Session</h2>
      <p>A session represents a unique instance where ideas are gathered. Each session has an ID and an associated owner.</p>
      <ul>
        <li><strong>Session ID:</strong> The unique identifier for the session.</li>
        <li><strong>Owner:</strong> The user who owns or created the session.</li>
      </ul>

      <h2>Idea</h2>
      <p>Ideas are submitted within a session. Each idea has its own content and a timestamp marking its creation.</p>
      <ul>
        <li><strong>Idea ID:</strong> Unique identifier for the idea.</li>
        <li><strong>Content:</strong> The textual content of the idea.</li>
        <li><strong>CreatedAt:</strong> Timestamp of when the idea was created.</li>
      </ul>

      <h2>Submitter</h2>
      <p>Submitters are users who contribute ideas to a session. Each submitter is identified by their UID and email.</p>
      <ul>
        <li><strong>Submitter UID:</strong> Unique identifier for the submitter.</li>
        <li><strong>Submitter Email:</strong> Email address of the submitter.</li>
      </ul>
    </div>
  );
};

export default DatabaseSchema;