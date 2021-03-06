import {
FETCH_STREAM, FETCH_STREAMS, DELETE_STREAM, CREATE_STREAM, EDIT_STREAM
} from '../actions/types';
import _ from 'lodash';

export default (state= {}, action) => {
    switch (action.type){
        default:
            return state;
        case DELETE_STREAM:
            return _.omit(state, action.payload);
        case CREATE_STREAM:
            return {...state, [action.payload.id]: action.payload};
        case FETCH_STREAM:
            return {...state, [action.payload.id]: action.payload};    
        case EDIT_STREAM:    
            return {...state, [action.payload.id]: action.payload};
        case FETCH_STREAMS:
            return {...state, ..._.mapKeys(action.payload, 'id')};    

    }
};