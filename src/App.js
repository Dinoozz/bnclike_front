import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './components/Menu'; // Importez le composant Menu
import { AuthProvider } from './components/AuthContext';
import HomePage from './page/HomePage'; // Importez vos autres composants de page
import LoginPage from './page/LoginPage';
import ProfilePage from './page/ProfilePage';
import SideMenu from './components/SideMenu';
import AdminPageTop100 from './page/AdminPageViewTop100crypto';
import UserManagerPage from './page/UserManagerPage';
import RssPage from './page/RssPage'
// Importez d'autres pages selon vos besoins

const App = () => {
  return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/rss" element={<RssPage />} />
            <Route path="/admin" element={<SideMenu />}>
              <Route path="top100" element ={<AdminPageTop100 />}/>
              <Route path="users" element ={<UserManagerPage />}/>
            </Route> */}
            // Ajoutez d'autres routes si nécessaire

              {/* Définissez d'autres routes selon vos besoins */}
          </Routes>
        </div>
      </Router>
  );
};

export default App;
