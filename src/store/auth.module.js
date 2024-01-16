import AuthService from '../services/auth.service';

const token = JSON.parse(localStorage.getItem('token'));
const initialState = token
    ? { status: { loggedIn: true }, token }
    : { status: { loggedIn: false }, token: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, token) {
            return AuthService.login(token).then(
                token => {
                    commit('loginSuccess', token);
                    return Promise.resolve(token);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                }
            );
        },
        logout({ commit }) {
            console.log('zalupa');
            AuthService.logout();
            commit('logout');
        }
    },
    mutations: {
        loginSuccess(state, token) {
            state.status.loggedIn = true;
            state.token = token;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.token = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.token = null;
        }
    }
};
