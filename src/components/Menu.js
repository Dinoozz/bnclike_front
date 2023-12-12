import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import logo from '../assets/logo.png';
import profile from '../assets/profile.png';


const Menu = () => {
  const { isLoggedIn , userRole} = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center fixed w-full">
      <div className="flex items-center">
        
        <Link to="/"><img src={logo} alt="Logo" className="h-12 w-12 mr-2" /></Link>
        <Link to="/page1" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Page SCD</Link>
        <Link to="/page2" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Page 2</Link>
        <Link to="/page3" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Page 3</Link>
        { isLoggedIn && userRole === 'admin' && <Link to="/admin" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Admin Dashboard</Link>}
      </div>
      <div className="flex items-center">
        {!isLoggedIn && <Link to="/login" className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">Se connecter</Link>}
        {isLoggedIn && <Link to="/profile" className="ml-4 flex items-center justify-center bg-gray-700 text-white rounded-full h-10 w-10">
            <img src={profile} alt="Profile" className="p-1 h-full w-full" /></Link>}
      </div>
    </nav>
  );
};

export default Menu;
