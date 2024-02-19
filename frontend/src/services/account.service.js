const saveToken = (token) => {
    localStorage.setItem('token', token);
};

const removeToken = () => {
    localStorage.removeItem('token');
};

const getValuesToken = () => {
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const valuesToken = JSON.parse(window.atob(base64));
    return valuesToken;
};

export const accountService = {
    saveToken,
    removeToken,
    getValuesToken,
};