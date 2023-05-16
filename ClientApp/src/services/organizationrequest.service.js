import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/OrganizationRequest/`;


const addOrganizationRequest = async (request) => {
    return axios.post(API_URL + "AddOrganizationRequest", request)
}
const editOrganizationRequest = async (request) => {
    return axios.post(API_URL + "EditOrganizationRequest", request)
}
const getOrganizationRequestDetails = async (organizationRequestId) => {
    return axios.get(API_URL + `GetOrgEmail/?orgId=${organizationRequestId}`)
}
const ApproveRejectOrganizationEditRequest = async (organizationRequestId, isApproved, userId) => {
    return axios.patch(API_URL + `ApproveRejectOrganizationEditRequest/?organizationRequestId=${organizationRequestId}&isApproved=${isApproved}&userId=${userId}`)
}



export default {
    addOrganizationRequest,
    getOrganizationRequestDetails,
    editOrganizationRequest,
    ApproveRejectOrganizationEditRequest
};