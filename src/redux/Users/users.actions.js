import { GET_USERS, DELETE_USERS, LOADING } from "./users.types";

export const delay = (ms) => new Promise(
        (resolve) => setTimeout(resolve, ms)
);

export const getUsers = (data) => {
    return {
        type: GET_USERS,
        payload: data
    }
};

export const deleteUsers = (data) => {
    return {
        type: DELETE_USERS,
        payload: data
    }
};

export const loadingData = (status) => {
    return {
        type: LOADING,
        payload: status
    }
};
