import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Host from './Host';
import Client from './Client';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/host">Host</Link>
            </li>
            <li>
              <Link to="/client">Join</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/host" element={<Host />} />
          <Route path="/client" element={<Client />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Brainstorming App</h2>
      <p>Select 'Host' to start a session or 'Join' to join a session.</p>
    </div>
  );
};

export default App;