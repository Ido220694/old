import { SIGN_IN, SIGN_OUT, CREATE_STREAM,
FETCH_STREAM, FETCH_STREAMS, DELETE_STREAM, EDIT_STREAM
} from "./types";
import streams from '../apis/streams';
import history from "../history";

export const signIn = (userId, userName) => {
    return {
        type: SIGN_IN,
        payload1: userId,
        payload2: userName
    };
};

export const signOut = () =>{
    return{
        type: SIGN_OUT
    };
};

export const createStream = (id, formValues) =>  async (dispatch, getState) =>{
    const {userId, userName} = getState().auth;
    const respone = await streams.post('/streams', {...formValues, userId, userName});
    dispatch({type: CREATE_STREAM, payload: respone.data});
    // const { id2 } = this.props.match.params;
    // console.log(respone.data.id);

    history.push(`/wait/${respone.data.id}`);
};

export const fetchStreams = () =>  async dispatch =>{

    const respone = await streams.get('/streams');
    dispatch({type: FETCH_STREAMS, payload: respone.data});
};

export const fetchStream = (id) =>  async dispatch =>{

    const respone = await streams.get(`/streams/${id}`);
    dispatch({type: FETCH_STREAM, payload: respone.data});
};

export const editStream = (id, formValues) =>  async dispatch =>{

    const respone = await streams.patch(`/streams/${id}`, formValues);
    dispatch({type: EDIT_STREAM, payload: respone.data});
    history.push('/');

};

export const deleteStream = (id) =>  async dispatch =>{

    await streams.delete(`/streams/${id}`);
    dispatch({type: DELETE_STREAM, payload: id});
    history.push('/');
};