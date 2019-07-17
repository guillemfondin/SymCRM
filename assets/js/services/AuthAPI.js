import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { USERS_API, LOGIN_API } from '../config';

/**
 * Suppression du token du local storage et sur axios
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

function create(user) {
    return axios.post(USERS_API, user)
                .then(response => response.data);
}

/**
 * Requête HTTP d'auth et stockage du token dans le local storage en local
 * 
 * @param {object} credentials 
 */
function authenticate(credentials) {
    return axios.post(LOGIN_API, credentials)
                             .then(response => response.data.token)
                             .then(token => {
                                 window.localStorage.setItem("authToken", token);
                                 setAxiosToken(token);
                             })
    ;
}

/**
 * Positionne le token sur axios
 * 
 * @param {string} token 
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Permet de savoir si on est authentifié ou pas
 * 
 * @returns {bool}
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {exp} = jwtDecode(token);
        if (exp * 1000 > new Date().getTime()) {
            return token;
        } else {
            return false;
        }
    }
}

/**
 * Mise en place du token sur l'application
 */
function setup() {
    if (isAuthenticated()) {
        setAxiosToken(isAuthenticated());
    }
}

export default {
    authenticate,
    create,
    logout,
    isAuthenticated,
    setup
}