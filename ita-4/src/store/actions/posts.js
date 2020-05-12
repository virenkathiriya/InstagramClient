import * as actionTypes from './actionTypes';
import axios from 'axios';

export const fetchPostsSuccess = ( posts ) => {
    return {
        type: actionTypes.FETCH_POSTS_SUCCESS,
        posts: posts
    };
};

export const fetchPostsFail = ( error ) => {
    return {
        type: actionTypes.FETCH_POSTS_FAIL,
        error: error
    };
};

export const fetchPostsStart = () => {
    return {
        type: actionTypes.FETCH_POSTS_START
    };
};

export const fetchPosts = (token, userId) => {
    return dispatch => {
        dispatch(fetchPostsStart());
        const queryParams = '?auth=' + token;
        axios.get( 'https://instaapp-f2238.firebaseio.com//posts.json' + queryParams)
            .then( res => {
                const fetchedPosts = [];
                for ( let key in res.data ) {
                    fetchedPosts.push( {
                        ...res.data[key],
                        id: key
                    } );
                }
                dispatch(fetchPostsSuccess(fetchedPosts));
            } )
            .catch( err => {
                console.log(err);
                dispatch(fetchPostsFail(err));
            });
    };
};
