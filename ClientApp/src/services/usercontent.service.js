import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/UserContent/`;


const getContent = async (terms = "", offset = 0, limit = 10, userId = "", orgId = "",keyword="",topic="",language="",age="") => {
    return axios.get(API_URL + `GetContent?term=${terms}&offset=${offset}&limit=${limit}&orgId=${orgId}&userId=${userId}&topic=${topic}&keyword=${keyword}&language=${language}&age=${age}`)
}
const getContentbyId = async (contentId, token,ignoreToken=false,userId="",organizationId="") => {
    return axios.get(API_URL + `GetContentById?contentId=${contentId}&token=${token}&ignoreToken=${ignoreToken}&userId=${userId}&organizationId=${organizationId}`)
}
const getContentDetails = async (contentId) => {
    return axios.get(API_URL + `GetContentDetails?contentId=${contentId}`)
}


const CreateUpdateUserContent = async (request) => {
    return axios.post(API_URL + `CreateUpdateUserContent`, request)
}
const AddRequestToAccessLesson=async(request)=>{
    return axios.post(API_URL+`AddRequestToAccessLesson`,request)
}
const ApproveRequestToAccessLessson=async (requestId)=>{
    return axios.post(API_URL+`ApproveRequestToAccessLesson?requestId=${requestId}`)
}

export default {
    getContent,
    CreateUpdateUserContent,
    getContentbyId,
    getContentDetails,
    AddRequestToAccessLesson,
    ApproveRequestToAccessLessson
};