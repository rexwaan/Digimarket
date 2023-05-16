
import Icon from "@mui/material/Icon";
import UserCreate from "./pages/LandingPages/UserCreate";
import OrganizationRequest from "./pages/LandingPages/OrganizationRequest";
import SignIn from "./pages/LandingPages/SignIn";
import UserInvite from "./pages/LandingPages/UserInvite";
import Forgot from "./pages/LandingPages/Dashboard/Forgot";
import ResetPass from "./pages/LandingPages/forgetResetPass";
import Dashboard from "./pages/LandingPages/Dashboard";
import Classroom from "./pages/LandingPages/Classroom";
import Activity from "./pages/LandingPages/Activity";
import Resource from "./pages/LandingPages/Resources";

const routes = [
  {
    name: "pages",
    icon: <Icon>dashboard</Icon>,
    columns: 1,
    rowsPerColumn: 2,
    collapse: [

      {
        name: "account",
        collapse: [
          {
            name: "organization request",
            route: "/authentication/organization-request",
            component: <OrganizationRequest />,
          },
          {
            name: "user create",
            route: "/authentication/user-create",
            component: <UserCreate />,
          },
          {
            name: "sign in",
            route: "/authentication/sign-in",
            component: <SignIn />,
          },
          {
            name: "user invite",
            route: "/authentication/invitation",
            component: <UserInvite />,
          },
          {
            name: "Forget Password",
            route: "/authentication/forget",
            component: <Forgot />,
          },
          {
            name: "Reset Password",
            route: "/authentication/resetpass",
            component: <ResetPass />,
          },
        ],
      },
      {
        name: "dashboard",
        collapse: [
          {
            name: "Dashboard",
            route: "/dashboard/*",
            component: <Dashboard />,
          },
        ],
      },
      {
        name: "classroom",
        collapse: [
          {
            name: "Classroom",
            route: "/classroom/*",
            component: <Classroom />,
          },
          {
            name: "Activity",
            route: "/activity",
            component: <Activity />,
          },
          {
            name: "Resource",
            route: "/resource",
            component: <Resource />,
          },
        ],
      },
    ],
  },

];

export default routes;
