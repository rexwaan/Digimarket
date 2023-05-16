import axios from 'axios';
import address from '../env.js';

const API_URL = `${address.API_URL}:${address.PORT}/api/UserManagement/`;


const GetRolesByOrganization = async (orgId) => {
    return axios.get(API_URL + `GetRolesByOrganization?organizationId=${orgId}`)
}

const GePermissions = async () => {
    return axios.get(API_URL + `GePermissions`)
}
const GePermissionsByRole = async (roleId) => {
    return axios.get(API_URL + `GePermissionsByRole?roleId=${roleId}`)
}

const GetUsersWithRolesByOrganization = async (orgId, offset = 0, limit = 10, getAll = false, getInvitedUsers = false) => {
    return axios.get(API_URL + `GetUsersWithRolesByOrganization?organizationId=${orgId}&offset=${offset}&limit=${limit}&getAll=${getAll}&getInvitedUsers=${getInvitedUsers}`)
}


const AddRoleForOganization = async (request) => {
    return axios.post(API_URL + `AddRoleForOganization`, request)
}

const AddRolesPermissions = async (request) => {
    return axios.post(API_URL + `AddRolesPermissions`, request)
}
const AddUserOganizationRole = async (request) => {
    return axios.post(API_URL + `AddUserOganizationRole`, request)
}
const InviteUserToOrganization = async (request) => {
    return axios.post(API_URL + `InviteUserToOrganization`, request)
}
const AcceptRejectInvitation = async (request) => {
    return axios.post(API_URL + `AcceptRejectInvitation`, request)
}
const GetInvitationData = async (inviteId) => {
    return axios.get(API_URL + `GetInvitationData?invitationId=${inviteId}`)
}
const DeleteRole = async (roleId) => {
    return axios.delete(API_URL + `DeleteRole?roleId=${roleId}`)
}
const CheckInvitation = async (invitationId) => {
    return axios.get(API_URL + `CheckInvitation?invitationId=${invitationId}`)
}
const GetUserRolesPermissionDetails = async (userId, organizationId) => {
    return axios.get(API_URL + `GetUserRolePermissionDetails?userId=${userId}&organizationId=${organizationId}`)
}

export default {
    GetRolesByOrganization,
    GePermissions,
    AddRoleForOganization,
    AddRolesPermissions,
    GePermissionsByRole,
    GetUsersWithRolesByOrganization,
    AddUserOganizationRole,
    InviteUserToOrganization,
    GetInvitationData,
    AcceptRejectInvitation,
    DeleteRole,
    CheckInvitation,
    GetUserRolesPermissionDetails
};