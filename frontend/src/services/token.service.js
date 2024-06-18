import Cookies from 'js-cookie';

const tokenService = {
    setToken: (token, options = {}) => {
        Cookies.set('token', token, options);
    },

    getToken: () => {
        return Cookies.get('token');
    },

    removeToken: () => {
        Cookies.remove('token');
    }
};

export default tokenService;