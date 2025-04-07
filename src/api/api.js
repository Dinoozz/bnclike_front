import axios from 'axios';

// URL de votre API Flask
const API_BASE_URL = 'http://rasp:5000';  // Remplacez par l'adresse IP ou URL correcte

// Fonction générique pour envoyer des requêtes API
const sendRequest = async (method, endpoint, data = {}) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await axios({
            method,
            url,
            data,
            headers: {
                'x-api-key': 'test', // Clé API définie dans votre application Flask
                'Content-Type': 'application/json'
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erreur lors de la requête API:', error);
        throw error.response ? error.response.data : new Error('Une erreur est survenue');
    }
};

const api = {
    async up() {
        return sendRequest('get', '/status'); // open post
    },
    async down() {
        return sendRequest('get', '/status'); // close post
    },
    async status() {
        return sendRequest('get', '/status');
    }
};

export default api;