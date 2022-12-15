import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { API } from '../config';
import Router from 'next/router';

export const handleResponse = response => {
    if (response.status === 401) {
        signout(() => {
            Router.push({
                pathname: '/admin/signin',
                query: {
                    message: 'Your session has expired. Please signin'
                }
            });
        });
    }
};

export const singleUser = id => {
    return fetch(`${API}/user/${id}`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};


export const signup = user => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const signin = (user, captchaToken) => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user), captchaToken
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const signout = next => {
    removeCookie('token');
    removeLocalStorage('user');
    next();

    return fetch(`${API}/signout`, {
        method: 'GET'
    })
        .then(response => {
            console.log('signout success');
        })
        .catch(err => console.log(err));
};


export const getProfile = token => {
    return fetch(`${API}/user/profile`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

// set cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1
        });
    }
};

export const removeCookie = key => {
    if (process.browser) {
        cookie.remove(key, {
            expires: 1
        });
    }
};
// get cookie
export const getCookie = key => {
    if (process.browser) {
        return cookie.get(key);
    }
};
// localstorage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const removeLocalStorage = key => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
};
// autheticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
    setCookie('token', data.token);
    setLocalStorage('user', data.user);
    next();
};

export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                return false;
            }
        }
    }
};

// export const updateUser = (user, next) => {
//     if (process.browser) {
//         if (localStorage.getItem('user')) {
//             let auth = JSON.parse(localStorage.getItem('user'));
//             auth = user;
//             localStorage.setItem('user', JSON.stringify(auth));
//             next();
//         }
//     }
// };

export const forgotPassword = email => {
    return fetch(`${API}/forgot-password`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const resetPassword = resetInfo => {
    return fetch(`${API}/reset-password`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const contactFormSendEmail = (email, name, description) => {
    return fetch(`${API}/sendEmail`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email, name, description)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const careerFormSendEmail = (formData) => {
    return fetch(`${API}/sendApplication`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            // 'Content-Type': 'application/json',
        },
        
        body: formData
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const list = () => {
    return fetch(`${API}/users`, {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};