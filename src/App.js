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
      <div className="app-nav">
        <div>{user && user.displayName}</div>
        {user && <SignOutButton />}
      </div>
      <Routes>
        {user ? (
          <>
            <Route path="/host" element={<Host />} />
            <Route path="/client" element={<Client />} />
            <Route path="/" element={<Home />} />
          </>
        ) : (
          <Route path="/" element={<SignIn signInWithGoogle={signInWithGoogle} />} />
        )}
      </Routes>
    </Router>
  );
};

const SignOutButton = () => {
  const navigate = useNavigate();

  const signOut = () => {
    auth.signOut().then(() => navigate('/'));
  };

  return (
    <button onClick={signOut} className="app-button">Sign out</button>
  );
}

const Home = () => {
  return (
    <div className="app-container app-home-container">
      <Link to="/host" className="app-link-button app-home-link">Host</Link>
      <Link to="/client" className="app-link-button app-home-link">Join</Link>
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