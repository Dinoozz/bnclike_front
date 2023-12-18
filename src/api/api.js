import axios from 'axios';


const API_BASE_URL = 'https://api2.camille-lecoq.com/api';

const sendRequest = async (method, endpoint, data = {}) => {
    try {
        axios.defaults.withCredentials = true
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await axios({ method, url, data});
        if (response.status === 206)
            axios.defaults.withCredentials = false
        return response;
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error occurred');
    }
};

const sendRequestWithoutAuth = async (method, endpoint, data = {}) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(url);
        const response = await axios({ method, url, data });
        if (response) {
            console.log(response.status);
            return response;;
        }
        throw new Error();
    } catch (error) {
        throw error.response ? error.response.data : new Error('An error occurred');
    }
};

const api = {
    /* Auth Methods */
    async register(user) {
        return sendRequestWithoutAuth('post', '/auths/register', user);
    },

    async login(user) {
        return sendRequestWithoutAuth('post', '/auths/login', user);
    },

    async logout() {
        return sendRequest('post', '/auths/logout', {});
    },

    /* CRUD user */
    async createUser(user) {
        return sendRequest('post', '/users', user);
    },

    async getAllUsers() {
        return sendRequest('get', '/users');
    },

    async getUserById(userId) {
        return sendRequest('get', `/users/${userId}`);
    },

    async updateUser(userId, user) {
        console.log("user:", user);
        return sendRequest('put', `/users/${userId}`, user);
    },

    async deleteUser(userId) {
        return sendRequest('delete', `/users/${userId}`);
    },

    /* Retrieve crypto's infos */

    async getTop100 () {
        return sendRequest('get', `/cryptos/coin-gueko/top100`);
    },

    /* CRUD for Cryptos */
    async createCrypto(crypto) {
        return sendRequest('post', '/cryptos', crypto);
    },

    async getCryptoById(cryptoId) {
        return sendRequest('get', `/cryptos/${cryptoId}`);
    },

    async updateCrypto(cryptoId, cryptoData) {
        return sendRequest('put', `/cryptos/${cryptoId}`, cryptoData);
    },

    async deleteCrypto(cryptoId) {
        return sendRequest('delete', `/cryptos/${cryptoId}`);
    },

    async getAllCryptos() {
        return sendRequest('get', '/cryptos');
    },

    async getCryptoHistory(coinId) {
        return sendRequest('get', `/cryptos/history/${coinId}`);
    },

    async getUserRole() {
        return sendRequest('get','/users/info/role')
    },

    async getCryptoData(cryptoDatas) {
        return sendRequest('get', '/cryptodatas', cryptoDatas)
    }


    // ... ici, vous pouvez continuer avec d'autres méthodes si nécessaire
};

export default api;