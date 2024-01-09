import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';
import { auth, googleAuthProvider, githubAuthProvider } from './firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import { Analytics } from '@vercel/analytics/react';
import Host from './Host';
import Client from './Client';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const signInWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubAuthProvider);
    } catch (error) {
      console.error("Error signing in with Github", error);
    }
  };

  return (
    <Router>
      <Analytics />
      <div className="app-nav">
        <div className="left">
          <div>{user && user.displayName}</div>
        </div>
        <div className="center">
        <div onClick={() => scrollToHome()}>Home</div>
        </div>
        {user && <SignOutButton />}
      </div>
      <Routes>
        {user ? (
          <>
            <Route 
              path="/host" 
              element={<Host 
                owner={user.uid} 
                owner_email={user.email} 
              />} 
            />
            <Route 
              path="/client" 
              element={<Client 
                submitter={user.displayName} 
                submitter_email={user.email} 
              />} 
            />
            <Route path="/" element={<Home user={user} />} />
          </>
        ) : (
          <Route path="/" element={<SignIn signInWithGoogle={signInWithGoogle} signInWithGithub={signInWithGithub}/>} />
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
    <button onClick={signOut} className="app-button">Sign out<span className="material-symbols-outlined">logout</span></button>
  );
}

const Home = ({ user }) => {
  const mainPageHome = useRef(null);

  
  return (
    <div className="app-container app-home-container" ref={mainPageHome}>
      <img src="Icon.png" id="logo" alt="Post It logo" />
      <div className="headLine">Welcome, {user && user.displayName}!</div>
      <h5>Select one of the following to begin</h5>
      <Link to="/host" className="app-link-button app-home-link">Host It<span className="material-symbols-outlined">dns</span></Link>
      <Link to="/client" className="app-link-button2 app-home-link">Join It<span className="material-symbols-outlined">devices</span></Link>
      <div className="right">
        <div className="post-it">
          <p className="sticky taped">
            <strong>Post it</strong><br></br>
          Fast and easy way to share ideas with others.
          </p>
        </div>
        <div className="post-it">
          <p className="note">
          <strong>Post it</strong><br></br>
          Express your creativity.
          </p>
        </div>
      </div>
    </div>
  );
};

const SignIn = ({ signInWithGoogle, signInWithGithub }) => {
  return (
    <div className="app-container app-sign-in-container">
      <img src="Icon.png" alt="Post It logo" />
      <h1>Post It!</h1>
      <button onClick={signInWithGoogle} className="app-link-button app-google-sign-in-button">
        <img src="google.png" alt="Google logo" />
        Sign in with Google
      </button>
      <button onClick={signInWithGithub} className="app-link-button app-github-sign-in-button">
        <img src="github.png" alt="Github logo" />
        Sign in with Github
      </button>
    </div>
  );
};

export default App;