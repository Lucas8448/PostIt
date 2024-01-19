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
import DatabaseSchema from './resources/DatabaseSchemas';
import Presentation from './resources/Presentation';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <AuthHandler setUser={setUser} />
      <Analytics />
      <div className="landing-page">
        <header>
          {!user && (
              <div className="container">
                <a href="#" className="logo">
                  Post <b>it</b>
                </a>
              </div>
            )}
          <div className="container">
            <div>{user && user.displayName}</div>
              <ul className="links">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About us</a>
                </li>
              </ul>
              {user && <SignOutButton />}
          </div>
        </header>
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
            <Route path="/resources/database" element={<DatabaseSchema />}/>
            <Route path="/resources/presentation" element={<Presentation />}/>
            <Route path="/" element={<Home user={user} />} />
          </>
        ) : (
          <Route path="/" element={<SignIn signInWithGoogle={signInWithGoogle} signInWithGithub={signInWithGithub}/>} />
        )}
      </Routes>
    </Router>
  );
};

const AuthHandler = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && (user.email || user.displayName)) {
        setUser(user);
      } else {
        setUser(null);
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [setUser, navigate]);

  return null;
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
      <section id="home">
        <div className="background">
          <img src="Background.png" />
        </div>
        <div className="pin">
          <img src="icon2.png" />
        </div>
        <div className="headLine">Welcome, {user && user.displayName}!</div>
        <h5>Select one of the following to begin</h5>
        <Link to="/client" className="app-link-button2 app-home-link">Join<span className="material-symbols-outlined">dns</span></Link>
        <Link to="/host" className="app-link-button app-home-link">Host<span className="material-symbols-outlined">devices</span></Link>
        <div className="right">
          <div className="post-it">
            <p className="sticky taped">
              <strong>Join</strong><br></br>
            Join a server to share and make ideas with others.
            </p>
          </div>
          <div className="post-it">
            <p className="note">
            <strong>Host</strong><br></br>
            Host a server to share and make ideas with others.
            </p>
          </div>
        </div>
      </section>
      <section id="about">
        <div className="wrapper">
          <div className="picture">
            <div className="image">
              <img src="About.png" />
            </div>
          </div>
          <div className="text">
            <span className="about-header">About us</span>
            <h2>
              About <span className="blue">Our Company</span>
            </h2>
            <p>
              Our solution Post-it is to empower individuals and teams to freely
              express and develop their ideas in an anonymous and collaborative
              environment.
            </p>
          </div>
        </div>
      </section>
      <footer>
        {/* Site footer */}
        <footer className="site-footer">
          <div className="container">
            <div className="row">
              <div className="row3">
                <h6>Quick Links</h6>
                <ul className="footer-links">
                  <li>
                    <a href="#">Guide</a>
                  </li>
                </ul>
              </div>
            </div>
            <hr />
          </div>
          <div className="container">
            <div className="row">
              <div className="row4">
                <p className="copyright-text">
                  Created by Lucas Bateson, Max T.Aarre, Nicklas F.Hagen &amp; Ines Touiti.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </footer>
    </div>
  );
};

const SignIn = ({ signInWithGoogle, signInWithGithub }) => {
  return (
    <div className="app-container app-sign-in-container">
      <div className="landing-page">
        <section id="home">
          <div className="content">
            <div className="container">
              <div className="info">
                <div className="holder">
                  <img
                    src="FastB.png"
                    alt="Fast and easy"
                    width="100px"
                    height="100px"
                  />
                  <img
                    src="FastG.png"
                    alt="Fast and easy"
                    width="100px"
                    height="100px"
                  />
                </div>
                <h1>Fast and easy</h1>
                <p>
                  Simple yet effective brainstorming. Easy join and hosting to
                  express and share your ideas with others.
                </p>
                <h4>Sign in with:</h4>
                <div className="buttons">
                <button onClick={signInWithGoogle} className="app-link-button3 app-google-sign-in-button">
                    <img src="google.png" alt="Google logo" />
                    Google
                  </button>
                  <p>or</p>
                  <button onClick={signInWithGithub} className="app-link-button3 app-github-sign-in-button">
                    <img src="github.png" alt="Github logo" />
                    Github
                  </button>
                </div>
              </div>
              <div className="image">
                <img src="Logo.png" />
              </div>
            </div>
          </div>
        </section>
      </div>
      <section id="about">
        <div className="wrapper">
          <div className="picture">
            <div className="image">
              <img src="About.png" />
            </div>
          </div>
          <div className="text">
            <span className="about-header">About us</span>
            <h2>
              About <span className="blue">Our Company</span>
            </h2>
            <p>
              Our solution Post-it is to empower individuals and teams to freely
              express and develop their ideas in an anonymous and collaborative
              environment.
            </p>
          </div>
        </div>
      </section>
      <footer>
        {/* Site footer */}
        <footer className="site-footer">
          <div className="container">
            <div className="row">
              <div className="row3">
                <h6>Quick Links</h6>
                <ul className="footer-links">
                  <li>
                    <a href="#">Guide</a>
                  </li>
                </ul>
              </div>
            </div>
            <hr />
          </div>
          <div className="container">
            <div className="row">
              <div className="row4">
                <p className="copyright-text">
                  Created by Lucas Bateson, Max T.Aarre, Nicklas F.Hagen &amp; Ines Touiti.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </footer>
    </div>
  );
};

export default App;