import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/Class/`;

const UpdateLessonGuid = async (lessonId) => {
    return axios.post(API_URL + `UpdateLessonGuid?lessonId=${lessonId}`)
}
const SaveUserClassStatus = async (userId, courseScheduleDetailsId) => {
    return axios.post(API_URL + `SaveUserClassStatus?userId=${userId}&courseScheduleDetailsId=${courseScheduleDetailsId}`)
}
const DeleteUserClassStatus = async (OnGoingClassForUserId) => {
    return axios.delete(API_URL + `DeleteUserClassStatus?OnGoingClassForUserId=${OnGoingClassForUserId}`)
}
const GetUserClassStatus = async (userId) => {
    return axios.get(API_URL + `GetUserClassStatus?userId=${userId}`)
}

export default {
    UpdateLessonGuid,
    SaveUserClassStatus,
    DeleteUserClassStatus,
    GetUserClassStatus
}