import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    setIsGuest(false);
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    setIsGuest(false);
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    setIsGuest(false);
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function loginAsGuest() {
    setIsGuest(true);
    setCurrentUser({
      uid: 'guest-user',
      email: 'guest@matcraft.local',
      displayName: 'Guest Coach'
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isGuest) {
        setCurrentUser(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isGuest]);

  const value = {
    currentUser,
    isGuest,
    signup,
    login,
    logout,
    resetPassword,
    loginAsGuest
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
