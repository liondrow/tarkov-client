import {API} from './api.js';

const LOGIN_URL = 'login_check';

class AuthService {
    login(user) {
        return API
            .post(LOGIN_URL, {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('token', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('token');
    }
}

export default new AuthService();
