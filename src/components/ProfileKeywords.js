import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../api/api';
import { FaPlus, FaTrash } from 'react-icons/fa';

const KeywordsManager = () => {
    const { getUserId, userRole } = useContext(AuthContext);
    const [allKeywords, setAllKeywords] = useState([]);
    const [userKeywords, setUserKeywords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchKeywords();
    }, [getUserId]);

    const fetchKeywords = async () => {
        try {
            const userId = getUserId();
            const allKeywordsResponse = await api.getAllKeywords();
            const userKeywordsResponse = await api.get_keywords_by_userId(userId);
            
            const userKeywordIds = userKeywordsResponse.data.map(kw => kw._id);
            const filteredAllKeywords = allKeywordsResponse.data.filter(kw => !userKeywordIds.includes(kw._id));
            
            setAllKeywords(filteredAllKeywords);
            setUserKeywords(userKeywordsResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des mots-clés:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCreateKeyword = async () => {
        const body = { keyword: searchTerm };
        try {
            const response = await api.createKeyword(body);
            const body2 = { userId: getUserId()};
            await api.add_user_to_keyword(response.data._id, body2);
            setSearchTerm(''); // Réinitialiser la barre de recherche après la création
            fetchKeywords();
        } catch (error) {
            console.error('Erreur lors de la création du mot-clé:', error);
        }
    };

    const handleAddUserToKeyword = async (keywordId) => {
        try {
            const body = { userId: getUserId()};
            await api.add_user_to_keyword(keywordId, body);
            fetchKeywords(); // Actualiser les listes après l'ajout
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur au mot-clé:', error);
        }
    };

    const handleRemoveUserFromKeyword = async (keywordId) => {
        try {
            const body = { userId: getUserId()};
            await api.remove_user_to_keyword(keywordId, body);
            fetchKeywords(); // Actualiser les listes après la suppression
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur du mot-clé:', error);
        }
    };

    const handleDeleteKeyword = async (keywordId) => {
        try {
            await api.deleteKeywordById(keywordId);
            fetchKeywords(); // Actualiser les listes après la suppression
        } catch (error) {
            console.error('Erreur lors de la suppression du mot-clé:', error);
        }
    };

    const filteredAllKeywords = searchTerm
        ? allKeywords.filter(keyword => keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()))
        : allKeywords;

    const filteredUserKeywords = searchTerm
        ? userKeywords.filter(keyword => keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()))
        : userKeywords;


    return (
        <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center bg-gray-200 p-2 rounded">
                <input
                    type="text"
                    placeholder="Ajouter un mot-clé..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="p-2 w-full bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button onClick={handleCreateKeyword} className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                    <FaPlus />
                </button>
            </div>
            <div className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Tous les mots-clés</h3>
                <div className="flex flex-wrap gap-1 overflow-auto max-h-16">
                    {filteredAllKeywords.map((keyword) => (
                        <div key={keyword._id} className="flex items-center">
                            <span 
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full cursor-pointer"
                            onClick={() => handleAddUserToKeyword(keyword._id)}
                            >
                                {keyword.keyword}
                            {userRole === 'admin' && (
                                <button
                                    className="text-white cursor-pointer hover:bg-black hover:bg-black-600 rounded-full ml-2 p-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteKeyword(keyword._id);
                                    }}>
                                    <FaTrash/>
                                </button>
                            )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Mes mots-clés</h3>
                <div className="flex flex-wrap gap-1">
                    {filteredUserKeywords.map((keyword) => (
                        <div key={keyword._id} className="flex items-center">
                            <span
                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-full cursor-pointer"
                            onClick={() => handleRemoveUserFromKeyword(keyword._id)}
                            >
                                {keyword.keyword}
                            {userRole === 'admin' && (
                                <button
                                    className="text-white cursor-pointer hover:bg-black hover:bg-black-600 rounded-full ml-2 p-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteKeyword(keyword._id);
                                    }}>
                                    <FaTrash/>
                                </button>
                            )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KeywordsManager;