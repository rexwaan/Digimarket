import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/Organization/`;


const getOrganizations = async (terms = "", offset = 0, limit = 10, userId = "",type="",country="") => {
    return axios.get(API_URL + `GetOrganization?terms=${terms}&offset=${offset}&limit=${limit}&userId=${userId}&type=${type}&country=${country}`)
}

const getOrganizationbyUserId = async (userID, isParent = false) => {
    return axios.get(API_URL + `GetOrganizations?userID=${userID}&isParent=${isParent}`)
}
const getSingleOrganization = async (orgId) => {
    return axios.get(API_URL + `GetSingleOrganization?orgId=${orgId}`)
}

const activateOrganization = async (orgId, userID) => {
    return axios.get(API_URL + `ActivateOrganization?orgId=${orgId}&userID=${userID}`)
}
const createOrganization = async (request) => {
    return axios.post(API_URL + `CreateOrganization`, request)
}
const getOrganizationRequests = async (offset = 0, limit = 10) => {
    return axios.get(API_URL + `GetOrganizationsForApproval?offset=${offset}&limit=${limit}`)
}
const setOrganizationApprovalStatus = async (request) => {
    return axios.post(API_URL + "SetOrganizationApprovalStatus", request)
}
const DeleteOrganization = async (orgId) => {
    return axios.delete(API_URL + `DeleteOrganization?organizationId=${orgId}`)
}



export default {
    getOrganizations,
    getOrganizationRequests,
    getOrganizationbyUserId,
    createOrganization,
    activateOrganization,
    setOrganizationApprovalStatus,
    getSingleOrganization,
    DeleteOrganization
};