import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/Attendance/`;


const GetMembersForAttendance=async(courseScheduleCourseDetailId)=>{
    return axios.get(API_URL+`GetMembersForAttendance?courseScheduleCourseDetailId=${courseScheduleCourseDetailId}`)
}
const MarkAttendance=async(request)=>{

    return axios.post(API_URL+`MarkAttendance`,request)
}
export default{
    GetMembersForAttendance,
    MarkAttendance
}