import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import api from '../api/api';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // État pour gérer les messages d'erreur
  const [isLogin, setIsLogin] = useState(true);
  const { logIn } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { assignUserRole } = useContext(AuthContext);
  const { assignUserID } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      // Redirigez l'utilisateur vers la page d'accueil s'il est déjà connecté
      navigate('/');
    }
  }, [logIn]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (error) setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (error) setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (error) setError(''); // Réinitialiser l'erreur lorsque l'utilisateur commence à taper
  };
  

  const handleLogin = async (event) => {
    event.preventDefault();
    const body = {
      email,
      password: password,
    };
  
    try {
      const response = await api.login(body);
      // Juste vérifier la réponse sans essayer de lire le cookie'
      if (response) { // ou un autre indicateur de succès envoyé par votre serveur
        //assignUserRole(response.data.role);
        //assignUserID(response.data.userId);
        logIn(); // Votre fonction de connexion, qui pourrait définir l'état connecté dans votre contexte d'authentification
        navigate('/'); // Rediriger vers la page d'accueil ou tableau de bord
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError(error ? error : "Login error");
    }
  };
  
  

  // Définir le style des inputs en cas d'erreur
  
  
  const handleRegister = async (event) => {
    event.preventDefault();
    const body = {
      "username": username,
      "email" : email,
      "password": password,
    };
    try {
      const response = await api.register(body);
      toggleForm()
    } catch (error) {
      setError(error ? error : "Register error");
      // Effectuez votre requête API ici
    };
  }
    
    const toggleForm = () => {
      setIsLogin(!isLogin);
    };
  const inputStyle = error ? "block w-full p-3 rounded bg-gray-200 border border-red-500 focus:outline-none" : "block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none";
    
  return (
    <div className="container mx-auto p-8 flex max-h-screen overflow-hidden">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl text-center mb-8 font-bold">{isLogin ? 'Login' : 'Register'}</h1>

        <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="p-8">
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              {!isLogin && (
                <div className="mb-5">
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-600">Username</label>
                  <input type="text" id="username" value={username} onChange={handleUsernameChange} className={inputStyle} />
                </div>
              )}

              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">Email</label>
                <input type="email" id="email" value={email} onChange={handleEmailChange} className={inputStyle} />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">Password</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} className={inputStyle} />
                {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>} {/* Afficher le message d'erreur ici */}
              </div>

              <button type="submit" className="w-full p-3 mt-4 bg-indigo-600 text-white rounded shadow">
                {isLogin ? 'Login' : 'Register'}
              </button>
            </form>
          </div>

          <div className="flex justify-between p-8 text-sm border-t border-gray-300 bg-gray-100">
            <button onClick={toggleForm} className="font-medium text-indigo-600">
              {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
