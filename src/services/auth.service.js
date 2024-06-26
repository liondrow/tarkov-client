import API from './api.js';

const LOGIN_URL = 'login_check';

class AuthService {
    login(user) {
        return API
            .post(LOGIN_URL, {
                username: user.username,
                password: user.password
            })
            .then(async response => {
                if (response.data.token) {
                    await localStorage.setItem('token', JSON.stringify(response.data.token));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('token');
    }
}

export default new AuthService();
