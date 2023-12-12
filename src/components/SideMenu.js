import React, { useContext, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const SideMenu = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook pour la navigation

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/'); // Redirige vers la page d'accueil si l'utilisateur n'est pas connecté
    }
  }, [isLoggedIn, navigate]); // Dépendances de useEffect

  return (
    <div className="flex pt-20">
      <nav className="bg-gray-800 p-4 flex flex-col fixed h-full">
        <Link to="/admin/top100" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Top100</Link>
        <Link to="/admin/users" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">User Manager</Link>
        <Link to="/admin" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Page 3</Link>
      </nav>
      <div className="content ml-[12vw] w-full mr-4">
        <Outlet />
      </div>
    </div>
  );
};

export default SideMenu;
