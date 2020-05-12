import * as actionTypes from '../../store/actions/actionTypes';
import { updatedObject } from '../../shared/utility';

const initialState = {
    posts: [],
    loading: true,
    error: null
};

const fetchOrdersStart = ( state, action ) => {
    return updatedObject( state, { loading: true } );
};

const fetchOrdersSuccess = ( state, action ) => {
    return updatedObject( state, {
        posts: action.posts,
        loading: false
    } );
};

const fetchOrdersFail = ( state, action ) => {
    return updatedObject( state, { loading: false, error: action.error } );
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.FETCH_POSTS_START: return fetchOrdersStart( state, action );
        case actionTypes.FETCH_POSTS_SUCCESS: return fetchOrdersSuccess( state, action );
        case actionTypes.FETCH_POSTS_FAIL: return fetchOrdersFail( state, action );
        default: return state;
    }
};

export default reducer;
