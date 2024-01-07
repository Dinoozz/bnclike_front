import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import ProfileKeyword from '../components/ProfileKeywords';
import { AuthContext } from '../components/AuthContext'; // Assurez-vous que le chemin est correct
import { FaUser, FaUsers, FaBriefcase, FaEnvelope, FaLock } from 'react-icons/fa'; // Ensure react-icons is installed


const ProfilePage = () => {
    const navigate = useNavigate();
    const { logOut, getUserId } = useContext(AuthContext); // Utiliser getUserId ici
    const [cryptos, setCryptos] = useState([]);
    const [authorizedCryptos, setAuthorizedCryptos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        role: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editableUserInfo, setEditableUserInfo] = useState({ ...userInfo });


    useEffect(() => {
        const fetchCryptosAndAuthorized = async () => {
            try {
                const allCryptosResponse = await api.getAllCryptos();
                const authorizedResponse = await api.getUserAuthorizedCrypto();
                const authorizedIds = new Set(authorizedResponse.data.cryptos);

                const cryptosWithAuth = allCryptosResponse.data.map(crypto => ({
                    ...crypto,
                    isAuthorized: authorizedIds.has(crypto._id)
                }));

                setCryptos(cryptosWithAuth);
            } catch (error) {
                console.error('Erreur lors de la récupération des cryptos:', error);
            }
        };

        fetchCryptosAndAuthorized();
    }, []);

    useEffect(() => {
      fetchUserInfo();
      const userId = getUserId(); // Récupérer l'ID de l'utilisateur
      fetchUserInfo(userId);
    }, []);

    useEffect(() => {
        fetchUserInfo();
        const userId = getUserId();
        fetchUserInfo(userId);

        const fetchCryptos = async () => {
            try {
                let response = await api.getAllCryptos();
                setCryptos(response.data);
                response = await api.getUserAuthorizedCrypto();
            } catch (error) {
                console.error('Erreur lors de la récupération des cryptos:', error);
            }
        };

        fetchCryptos();
    }, [getUserId]);

    const fetchUserInfo = async (userId) => {
      if (!userId) return; // S'assurer que l'ID est présent

      try {
          const response = await api.getUserById(userId); // Modifier pour utiliser getUserById
          setUserInfo({
              username: response.data.username,
              email: response.data.email,
              role: response.data.role
          });
          setEditableUserInfo({
            username: response.data.username,
            email: response.data.email,
            role: response.data.role
        });
      } catch (error) {
          console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
      }
  };

  const handleLogout = async () => {
    try {
      await api.logout();

      // Fonction pour supprimer tous les cookies
      const deleteAllCookies = () => {
          const cookies = document.cookie.split(";");

        for (let cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
        // Supprimer tous les cookies accessibles
        document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
    });
      };
      // Supprimer tous les cookies
      deleteAllCookies();
      // Autres opérations de déconnexion
      logOut();
      localStorage.clear();
      navigate('/');
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
    };

    const handleCryptoClick = async (crypto) => {
        try {
            if (crypto.isAuthorized) {
                await api.removeCryptoToUser(crypto._id);
            } else {
                await api.addCryptoToUser(crypto._id);
            }
            // Mettre à jour l'état d'autorisation de la crypto dans le tableau
            setCryptos(cryptos.map(c => c._id === crypto._id ? { ...c, isAuthorized: !c.isAuthorized } : c));
        } catch (error) {
            console.error(`Erreur lors de la modification de l'autorisation de la crypto: ${crypto._id}`, error);
        }
    };

    const filteredCryptos = cryptos.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            // Remettre à zéro en cas d'annulation
            setEditableUserInfo({ ...userInfo });
        }
    };

    const handleInputChange = (e) => {
        setEditableUserInfo({ ...editableUserInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const userId = getUserId(); // Assurez-vous que getUserId retourne l'ID de l'utilisateur
            let updateData = {};
    
            // Ajouter des champs au body de la requête uniquement s'ils sont présents
            if (editableUserInfo.username) {
                updateData.username = editableUserInfo.username;
            }
            if (editableUserInfo.email) {
                updateData.email = editableUserInfo.email;
            }
            if (editableUserInfo.password) {
                updateData.password = editableUserInfo.password;
            }
    
            await api.updateUser(userId, updateData);
    
            // Mise à jour des infos de l'utilisateur après la modification
            setUserInfo({ ...userInfo, ...updateData });
            setIsEditing(false);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        }
    };
    

    return (
        <div className="container mt-4 mx-auto p-4 bg-white shadow rounded-lg flex flex-row w-[50vw] max-w-full">
            <div className='flex flex-col w-full'>
                <div className='flex mb-8'>
                    <div className="flex flex-col w-full mr-4">
                        <div className="mb-4 bg-blue-600 w-full py-10 flex items-center justify-center rounded-t-lg">
                            <FaUser className="text-white h-16 w-16" />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-800">{userInfo.username}</h1>
                        <div className="w-full flex flex-col p-4">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        name="username"
                                        value={editableUserInfo.username}
                                        onChange={handleInputChange}
                                        className="mb-2 p-2 border rounded"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={editableUserInfo.email}
                                        onChange={handleInputChange}
                                        className="mb-2 p-2 border rounded"
                                    />
                                    <input
                                        name="password"
                                        placeholder="Nouveau mot de passe"
                                        onChange={handleInputChange}
                                        className="mb-2 p-2 border rounded"
                                    />
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                                    >
                                        Valider
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center border-b py-2">
                                        <FaUser className="text-gray-400 mr-2" />
                                        <span className="flex-grow">{userInfo.username}</span>
                                    </div>
                                    <div className="flex items-center border-b py-2">
                                        <FaEnvelope className="text-gray-400 mr-2" />
                                        <span className="flex-grow">{userInfo.email}</span>
                                    </div>
                                    <div className="flex items-center border-b py-2">
                                        <FaBriefcase className="text-gray-400 mr-2" />
                                        <span className="flex-grow">Rôle : {userInfo.role}</span>
                                    </div>
                                    <button
                                        onClick={handleEditToggle}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Modifier le profil
                                    </button>
                                </>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                        >
                            Déconnexion
                        </button>
                    </div>

                    {/* Colonne du tableau de crypto-monnaies */}
                    <div className="flex flex-col w-full">
                        <input
                            type="text"
                            placeholder="Rechercher une crypto..."
                            className="mb-4 p-2  border-blue-500 rounded border-2"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="overflow-auto h-96  border-blue-500 rounded border-2">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th className="px-2">Crypto</th>
                                        {/* Autres en-têtes de colonne ici */}
                                    </tr>
                                </thead>
                                <tbody>
                                {filteredCryptos.map(crypto => (
                                        <tr 
                                            key={crypto._id} 
                                            onClick={() => handleCryptoClick(crypto)} 
                                            className={`cursor-pointer ${crypto.isAuthorized ? 'bg-green-200 hover:bg-green-300' : 'bg-red-200 hover:bg-red-300'}`}
                                        >
                                            <td className="px-2 flex items-center justify-start h-12">
                                                <img src={crypto.image} alt={crypto.name} className="h-6 w-6 mr-2" />
                                                <div>
                                                    <span className="font-medium">{crypto.symbol.toUpperCase()}</span>
                                                    <span className="text-sm text-gray-500 pl-2">{crypto.name}</span>
                                                </div>
                                            </td>
                                            {/* Autres cellules ici */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <ProfileKeyword/>
            </div>
        </div>
    );
};

export default ProfilePage;
