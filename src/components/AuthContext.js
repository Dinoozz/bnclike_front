import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

function timeout(delay) {
  return new Promise( res => setTimeout(res, delay) );
}

const LoadingPage = () => {
  const barStyle = {
    width: '1vw',
    height: '8vh',
    backgroundColor: 'gold',
    marginRight: '1vw',
    animation: 'bounce 0.6s infinite ease-in-out',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.6)', // Ombre portée
    opacity: 0.9, // Légère transparence pour le fondu
    transition: 'opacity 0.3s', // Transition en douceur de l'opacité
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
      backgroundImage: 'url("https://files.oaiusercontent.com/file-n6bwgiLsJlPzudCJJXUXGzJw?se=2023-12-11T15%3A54%3A18Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D20a1f56b-25b0-47e9-b2bc-844d402f2f70.webp&sig=XjmiFDqffLFlHgY2IHqLcAvA8g/28wlytEvALcKPZws%3D")',
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
  const [userId, setUserId] = useState(null);
  const [convCurrency, setConvCurrency] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response2 = await api.getEurDol();
        if (response2 && response2.data.usd.eur) {
          localStorage.setItem("EURDOLCONV", response2.data.usd.eur.toString());
        }
        const response = await api.getUserRole();
        if (response && response.data.role) {
          setIsLoggedIn(true);
          setUserRole(response.data.role);
          setUserId(response.data.id);
        }        
        const response3 = await api.getUserById(response.data.id);
        if (response3 && response3.data.vs_currency) {
          if (response3.data.vs_currency === "eur") {
            setConvCurrency("€");
          } else if (response3.data.vs_currency === "usd") {
            setConvCurrency("$");
          } else {
            setConvCurrency("€");
          }
        } else {
          setConvCurrency("€");
        }
      } catch (error) {
        setConvCurrency("€")
        logOut();
      } finally {
        await timeout(1000);
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

  const assignUserRole = (role) => {
    setUserRole(role);
  };

  const assignUserID = (id) => {
    setUserId(id);
  };

  const assignConvCurrency = (currency) => {
    setConvCurrency(currency);
  };

  const getUserId = () => userId;

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, userRole, userId, convCurrency, assignUserRole, assignUserID, getUserId, assignConvCurrency }}>
      {children}
    </AuthContext.Provider>
  );
};

