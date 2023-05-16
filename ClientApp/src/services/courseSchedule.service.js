import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/CourseSchedule/`;

const GetCourseSchedules = async (shceduleId = 0, offset = 0, limit = 10, orgId = 0) => {
    return axios.get(API_URL + `GetCourseSchedules?shceduleId=${shceduleId}&offset=${offset}&limit=${limit}&organizationId=${orgId}`)
}

const AddSchedule = async (request) => {
    return axios.post(API_URL + `AddSchedule`, request)
}

const GetScheduledLessonByTeacher=async(teacherId,organizationId,isCourseView)=>{
   
    return axios.get(API_URL+`GetScheduledLessonByTeacher?teacherId=${teacherId}&organizationId=${organizationId}&isCourseView=${isCourseView}`)
}
const GetScheduledLessonByParent=async(parentId,organizationId,isCourseView)=>{
 return axios.get(API_URL+`GetScheduledLessonByParent?parentId=${parentId}&organizationId=${organizationId}&isCourseView=${isCourseView}`)
}
const GetScheduledLessonByStudent=async(studentId,organizationId,isCourseView)=>{
    return axios.get(API_URL+`GetScheduledLessonByStudent?studentId=${studentId}&organizationId=${organizationId}&isCourseView=${isCourseView}`)
}
const GetScheduledLessonByTeam =async(teamParticipantId,organizationId,isCourseView)=>{
    return axios.get(API_URL+`GetScheduledLessonByTeam?teamParticipantId=${teamParticipantId}&organizationId=${organizationId}&isCourseView=${isCourseView}`)
}
export default {
    GetCourseSchedules,
    AddSchedule,
    GetScheduledLessonByTeacher,
    GetScheduledLessonByParent,
    GetScheduledLessonByStudent,
    GetScheduledLessonByTeam
};