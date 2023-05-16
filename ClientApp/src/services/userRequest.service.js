import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/UserRequest/`;


const GetUserRequestsForApproval = async (orgId, offset = 0, limit = 10) => {
    return axios.get(API_URL + `GetUserRequestsForApproval?organizationId=${orgId}&offset=${offset}&limit=${limit}`)
}

const AddUserRequest = async (request) => {
    return axios.post(API_URL + `AddUserRequest`, request)
}

const SetUserRequestApprovalStatus = async (request) => {
    return axios.post(API_URL + `SetUserRequestApprovalStatus`, request)
}



export default {
    GetUserRequestsForApproval,
    AddUserRequest,
    SetUserRequestApprovalStatus
};