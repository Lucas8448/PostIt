import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';
import { auth, googleAuthProvider } from './firebaseConfig';
import { signInWithPopup } from "firebase/auth";
import { Analytics } from '@vercel/analytics/react';
import Host from './Host';
import Client from './Client';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const projectDetailsRef = useRef(null); 

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

  const renderProjectDetails = () => {
    return (
      <div className="app-container" id="project-details" ref={projectDetailsRef}>
        <h2>Discover the Idea Board</h2>
        <p>This is an innovative platform where you can anonymously share and develop ideas with others. It's a space for creativity and collaboration without any barriers.</p>
        
      </div>
    );
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

  return (
    <Router>
      <div className="app-nav">
        <div className="left">
          <div>{user && user.displayName}</div>
        </div>
        <div className="center">
        <div onClick={() => scrollToHome()}>Home</div>
        </div>
        {user && <SignOutButton />}
        <Analytics />
      </div>
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

const SignOutButton = () => {
  const navigate = useNavigate();

  const signOut = () => {
    auth.signOut().then(() => navigate('/'));
  };

  return (
    <button onClick={signOut} className="app-button">Sign out</button>
  );
}

const Home = ({ user }) => {
  const mainPageHome = useRef(null);

  
  return (
    <div className="app-container app-home-container" ref={mainPageHome}>
      <img src="Icon.png" id="logo" alt="Post It logo" />
      <div className="headLine">Welcome, {user && user.displayName}!</div>
      <h5>Select one of the following to begin</h5>
      <Link to="/host" className="app-link-button app-home-link">Host</Link>
      <Link to="/client" className="app-link-button2 app-home-link">Join</Link>
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