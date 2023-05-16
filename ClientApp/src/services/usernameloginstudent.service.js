import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/UserNameLoginStudent/`;


// const getStudentRequests = async (terms = "", offset = 0, limit = 10, userId = 0) => {
//     return axios.get(`https://mocki.io/v1/93dcfa9a-b7e9-472a-9e1a-427a0da9e01a`)
// }


const getUserNameLoginRequests = async (orgId = 0, parentId = 0) => {
    return axios.get(API_URL + `GetUsernameLoginRequests?organizationId=${orgId}&parentId=${parentId}`)
}


const CreateUserNameLoginStudentRequest = async (request) => {
    return axios.post(API_URL + `CreateUserNameLoginStudentRequest`, request)
}

const updateUserNameLoginRequest = async (userId, request) => {
    return axios.post(API_URL + `UpdateUsernameLoginRequest?loggedInUserId=${userId}`, request)
}

const deleteUserNameLoginRequest = async (userId) => {
    return axios.delete(API_URL + `DeleteUsernameLoginStudentRequest?userNameLoginId=${userId}`)
}


export default {
    CreateUserNameLoginStudentRequest,
    getUserNameLoginRequests,
    updateUserNameLoginRequest,
    deleteUserNameLoginRequest
};