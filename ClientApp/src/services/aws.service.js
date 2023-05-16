import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/AWS/`;

const UploadFileToAWS = async (request) => {

    return axios.post(API_URL + `UploadFileToAWS`, request)
}
const GetSignedUrl=async (key)=>{
    return axios.get(API_URL+`GetSignedUrl?key=${key}`)
}
export default {
    UploadFileToAWS,
    GetSignedUrl
}