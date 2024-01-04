import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';
import { auth, googleAuthProvider } from './firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import Host from './Host';
import Client from './Client';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route path="/host" element={<Host />} />
            <Route path="/client" element={<Client />} />
            <Route path="/" element={<Home user={user} />} />
          </>
        ) : (
          <Route path="/" element={<SignIn signInWithGoogle={signInWithGoogle} />} />
        )}
      </Routes>
    </Router>
  );
};

const Home = ({ user }) => {
  const navigate = useNavigate();

  const signOut = () => {
    auth.signOut().then(() => navigate('/'));
  };

  return (
    <div className="container home-container">
      <div>Welcome, {user.displayName}</div>
      <Link to="/host" className="app-link-button app-home-link">Host</Link>
      <Link to="/client" className="app-link-button app-home-link">Join</Link>
      <button onClick={signOut} className="app-link-button">Sign out</button>
    </div>
  );
};

const SignIn = ({ signInWithGoogle }) => {
  return (
    <div className="app-container app-sign-in-container">
      <img src="Icon.png" alt="Post It logo" />
      <h1>Post It!</h1>
      <button onClick={signInWithGoogle} className="app-link-button app-google-sign-in-button">
        <img src="google.png" alt="Google logo" />
        Sign in with Google
      </button>
    </div>
  );
};

export default App;