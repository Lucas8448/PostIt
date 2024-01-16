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
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-blue-500 p-4">
          {!user && (
            <div className="text-white">
              <Link to="/">Post it</Link>
            </div>
          )}
          <div className="text-white">
            <div>{user && user.displayName}</div>
            <ul className="flex space-x-4">
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
        <Routes>
          {user ? (
            <>
              <Route
                path="/host"
                element={<Host owner={user.uid} owner_email={user.email} />}
              />
              <Route
                path="/client"
                element={<Client submitter={user.displayName} submitter_email={user.email} />}
              />
              <Route
                path="/database"
                element={<DatabaseSchema />}
              />
              <Route path="/" element={<Home user={user} />} />
            </>
          ) : (
            <Route path="/" element={<SignIn signInWithGoogle={signInWithGoogle} signInWithGithub={signInWithGithub} />} />
          )}
        </Routes>
      </div>
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
    <button onClick={signOut} className="bg-red-500 text-white px-2 py-1 rounded-md">
      Sign out
    </button>
  );
}

const Home = ({ user }) => {
  const mainPageHome = useRef(null);

  return (
    <div ref={mainPageHome}>
      <section id="home">
        <div>Welcome, {user && user.displayName}!</div>
        <h5 className="text-xl">Select one of the following to begin</h5>
        <Link to="/client" className="text-blue-500 hover:underline">Join</Link>
        <Link to="/host" className="text-blue-500 hover:underline">Host</Link>
        <div className="flex space-x-4 mt-4">
          <div>
            <p>
              <strong>Join</strong><br></br>
              Join a server to share and make ideas with others.
            </p>
          </div>
          <div>
            <p>
              <strong>Host</strong><br></br>
              Host a server to share and make ideas with others.
            </p>
          </div>
        </div>
      </section>
      <section id="about">
      </section>
      <footer className="bg-blue-500 text-white p-4">
        {/* Site footer */}
        <div className="flex justify-between">
          <div>
            <div>
              <h6 className="font-semibold">Quick Links</h6>
              <ul className="space-y-2">
                <li>
                  <a href="/">Guide</a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div>
              <p>
                Copyright owners Lucas Bateson, Max T.Aarre, Nicklas F.H &amp;
                Ines T.© 2024 All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SignIn = ({ signInWithGoogle, signInWithGithub }) => {
  return (
    <div>
      <div>
        <section id="home">
          <div className="flex items-center space-x-4">
            <div>
              <div>
                <h1 className="text-4xl font-semibold">Fast and easy</h1>
                <p>
                  Simple yet effective brainstorming. Easy join and hosting to
                  express and share your ideas with others.
                </p>
                <h4 className="text-lg font-semibold mt-4">Sign in with:</h4>
                <div className="flex space-x-4 mt-2">
                  <button onClick={signInWithGoogle} className="bg-red-500 text-white px-2 py-1 rounded-md">
                    <img src="google.png" alt="Google logo" className="w-5 h-5 mr-1" />
                    Google
                  </button>
                  <p>or</p>
                  <button onClick={signInWithGithub} className="bg-gray-800 text-white px-2 py-1 rounded-md">
                    <img src="github.png" alt="Github logo" className="w-5 h-5 mr-1" />
                    Github
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section id="about">
        <div className="flex items-center space-x-4">
          <div>
            <span>About us</span>
            <h2 className="text-2xl font-semibold">
              About <span>Our Company</span>
            </h2>
            <p>
              Our solution Post-it is to empower individuals and teams to freely
              express and develop their ideas in an anonymous and collaborative
              environment.
            </p>
          </div>
        </div>
      </section>
      <footer className="bg-blue-500 text-white p-4">
        {/* Site footer */}
        <div className="flex justify-between">
          <div>
            <div>
              <h6 className="font-semibold">Quick Links</h6>
              <ul className="space-y-2">
                <li>
                  <a href="#">Guide</a>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div>
              <p>
                Copyright owners Lucas Bateson, Max T.Aarre, Nicklas F.H &amp;
                Ines T.© 2024 All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;