import React, { useEffect } from "react"
import CourseListing from "../pages/LandingPages/Dashboard/courseListing";
import OrganizationDetail from "../pages/LandingPages/Dashboard/organizationDetail";
import CourseDetail from "../pages/LandingPages/Dashboard/courseDetail";
import OrganizationApproval from "pages/LandingPages/Dashboard/organisationApproval";
import UserApproval from "../pages/LandingPages/Dashboard/userApproval";
import UserRoles from "../pages/LandingPages/Dashboard/userRoles";
import UserManagement from "../pages/LandingPages/Dashboard/userManagement";
import { Link, Routes, Route, useRoutes, useNavigate, Navigate } from "react-router-dom";
import AdminUserNameStudent from "../pages/LandingPages/Dashboard/adminUserNameStudent";
import CourseType from "../pages/LandingPages/Dashboard/courseType"
import ParentUserNameStudent from '../pages/LandingPages/Dashboard/parentUserNameStudent';
import Schedular from "../pages/LandingPages/Dashboard/scheduler";
import Contact from "../pages/LandingPages/Dashboard/Contact"
import ContactusLog from "../pages/LandingPages/Dashboard/contactUsLog";
import Setting from "../pages/LandingPages/Dashboard/Setting";
import Dashboard from "../pages/LandingPages/Dashboard/dashboard";
import AdditionalTeamView from "../pages/LandingPages/Dashboard/AdditionalTeamView"
import Attendance from "../pages/LandingPages/Dashboard/Attendance"
import LeadTeacherView from "../pages/LandingPages/Dashboard/LeadTeacherView";
import StudentScheduleView from "../pages/LandingPages/Dashboard/StudentScheduleView";
import ScheduleParentView from "../pages/LandingPages/Dashboard/ScheduleParentView";
import RolesPermissions from "pages/LandingPages/Dashboard/RolesPermissions";

const MainRoute = () => {
    useEffect(() => {
        console.log("routes file called")
    })
    const user = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")) : "";
    const permissions = localStorage.getItem("permissions") ? JSON.parse(localStorage.getItem("permissions")) : [];
    return (
        <>
            <Routes>
                <Route index element={<Dashboard />} />
                <Route path="/course-listing" element={<CourseListing />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/organization-detail" element={<OrganizationDetail />} />


                {(permissions.includes(35) || user?.isPlatformAdmin) &&
                <Route path="/teacher-view" element={<LeadTeacherView />} />
                }

                {(permissions.includes(38) || user?.isPlatformAdmin) &&
                    <Route path="/team-view" element={<AdditionalTeamView />} />
                }
                {(permissions.includes(37) || user?.isPlatformAdmin) &&
                    <Route path="/student-view" element={<StudentScheduleView />} />
                }
                {(permissions.includes(36) || user?.isPlatformAdmin) &&
                    <Route path="/parent-view" element={<ScheduleParentView />} />
                }
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/course-detail" element={<CourseDetail />} />
                <Route path="/contact-us" element={<Contact />} />



                <Route path="/roles-permissions" element={<RolesPermissions />} />
                {(permissions.includes(26) || user?.isPlatformAdmin) &&
                    <Route path="/add-students-admin" element={<AdminUserNameStudent />} />}
                {/* {(permissions.includes(25) || user?.isPlatformAdmin) && */}
                <Route path="/add-students-parent" element={<ParentUserNameStudent />} />
                {/* // } */}
                {(permissions.includes(23) || user?.isPlatformAdmin) &&
                    <Route path="/course-type" element={<CourseType />} />}
                {(permissions.includes(22) || user?.isPlatformAdmin) &&
                    <Route path="/schedular" element={<Schedular />} />}
                {(permissions.includes(31) || user?.isPlatformAdmin) &&
                    <Route path="/contactusLog" element={<ContactusLog />} />}
                {user?.isPlatformAdmin &&
                    <Route path="/organisation-approval" element={<OrganizationApproval />} />}
                {(permissions.includes(7) || user?.isPlatformAdmin) &&
                    <Route path="/user-approval" element={<UserApproval />} />}
                {/* {(permissions.includes(6) || permissions.includes(24) || user?.isPlatformAdmin || permissions.includes(2)) && */}
                <Route path="/user-roles" element={<UserRoles />} />
                {/* } */}
                {(permissions.includes(5) || user?.isPlatformAdmin) &&
                    <Route path="/user-management" element={<UserManagement />} />}
            </Routes>
        </>
    )
}
export default MainRoute