import API from './api.js';

const API_URL = 'http://localhost:8080/api/test/';

class UserService {
    getUserContent() {
        return API.get(API_URL + 'user-data');
    }
}

export default new UserService();
