import { GET_USERS, DELETE_USERS, LOADING } from "./users.types";

const INITIAL_STATE = {
    list: [],
    loading: false
}

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_USERS:
            return {
                ...state,
                list: action.payload
            }

        case DELETE_USERS:
            return  {
                ...state,
                list: action.payload
            }
        case LOADING:
            return {
                ...state,
                loading: action.payload
            }
        default:
            return state;
    }
}

export default reducer;
