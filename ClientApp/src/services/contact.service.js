import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/ContactUs/`;


const AddContactUsRequest = async (request) => {
    return axios.post(API_URL + "AddContactUsRequest", request)
}
const GetContactUsList = async (orgId,getArchivedAlso) => {
    return axios.get(API_URL + `GetContactUsList?organizationId=${orgId}&getArchivedAlso=${getArchivedAlso}`)
}
const ArchiveContactUs=async (contactUsId,archive)=>{
    return axios.patch(API_URL+`ArchiveContactUs?contactUsId=${contactUsId}&archive=${archive}`)
}

const DeleteContactUs=async (contactUsId)=>{
    return axios.delete(API_URL+`DeleteContactUs?contactUsId=${contactUsId}`)
}


export default {
    AddContactUsRequest,
    GetContactUsList,
    ArchiveContactUs,
    DeleteContactUs
};