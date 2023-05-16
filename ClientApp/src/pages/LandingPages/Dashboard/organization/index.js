import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import authService from "services/auth.service";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../../../RoutesNavigation";
import Contact from "../Contact"
import MKAvatar from "components/MKAvatar"
import {useEffect} from "react"
import Bucket from "../../../../aws"
import awsService from "../../../../services/aws.service";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [userImage,setUserImage]=useState()
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const truncate = (input) => (input.length > 25 ? `${input.substring(0, 25)}...` : input);
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
  const permissions = localStorage.getItem("permissions")
    ? JSON.parse(localStorage.getItem("permissions"))
    : [];
  let role = []
  try {

    role = user?.userOgranizations.filter(e => e.organizationId == orgId).map(e => e.role)[0] ?? []
  }
  catch (e) {
    role = user?.roles
  }

  const assignedPermissions = [
    {
      id: 4,
      permissionId: 5,
    },
    // {
    //     "id": 5,
    //     "permissionId": 6
    // },
    // {
    //     "id": 5,
    //     "permissionId": 24
    // },
    {
      id: 3,
      permissionId: 7,
    },
    {
      id: 10,
      permissionId: 22,
    },
    {
      id: 9,
      permissionId: 23,
    },
    {
      id: 8,
      permissionId: 25,
    },
    {
      id: 7,
      permissionId: 26,
    },
    {
      id: 11,
      permissionId: 31,
    },
    {
      id: 13,
      permissionId: 35,
    },
    {
      id : 14,
      permissionId: 36
    },
    {
      id : 15,
      permissionId: 37
    },
    {
      id : 16,
      permissionId: 38
    }
  ];

  const navigate = useNavigate();
  const drawerLists = [
    {
      id: 1,
      name: "Dashboard",
      url: "/dashboard",
    },
    {
      id: 12,
      name: "Content Page",
      url: "/dashboard/course-listing",
    },
    {
      id: 2,
      name: "Admin Organization Approval",
      url: "/dashboard/organisation-approval",
    },
    {
      id: 3,
      name: "User Invitation Approval",
      url: "/dashboard/user-approval",
    },
    {
      id: 4,
      name: "User Management",
      url: "/dashboard/user-management",
    },
    {
      id: 5,
      name: "User Roles",
      url: "/dashboard/user-roles",
    },
    {
      id: 7,
      name: "Admin Student Invite",
      url: "/dashboard/add-students-admin",
    },
    {
      id: 8,
      name: "Parent Student Invite",
      url: "/dashboard/add-students-parent",
    },
    {
      id: 9,
      name: "Course Type",
      url: "/dashboard/course-type",
    },
    {
      id: 10,
      name: "Schedule Course",
      url: "/dashboard/schedular",
    },
    {
      id: 11,
      name: "Contact Us Log",
      url: "/dashboard/contactusLog",
    },
    {
      id: 13,
      name: "Lessons Schedule-Teacher",
      url: "/dashboard/teacher-view",
    },
    {
      id: 14,
      name: "Lessons Schedule-Parent",
      url: "/dashboard/parent-view",
    },
    {
      id: 15,
      name: "Lessons Schedule-Student",
      url: "/dashboard/student-view",
    },
    {
      id: 16,
      name: "Lessons Schedule-Additional participants",
      url: "/dashboard/team-view",
    },
    {
      id: 17,
      name: "My Roles And Permissions",
      url: "/dashboard/roles-permissions"
    },

    {
      id: 6,
      name: "Log out",
      url: "/authentication/sign-in",
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const processNavClick = (elem) => {
    if (elem.id == 6) {
      authService.logout();
    }
    navigate(elem.url);
  };
useEffect(()=>{
  awsService.GetSignedUrl(user?.image)
            .then((res) => {

                console.log(res, "in dashboard")
                setUserImage(res.data.result);
            })
            .catch(function (err) {
                console.log(err);
            })
},[])
  const drawer = (
    <div style={{ marginBottom: "10rem" }}>
      <Divider />
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {truncate(props.data?.name)}
          <Typography variant="caption" component="div" sx={{ flexGrow: 1 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
        </Typography>
        <Avatar alt="User" src={userImage} />
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
        // sx={{ mr: 2 }}
        >
          <AccountBoxIcon />
        </IconButton> */}
      </Toolbar>
      <Divider />
      <List>
        {drawerLists.map((elem, index) =>
          user?.isPlatformAdmin ? (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => processNavClick(elem)}>
                <ListItemIcon>{elem.id === 1 ? <MailIcon /> : <InboxIcon />}</ListItemIcon>
                <ListItemText secondary={<strong>{elem.name}</strong>} />
              </ListItemButton>
            </ListItem>
          ) :
            elem.id === 2 && !user?.isPlatformAdmin ? null :
              elem.id === 5 && !permissions.includes(6) && !permissions.includes(24) && !permissions.includes(2) ? null :
                      assignedPermissions.some((e) => e.id === elem.id) ? (
                        assignedPermissions
                          .filter((e) => e.id === elem.id)
                          .map((e) =>
                            e.id === elem.id && !permissions.includes(e.permissionId) ? null : (
                              <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => processNavClick(elem)}>
                                  <ListItemIcon>{elem.id === 1 ? <MailIcon /> : <InboxIcon />}</ListItemIcon>
                                  <ListItemText secondary={<strong>{elem.name}</strong>} />
                                </ListItemButton>
                              </ListItem>
                            )
                          )
                      ) : (
                        <ListItem key={index} disablePadding>
                          <ListItemButton onClick={() => processNavClick(elem)}>
                            <ListItemIcon>{elem.id === 1 ? <MailIcon /> : <InboxIcon />}</ListItemIcon>
                            <ListItemText secondary={<strong>{elem.name}</strong>} />
                          </ListItemButton>
                        </ListItem>
                      )
        )}
      </List>
      <Divider />
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", marginTop: "5.3rem", marginBottom: "5.3rem", width: "100%" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          left: "76px",
          top: "7rem",
          zIndex: -1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography variant="h6" noWrap component="div">
                       Dashboard
                    </Typography> */}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, top: "5.3rem" },
            left: "none",
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              left: "auto !important",
              top: "5.3rem",
            },
            marginBottom: 35,
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Dashboard />
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
