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
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-gray-800">
          <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <button type="button" className="relative inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                  <span className="absolute -inset-0.5"></span>
                  <span className="sr-only">Open main menu</span>
                  <svg className="block w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  <svg className="hidden w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0">
                  <img className="w-auto h-8" src="icon.png" alt="PostIt" />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <a href="#home" className="px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md" aria-current="page">Home</a>
                    <a href="#about" className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">About</a>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                <div className="relative ml-3">
                  <div>
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user && user.photoURL ? user.photoURL : "/default.png"}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-base font-medium text-white bg-gray-900 rounded-md" aria-current="page">Home</a>
              <a href="#about" className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">About</a>
            </div>
          </div>
        </nav>
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
      setUser(user);
      if (user) {
        navigate('/');
      }
    });
    return unsubscribe;
  }, [setUser, navigate]);
  return null;
};

const Home = ({ user }) => {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Welcome, {user.displayName}!</h2>
      <div className="space-y-4">
        <p>Choose an option to get started:</p>
        <div className="flex space-x-4">
          <a href="/client" className="block px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">Join</a>
          <a href="/host" className="block px-4 py-2 bg-green-500 rounded hover:bg-green-600">Host</a>
        </div>
      </div>
    </div>
  );
};

const SignIn = ({ signInWithGoogle, signInWithGithub }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="mb-8 text-4xl">Fast and easy</h1>
      <p className="mb-6">Simple yet effective brainstorming.</p>
      <button onClick={signInWithGoogle} className="inline-flex items-center px-4 py-2 mr-4 bg-red-600 rounded hover:bg-red-700">
        <img src="google.png" alt="Google" className="mr-2" /> Google
      </button>
      <button onClick={signInWithGithub} className="inline-flex items-center px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
        <img src="github.png" alt="GitHub" className="mr-2" /> GitHub
      </button>
    </div>
  </div>
);

export default App;