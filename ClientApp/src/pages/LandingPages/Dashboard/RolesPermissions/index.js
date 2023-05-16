import MKBox from "components/MKBox";
import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
// import '../dashboard.css';
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import CircularProgress from "@mui/material/CircularProgress";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import usermanagementService from "../../../../services/usermanagement.service";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usernameloginstudentService from "services/usernameloginstudent.service";
const drawerWidth = 72;
function RolesPermissions() {
  const [userRoles, setUserRoles] = useState([]);
  const [roleId,setRoleId]=useState("")
  const [userPermissions,setUserPermissions]=useState([])
  const [permissionsDescription,setPermissionsDescription]=useState("")
  let orgId =
    localStorage.getItem("orgId") != null ? JSON.parse(localStorage.getItem("orgId")) : "";
  let user = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")) : "";
  useEffect(() => {
    usermanagementService.GetUserRolesPermissionDetails(user?.userId, orgId).then((ele) => {
        setUserRoles(ele?.data?.result?.rolesDetails);
        // console.log(ele?.data?.result, "ge roles and permissions");
    });
    // console.log(userRoles,"userRoles out side of block ")
  }, []);

  const handleRolesPermissions=(id)=>{
   setRoleId(id);
   let filterData=userRoles.filter((ele)=>ele.role.roleId==id)
   setUserPermissions(filterData[0]?.permissions);
  //  console.log(filterData," new data")
  }
  const handlePermissionsDescription=(data)=>{
 setPermissionsDescription(data)
  }
  return (
    <MKBox
      component="main"
      bgColor="white"
      borderRadius="xl"
      shadow="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        paddingBottom: "4rem",
      }}
    >
      {/* <Toolbar /> */}
      <Grid container spacing={3} pt={2}>
        <Grid item xs={12} lg={4}>
          <MKTypography variant="body2" fontWeight="bold">
            My Roles
          </MKTypography>
          <Divider style={{ height: "3px" }} />
          <MKBox height={"50vh"} pl={1}>
            <MKTypography component="ul" padding={1}>
              {/* {Roles[0]?.role.map((data, index) => <MKTypography key={index} margin={2} component="li" variant="body2" fontWeight="bold"><MKButton fullWidth shadow="xxl" color={"info"} >{data}</MKButton></MKTypography>)} */}
              {userRoles?.map((ele, index) => (
                <MKTypography
                  key={index}
                  margin={2}
                  component="li"
                  variant="body2"
                  fontWeight="bold"
                >
                  <MKButton fullWidth shadow="xxl" color={roleId==ele.role.roleId?"secondary":"info"} onClick={()=>handleRolesPermissions(ele?.role?.roleId)}>
                    {ele.role.name}
                  </MKButton>
                </MKTypography>
              ))}
            </MKTypography>
          </MKBox>
        </Grid>
        <Grid item xs={12} lg={4}>
          <MKTypography variant="body2" fontWeight="bold">
            {" "}
            Permissions
          </MKTypography>
          <Divider style={{ height: "3px" }} />
                    {roleId != "" &&
                    
                    <MKBox height={"50vh"} pl={1} overflow="auto" >
                          {
                       userPermissions.map((ele,ind)=>(
                        
                      <li style={{cursor:"pointer"}} onClick={()=>handlePermissionsDescription(ele.description)} key={ind}>{ele.display_name}</li>
                       ))
                          }
                    </MKBox>
                    
                    }
                       
          {/* <Divider style={{ height: "3px" }} /> */}
          {/* {roleId != "" &&
                        <MKBox height={"50vh"} pl={1} overflow="auto">
                            <FormGroup>
                                {permissions?.map((data, index) => <Paper key={index} elevation={data.display_name === permissionName ? 4 : 0} sx={{ paddingLeft: '7px', margin: '2px' }}> <FormControlLabel disabled={selectedUserType.trim().toLowerCase() === "owner"} onClick={() => { setDesc(data.description); setPermissionName(data.display_name) }} control={<Checkbox checked={selectedPermissions.some(ele => (ele.roleId == roleId && ele.permissionId == data.permissionId))} onChange={(e) => handleCheck(e, data.permissionId)} />} label={data.display_name} /></Paper>)}
                            </FormGroup>
                        </MKBox>
                    } */}
        </Grid>
        <Grid item xs={12} lg={4} height={"50vh"} overflow="auto">
          <MKTypography variant="body2" fontWeight="bold">
            About{" "}
          </MKTypography>
          <Divider style={{ height: "3px" }} />
          {/* <MKBox dangerouslySetInnerHTML={{ __html: desc }}>
                    </MKBox> */}
          <MKTypography >
                        {permissionsDescription}
                    </MKTypography>
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default RolesPermissions;
