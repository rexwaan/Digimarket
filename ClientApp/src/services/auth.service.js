import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/User/`;

const addOrganization = async (request) => {

    let api_response = '';
    try {
        axios.post(API_URL + "AddUser", request).then((response) => {

            if (response.data.statusCode != 200) {
                api_response = 'Something went wrong on api side';
            }
            else {
                api_response = "success";
            }
        }, (error) => {
            console.log(error);
        });
    }
    catch (error) {
        console.log(error)
    }
    return api_response;
}

const signInToAnotherOrg = async (organizationName, email, password, rootuserid) => {
    return axios
        .post(API_URL + "SignInToAnotherOrganization", {
            organizationName,
            email,
            password,
            rootuserid
        })
};

const login = async (email, password) => {
    return axios
        .post(API_URL + "UserLogin", {
            email,
            password,
        })
        .then((response) => {
            // console.log("response with roles", response).
            if (response.data.statusCode == 200) {
                localStorage.setItem("user", JSON.stringify(response.data.result));
                localStorage.setItem("mainUserId", JSON.stringify(response.data.result?.userId));
            }
            else
                throw response.data.message
            return response.data;
        })
};

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("orgId");
    localStorage.removeItem("orgName");
    localStorage.removeItem("permissions");
    localStorage.removeItem("orgList");
    // localStorage.removeItem("classEnded")
};


const resetPassword = (newPass, userId, isAdmin, organizationId) => {
    return axios
        .post(API_URL + `ResetPassword`, { "userId": userId, "password": newPass, "isAdmin": isAdmin , "organizationId": organizationId})
}
const forgetPassword = (email) => {
    return axios
        .post(API_URL + `ForgetPassword?email=${email}`)
}
const checkPassword = (userId, password) => {
    const request = { "userId": userId, "password": password };
    return axios.post(API_URL + `CheckOldPassword`, request);
}
const updateUserInfo = (userId, firstName, lastName, dob, fileName) => {
    let value = {
        "userId": userId,
        "firstName": firstName,
        "lastName": lastName,
        "dob": dob,
        "image": fileName,
    }
    return axios.post(API_URL + `UpdateUserInfo`, value);
}
const GetLeadTeachers = async (organizationId,lessonId) => {
    return axios.get(API_URL + `GetLeadTeachers?organizationId=${organizationId}&lessonId=${lessonId}`)
}
const GetAdditonalParticipants = async (organizationId) => {
    return axios.get(API_URL + `GetAdditonalParticipants?organizationId=${organizationId}`)
}
const GetParticipents= async (organizationId,lessonId) => {
    return axios.get(API_URL + `GetParticipents?organizationId=${organizationId}`)
}

const GetEmailsByOrganization = async (organizationId, userId) => {
    return axios.get(API_URL + `GetEmailsByOrganization?organizationId=${organizationId}&userId=${userId}`)
}

const ChangeUserActiveStatus = async (userId, organizationId, active) => {
    return axios.post(API_URL + `ChangeUserActiveStatus`, { userId, organizationId, active })
}

const VerifyOrganiationDetails = async (request) => {
    return axios.post(API_URL + `VerifyOrganiationDetails`, request)
}

const AddEmailForOrganization = async (request) => {
    return axios.post(API_URL + `AddEmailForOrganization`, request)
}
const VerifyEmailByPin = async (request) => {
    return axios.post(API_URL + `VerifyEmailByPin`, request)
}
const TurnNotificationOnOff = async (request) => {
    return axios.post(API_URL + `TurnNotificationOnOff`, request)
}
const RemoveEmailId = async (emailId) => {
    return axios.delete(API_URL + `RemoveEmailId?userOrganizationEmailId=${emailId}`)
}
const SetPrimaryEmail=async(emailId)=>{
    return axios.post(API_URL+`SetPrimaryEmail?emailId=${emailId}`)
}


export default {
    addOrganization,
    signInToAnotherOrg,
    login,
    logout,
    resetPassword,
    forgetPassword,
    checkPassword,
    updateUserInfo,
    GetLeadTeachers,
    ChangeUserActiveStatus,
    VerifyOrganiationDetails,
    GetEmailsByOrganization,
    AddEmailForOrganization,
    VerifyEmailByPin,
    TurnNotificationOnOff,
    RemoveEmailId,
    SetPrimaryEmail,
    GetAdditonalParticipants,
    GetParticipents
};
