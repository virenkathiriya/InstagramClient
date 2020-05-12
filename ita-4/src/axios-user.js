import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://instaapp-f2238.firebaseio.com/'
});

export default instance;
