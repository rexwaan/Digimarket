import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/CourseType/`;

const getCourses = async (courseId = 0, offset = 0, limit = 10, orgId = 0) => {
    return axios.get(API_URL + `GetCourses?courseId=${courseId}&offset=${offset}&limit=${limit}&organziationId=${orgId}`)
}

const getLessons = async (orgId = 0) => {
    return axios.get(API_URL + `GetLessons?organizationId=${orgId}`)
}

const AddCourse = async (request) => {
    return axios.post(API_URL + `AddCourse`, request)
}

export default {
    getLessons,
    getCourses,
    AddCourse
};