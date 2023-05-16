import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/Location/`;


const getLocations = async (orgId) => {
    return axios.get(API_URL + `GetLocations?organizationId=${orgId}`)
}
const addlocation = async (request) => {
    return axios.post(API_URL + `AddLocation`, request)
}


export default {
    getLocations,
    addlocation
};