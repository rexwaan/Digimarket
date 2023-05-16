import MKBox from "components/MKBox";
import React, { useState, useEffect } from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import "../dashboard.css";
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
import usermanagementService from "services/usermanagement.service";
import Paper from "@mui/material/Paper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 72;

const UserManagement = () => {
  const [age, setAge] = useState("");
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState({});
  const [roleId, setRoleId] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [permissionValue, setPermissionValue] = useState({});
  const [permissionName, setPermissionName] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("");
  const [desc, setDesc] = useState("");
  const [laoding, setLoading] = useState(false);

  const [selectedRoleTodelete, setSelectedRoletoDelete] = useState(0);

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  let orgId =
    localStorage.getItem("orgId") != null ? JSON.parse(localStorage.getItem("orgId")) : "";
  let user = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")) : "";
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    usermanagementService.GetRolesByOrganization(orgId).then((res) => {
      setRoles(res.data.result);
      var permissionData = [];
      res.data.result.map((ele) => {
        usermanagementService.GePermissionsByRole(ele.roleId).then((res_) => {
          res_.data.result.forEach((data) => {
            let postRequest = {
              roleId: ele.roleId,
              permissionId: data.permissionId,
              created_by: ele.created_by,
            };
            permissionData.push(postRequest);
          });
        });
      });
      setSelectedPermissions(permissionData);
    });
    usermanagementService.GePermissions().then((res) => {
      setPermissions(res.data.result);
    });
  }, []);

  const apiCall = () => {
    usermanagementService.GetRolesByOrganization(orgId).then((res) => {
      setRoles(res.data.result);
    });
  };

  const handleAddRoleType = () => {
    if (userType == "") {
      setError({ ...error, UserType: "Required" });
    } else if (!/^[a-zA-Z]+$/.test(userType)) {
      setError({ ...error, UserType: "Please provide a valid user type name" });
    } else {
      const postRequest = {
        name: userType,
        details: "Static",
        isMandatory: true,
        organizationId: orgId,
        displayName: userType,
        created_by: user?.userId,
      };
      usermanagementService.AddRoleForOganization(postRequest).then((res) => {
        apiCall();
      });
    }
  };

  const handleCheck = (e, permissionId) => {
    let postRequest = {
      roleId: roleId,
      permissionId: permissionId,
      created_by: user?.userId,
    };
    setSelectedPermissions(
      e.target.checked
        ? [...selectedPermissions, postRequest]
        : selectedPermissions.filter(
            (ele) => !(ele.permissionId == permissionId && ele.roleId == roleId)
          )
    );
  };

  const handleSave = () => {
    var requestData = selectedPermissions.map((ele) => {
      return {
        roleId: ele.roleId,
        permissionIds: selectedPermissions
          .map((ele_) => (ele.roleId == ele_.roleId ? ele_.permissionId : null))
          .filter((n) => n),
        created_by: user?.userId,
      };
    });
    setLoading(true);
    usermanagementService
      .AddRolesPermissions(
        requestData.filter((v, i, a) => a.findLastIndex((v2) => v2.roleId === v.roleId) === i)
      )
      .then((res) => {
        console.log(res);
        setLoading(false);
       

        toast.success(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
           {res.data.message}
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )



      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      

        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
           {err}
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )


      });
  };

  const handleRoleClick = (roleId, roleName) => {
    setRoleId(roleId);
    setSelectedUserType(roleName);
  };

  const handleDelType = (e) => {
    setError({});
    setSelectedRoletoDelete(e.target.value);
  };
  const handleDeleteRoleType = () => {
    if (selectedRoleTodelete === 0) {
      setError({
        DelUserType: "required",
      });
    } else {
      usermanagementService
        .DeleteRole(selectedRoleTodelete)
        .then((res) => {
          setSelectedRoletoDelete(0);
          apiCall();
        })
        .catch((err) =>
          setError({
            DelUserType: err?.response?.data?.message,
          })
        );
    }
  };

  const handlePermissions = (data, role) => {
    setDesc(data.description);
    setPermissionName(data.display_name);
    if (role !== "owner") {
      if (
        !selectedPermissions.some((e) => e.roleId == roleId && e.permissionId == 6) &&
        data.permissionId == 33
      ) {
       


        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            To Activate this permission, Please check "Change / add type to a user" permission!
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )


      }
      if (
        !selectedPermissions.some((e) => e.roleId == roleId && e.permissionId == 8) &&
        data.permissionId == 9
      ) {
        


        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            To Activate this permission, Please check "Lesson creation" permission!
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )

        
      }

      ///////////////////////////
      if (
        !selectedPermissions.some((e) => e.roleId == roleId && e.permissionId == 8) &&
        data.permissionId == 3
      ) {
        //
       


        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            To Activate this permission, Please check "Lesson creation" permission!
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )


      }

      if (
        !selectedPermissions.some((e) => e.roleId == roleId && e.permissionId == 9) &&
        data.permissionId == 3
      ) {
        //
      



        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            To Activate this permission, Please check "sharing" permission!
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )

      }
      /////////////////////////////

      if (
        selectedPermissions.some((e) => e.roleId == roleId && e.permissionId == 33) &&
        data.permissionId == 6
      ) {
       


        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            To Deactivate this permission, Please uncheck "Deactivate /activate accounts (users)" permission!
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )



      }
      if (
        selectedPermissions.some((e) => e.roleId == roleId && e.permissionId == 9) &&
        data.permissionId == 8
      ) {
       
        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            To Deactivate this permission, Please uncheck "Lesson Sharing" permission!
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )



      }
      if (
        selectedPermissions.some((e) => e.roleId == roleId && e.permissionId == 3) &&
        data.permissionId == 8
      ) {
        //
      

        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            To Deactivate this permission, Please uncheck "Edit all curriculum owned by organization" permission!
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )


      }
      if (
        selectedPermissions.some((e) => e.roleId == roleId && e.permissionId == 3) &&
        data.permissionId == 9
      ) {
        //
     


        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            To Deactivate this permission, Please uncheck "Edit all curriculum owned by organization" permission!
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )



      }
      if ((data.permissionId == 34 || data.permissionId == 10) && role != "owner") {
      


        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            Access Denied
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )


      }
    }
  };
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
            List of User Types
          </MKTypography>
          <Divider style={{ height: "3px" }} />
          <MKBox height={"50vh"} pl={1}>
            <MKTypography component="ul" padding={1}>
              {roles.map((data, index) => (
                <MKTypography
                  key={index}
                  margin={2}
                  component="li"
                  variant="body2"
                  fontWeight="bold"
                >
                  <MKButton
                    fullWidth
                    shadow="xxl"
                    color={roleId == data.roleId ? "secondary" : "info"}
                    onClick={() => handleRoleClick(data.roleId, data.displayName)}
                  >
                    {data.displayName}
                  </MKButton>
                </MKTypography>
              ))}
            </MKTypography>
          </MKBox>
        </Grid>
        <Grid item xs={12} lg={4}>
          <MKTypography variant="body2" fontWeight="bold">
            {selectedUserType} Permissions
          </MKTypography>
          <Divider style={{ height: "3px" }} />
          {roleId != "" && (
            <MKBox height={"50vh"} pl={1} overflow="auto">
              <FormGroup>
                {permissions.map((data, index) => (
                  <Paper
                    key={index}
                    elevation={data.display_name === permissionName ? 4 : 0}
                    sx={{ paddingLeft: "7px", margin: "2px" }}
                  >
                    <FormControlLabel
                      disabled={
                        selectedUserType.trim().toLowerCase() === "owner" ||
                        (!selectedPermissions.some(
                          (e) => e.roleId == roleId && e.permissionId == 6
                        ) &&
                          data.permissionId == 33) ||
                        (!selectedPermissions.some(
                          (e) => e.roleId == roleId && e.permissionId == 8
                        ) &&
                          data.permissionId == 9) ||
                        (selectedPermissions.some(
                          (e) => e.roleId == roleId && e.permissionId == 9
                        ) &&
                          data.permissionId == 8) ||
                        (selectedPermissions.some(
                          (e) => e.roleId == roleId && e.permissionId == 33
                        ) &&
                          data.permissionId == 6) ||
                        (!selectedPermissions.some(
                          (e) => e.roleId == roleId && e.permissionId == 8
                        ) &&
                          data.permissionId == 3) ||
                        (!selectedPermissions.some(
                          (e) => e.roleId == roleId && e.permissionId == 9
                        ) &&
                          data.permissionId == 3) ||
                        (selectedPermissions.some(
                          (e) => e.roleId == roleId && e.permissionId == 3
                        ) &&
                          data.permissionId == 8) ||
                        (selectedPermissions.some(
                          (e) => e.roleId == roleId && e.permissionId == 3
                        ) &&
                          data.permissionId == 9) ||
                        data.permissionId == 34 ||
                        data.permissionId == 10
                      }
                      onClick={() => handlePermissions(data, selectedUserType.trim().toLowerCase())}
                      control={
                        <Checkbox
                          checked={selectedPermissions.some(
                            (ele) => ele.roleId == roleId && ele.permissionId == data.permissionId
                          )}
                          onChange={(e) => handleCheck(e, data.permissionId)}
                        />
                      }
                      label={data.display_name}
                    />
                  </Paper>
                ))}
              </FormGroup>
            </MKBox>
          )}
        </Grid>
        <Grid item xs={12} lg={4} height={"50vh"} overflow="auto">
          <MKTypography variant="body2" fontWeight="bold">
            About {permissionName}{" "}
          </MKTypography>
          <Divider style={{ height: "3px" }} />
          <MKBox dangerouslySetInnerHTML={{ __html: desc }}></MKBox>
          {/* <MKTypography variant="caption">
                        {desc}
                    </MKTypography> */}
        </Grid>
      </Grid>
      <Grid display={"flex"} justifyContent={"flex-end"}>
        <MKButton
          variant="gradient"
          color="info"
          sx={{ marginBottom: "10px" }}
          onClick={handleSave}
        >
          {laoding ? <CircularProgress color="inherit" size="20px" /> : "Save"}
        </MKButton>
      </Grid>
      <Divider style={{ height: "3px" }} />
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Grid container spacing={1} mt={0.1} flexWrap="nowrap">
            <Grid item xs={12}>
              <MKTypography variant="body2" fontWeight="bold">
                Add Another User Type{" "}
              </MKTypography>
            </Grid>
            <Grid item xs={12}>
              <MKInput
                type="text"
                label="User Type Name"
                fullWidth
                onChange={(e) => {
                  setUserType(e.target.value);
                  setError({ ...error, UserType: "" });
                }}
              />
              {"UserType" in error ? (
                <MKTypography
                  fontSize="0.75rem"
                  color="error"
                  style={{ display: "block" }}
                  textGradient
                >
                  {error["UserType"]}
                </MKTypography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <MKButton
                variant="gradient"
                color="info"
                fullWidth
                sx={{ marginBottom: "10px" }}
                onClick={handleAddRoleType}
              >
                Create User Type
              </MKButton>
            </Grid>
          </Grid>
          <Grid container spacing={1} mt={0.1} flexWrap="nowrap">
            <Grid item xs={12}>
              <MKTypography variant="body2" fontWeight="bold">
                Remove UserType{" "}
              </MKTypography>
            </Grid>
            <Grid item xs={12}>
              <MKBox mr={{ xs: "auto", lg: 3 }} mb={2} style={{ width: "100%" }}>
                <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">{"User Type"}</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    onChange={handleDelType}
                    autoWidth
                    label={"User Type"}
                    defaultValue=""
                  >
                    {roles.map(
                      (ele, index) =>
                       ( ele.displayName !== "Username Login Student"&&ele.displayName !== "Owner") && (
                          <MenuItem key={index} value={ele.roleId}>
                            {ele.displayName}
                          </MenuItem>
                        )
                    )}
                  </Select>
                </FormControl>
                {"DelUserType" in error ? (
                  <MKTypography
                    fontSize="0.75rem"
                    color="error"
                    style={{ display: "block" }}
                    textGradient
                  >
                    {error["DelUserType"]}
                  </MKTypography>
                ) : null}
              </MKBox>
            </Grid>
            <Grid item xs={12}>
              <MKButton
                variant="gradient"
                color="error"
                fullWidth
                sx={{ marginBottom: "10px" }}
                onClick={handleDeleteRoleType}
              >
                Remove User Type
              </MKButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider style={{ height: "3px" }} />
          <MKTypography variant="caption" fontWeight="bold">
            How to create new user type?
          </MKTypography>
          <MKTypography component={"ol"} padding={3}>
            <MKTypography variant={"caption"} component={"li"}>
              Add the name of the user and click create
            </MKTypography>
            <MKTypography variant={"caption"} component={"li"}>
              The new userType will be added to the list of user types
            </MKTypography>
          </MKTypography>
          <MKTypography variant="caption" fontWeight="bold">
            How to remove a user type?
          </MKTypography>
          <MKTypography component={"ol"} padding={3}>
            <MKTypography variant={"caption"} component={"li"}>
              Under Remove a user type select user type you wish to remove and click the remove
              usertype button.
            </MKTypography>
          </MKTypography>
          <MKTypography variant="caption" fontWeight="bold">
            How to manage permissions?
          </MKTypography>
          <MKTypography component={"ol"} padding={3}>
            <MKTypography variant={"caption"} component={"li"}>
              To manage permissions, click on the user type you want to edit and check / uncheck
              permissions from the permission list
            </MKTypography>
          </MKTypography>
        </Grid>
      </Grid>
    </MKBox>
  );
};

export default UserManagement;
