import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

const LoadingPage = () => {
  const barStyle = {
    width: '2vw',
    height: '4vh',
    backgroundColor: 'darkblue',
    marginRight: '1vw',
    animation: 'bounce 0.6s infinite ease-in-out',
  };

  const barAnimation = {
    '@keyframes bounce': {
      '0%, 100%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(-2vh)',
      },
    },
  };

  // Ajouter l'animation dans une balise de style
  const animationStyle = `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-2vh);
      }
    }
  `;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: '../assets/bg-loading.webp',
      backgroundSize: 'cover',
      opacity: 0.5
    }}>
      <style>{animationStyle}</style>
      <div style={{ ...barStyle, animationDelay: '0s' }}></div>
      <div style={{ ...barStyle, animationDelay: '0.2s' }}></div>
      <div style={{ ...barStyle, marginRight: '0', animationDelay: '0.4s' }}></div>
    </div>
  );
};



export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getUserRole();
        if (response && response.role) {
          setIsLoggedIn(true);
          setUserRole(response.role);
        }
      } catch (error) {
        logOut();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const logIn = () => {
    setIsLoggedIn(true);
  };

  const logOut = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("JWToken");
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

