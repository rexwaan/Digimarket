import MKBox from "components/MKBox";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Toolbar from "@mui/material/Toolbar";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../dashboard.css";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import usermanagementService from "services/usermanagement.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { TextField } from "@mui/material";
import Bucket from "../../../../aws";
import "./roles.css";
import auth from "../../../../services/auth.service";
import { useNavigate } from "react-router-dom";
import awsService from "../../../../services/aws.service";
const drawerWidth = 72;

const UserRoles = () => {
  const navigate=useNavigate()
  const [user_, setUser_] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [rolesValue, setRolesValue] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rolesInvite, setRolesInvite] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [userStatus, setUserStatus] = useState({});
  const orgName = localStorage.getItem("orgName")
    ? JSON.parse(localStorage.getItem("orgName"))
    : "";
  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const permissions = localStorage.getItem("permissions")
    ? JSON.parse(localStorage.getItem("permissions"))
    : [];
  const [laoding, setLoading] = useState(false);
  const [clickCreate, setClickCreate] = useState(false);
  const [isOwner, setIsOwner] = useState();
  const [isActiveUser, setIsActiveUser] = useState(-1);
  const [invitationData, setInvitationData] = useState({
    organizationId: orgId,
    email: "",
    firstName: "",
    lastName: "",
    roleId: 0,
    userId: user?.userId,
  });
  const [errors, setErrors] = useState({});

  const getRolesfromDb = (orgId, offset, limit) => {
    usermanagementService
      .GetUsersWithRolesByOrganization(orgId, offset, limit, true, true)
      .then((res) => {
        var users = [];
        var roles = [];
        setIsActiveUser(-1);
        // console.log("get result result data")
        var promiseforImages = res?.data?.result?.map((ele) => {
          // console.log(ele?.user.image," image")
          roles.push(ele.roles);
          return  awsService.GetSignedUrl(ele?.user.image)
            .then((res) => {
              let _data = {};
              _data = {
                ...ele,
                image: res?.data?.result,
              };
              //   console.log(_data," data of image")
              return _data;
            })
            .catch(function (err) {
              return ele;
            });
        });
        Promise.all(promiseforImages).then((data) => {
          //   console.log(data,"======")
          if (data.length == 0) {
            setHasMore(false);
            if (limit == 0) {
              setUser_([]);
            }
          } else {
            // console.log(data,"datajdhushuasihdasuhdasu")
            setUser_(offset != 0 ? user_.concat(data) : data);
            setUserRoles(offset != 0 ? userRoles.concat(roles) : roles);
          }
          // console.log(user_.concat(data)," after end")
        });

        // res.data.result.map((data) => {
        //     users.push(data.user)
        //     roles.push(data.roles)
        // })

        // if (res.data.result.length == 0) {
        //     setHasMore(false)
        // }

        // setUser_(user_.concat(users))
        // setUserRoles(userRoles.concat(roles))
      })
      .catch((err) => setHasMore(false));
  };

  const fetchMoreData = () => {
    getRolesfromDb(orgId, offset, limit);
    setOffset(offset + limit);
  };

  useEffect(() => {

    if(user?.userId){
      getRolesfromDb(orgId, 0, limit)
      setOffset(limit)
      usermanagementService.GetRolesByOrganization(orgId).then((res) => {
        setRoles(res.data.result);
        setRolesInvite(res.data.result.filter(e => e.name !== "UsernameLoginStudent"))
      })
    } 
    else{
      navigate("/authentication/sign-in")
    } 
  }, []);

  const isemail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const handleInvitation = () => {
    setClickCreate(true);

    const errors_ = {};

    if (!isemail(invitationData["email"])) {
      errors_.email = "Please provide a valid email";
    }
    if (invitationData["email"] == "") {
      errors_.email = "Required";
    }

    if (invitationData["firstName"] == "") {
      errors_.firstName = "Required";
    }
    if (invitationData["lastName"] == "") {
      errors_.lastName = "Required";
    }
    if (invitationData["roleId"] == 0) {
      errors_.roleId = "Required";
    }
    // console.log(invitationData,"invitationData1")
    if (Object.keys(errors_).length === 0) {
      setLoading(true);
      usermanagementService
        .InviteUserToOrganization(invitationData)
        .then((res) => {

      // console.log(invitationData,"invitationData")
          setInvitationData({
            ...invitationData,
            firstName: "",
            lastName: "",
            roleId: 0,
            email: "",
          });



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


          // toast.success(res.data.message, {
          //   position: toast.POSITION.TOP_CENTER,
          // });
          setLoading(false);
          setHasMore(true);
          getRolesfromDb(orgId, 0, limit);
          setOffset(limit);
        })
        .catch((err) => {
          // toast.error(err.response.data.message, {
          //   position: toast.POSITION.TOP_CENTER,
          // });

          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                {err.response.data.message}
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          )

        });
    }
    setErrors(errors_);
  };
  const getemail = (e) => {
    setInvitationData({ ...invitationData, email: e.target.value });
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const getfirstName = (e) => {
    setInvitationData({ ...invitationData, firstName: e.target.value });
    setErrors((prev) => ({ ...prev, firstName: "" }));
  };

  const getlastName = (e) => {
    setInvitationData({ ...invitationData, lastName: e.target.value });
    setErrors((prev) => ({ ...prev, lastName: "" }));
  };

  const handleChecked = (e, roleId, userId, name) => {
    let postData = {
      organizationId: orgId,
      roleId: roleId,
      userId: userId,
      name: name,
    };
    setRolesValue(
      e.target.checked
        ? [...rolesValue, postData]
        : rolesValue.filter((ele) => ele.roleId != roleId)
    );
  };

  const handleClickCheck = (index, roleId, name, userId, isActive) => {

    //  console.log(index,"index")
    //  console.log(userRoles[index]," uesrROles")
    //  console.log(name," uesrROles name")
    // console.log(userRoles?.filter((ele, _index) => ele?.some((e, _i) => e.name.trim().toLowerCase() == "owner") && _index != index))
    // userRoles.forEach((e,i) => {
    //   e?.forEach((_e,_i) => {
    //     if (index != i && !user_[i].isActive ){
    //       debugger;
    //       console.log(user_[i])
    //     }
    //   })


    // } )
    
    if (!isActive) {
      // toast.error("Account is deactivated!", {
      //   position: toast.POSITION.TOP_CENTER,
      // });

      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          "Account is deactivated!"
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )
    }
    else if(
      name.trim().toLowerCase()=="usernameloginstudent"&&!userRoles[index].some((e)=>e.name.trim().toLowerCase()=="usernameloginstudent")
      ){
        // toast.error("Not Applicable", {
        //   position: toast.POSITION.TOP_CENTER,
        // });

        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
            Not Applicable
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )
      }
    else if (!userRoles?.some((ele, _index) => ele?.some((e, _i) => e.name.trim().toLowerCase() == "owner") && _index != index && user_[_index].isActive) && name.trim().toLowerCase() == "owner") {
     
      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          "Please make atleast one owner first!"
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )
    }
    else if (
      !permissions.includes(10) &&
      !user?.isPlatformAdmin &&
      name.trim().toLowerCase() == "owner"
    ) {
      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          "Sorry access denied !"
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )

      
    } else if (
      userRoles[index]?.some((ele) => ele.name.trim().toLowerCase() == "usernameloginstudent") ||
      (rolesValue?.some((ele) => ele.name.trim().toLowerCase() == "usernameloginstudent") &&
        name.trim().toLowerCase() != "usernameloginstudent")
    ) {
      
      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          "Username Login Student role cannot be changed !"
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )
    } else if (
      (userRoles[index]?.some((ele) => ele.name.trim().toLowerCase() !== "usernameloginstudent") ||
        rolesValue?.some((ele) => ele.name.trim().toLowerCase() !== "usernameloginstudent")) &&
      name.trim().toLowerCase() == "usernameloginstudent"
    ) {
      
      
      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          "Username Login Student role cannot be assigned with some other role !"
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )



    } else if (userRoles[index]?.some((ele) => ele.roleId == roleId && ele.isRoleInUse)) {

      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          "This role is already used somewhere in the system !"
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )

      
    } else if (userId == 0) {
     


      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          "Pending user roles cannot be changed!"
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )
    } else {
      setUserRoles(
        userRoles.map((ele, i) => (i == index ? ele.filter((ele) => ele.roleId != roleId) : ele))
      );
    }
  };

  const handleSaved = (userId, index) => {
    var stored = userRoles[index].map((data) => data.roleId);
    stored = rolesValue
      .filter((ele) => ele.userId == userId)
      ?.map((ele_) => (userId == ele_.userId ? ele_.roleId : null))
      .concat(stored);
    stored = [...new Set(stored)];
    if (stored.length < 1) {
     

      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          "Atleast one role is required"
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )



    } else {
      let postRequest = {
        organizationId: orgId,
        roleIds: stored,
        userId: userId,
      };
      usermanagementService
        .AddUserOganizationRole(postRequest)
        .then((res) => {
          
          if(user?.userId==res.data.result.userId){
            let filterOrg=user?.userOgranizations.find((ele)=>ele.organizationId==orgId)
           let Index=user.userOgranizations.findIndex((ele)=>ele.organizationId==orgId)
            filterOrg.permissions=[...res.data.result.permissions]
            filterOrg.role=[...res.data.result.role];
            user.userOgranizations[Index]=filterOrg
            localStorage.setItem("user", JSON.stringify(user))
            let newPermissions=res.data?.result?.permissions?.map((ele)=>ele.permissionId)
            localStorage.setItem("permissions", JSON.stringify(newPermissions))

          }
          
         



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


          setUser_([])
          setUserRoles([])
          setHasMore(true);
          getRolesfromDb(orgId, 0, limit);
          setOffset(limit);
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        })
        .catch((err) => {
          // console.log(err.response)
        


          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
             {err?.response?.data?.message}
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          )


        });
    }
  };

  const handleActivate = (user_, index) => {
    //  console.log(user," user data")
    // console.log(user_, " full data");
    setIsActiveUser(user_.user.userId);
    auth.ChangeUserActiveStatus(user_.user.userId, orgId, !user_.isActive).then((res) => {
      setUser_([])
      setUserRoles([])
      setHasMore(true);
      getRolesfromDb(orgId, 0, limit);
      setOffset(limit);
    });
  };

  const onlyView = () => {
    // console.log("denided")
   

    toast.error(
      <MKBox sx={{ display: "flex", justifyContent: "center" }}>
        <MKTypography variant="contained" color="secondary">
        "Sorry access denied!"
        </MKTypography>
      </MKBox>,
      {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false,
      }
    )




  }
  useEffect(() => {
    let owner = false
    try{
    let filterData = user?.userOgranizations?.filter((ele) => ele.organizationId == orgId);
    owner = filterData[0].role?.includes("Owner");
    }
    catch(ex){
      owner = user?.roles?.includes("Owner");
    }
    setIsOwner(owner);
  }, []);
  return (
    <MKBox
      component="main"
      bgColor="white"
      borderRadius="xl"
      shadow="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Toolbar />
      {/* <ToastContainer style={{ width: "500px" }} /> */}
      {(permissions.includes(24) || user?.isPlatformAdmin) && (
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12}>
            <MKTypography variant="h4">Invite Users to {orgName}</MKTypography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={5} sx={{ padding: 3 }}>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12} lg={6}>
                  <MKBox pt={4} pb={3} px={3}>
                    <MKBox component="form" role="form">
                      <MKBox mb={2}>
                        <MKInput
                          type="email"
                          label="email"
                          fullWidth
                          required
                          value={invitationData["email"] ?? ""}
                          //   error={email != "" || !clickCreate ? false : true}
                          onChange={getemail}
                        />
                        {"email" in errors ? (
                          <MKTypography
                            fontSize="0.5rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                          >
                            {errors["email"]}
                          </MKTypography>
                        ) : null}
                      </MKBox>
                      <MKBox mb={2}>
                        <MKInput
                          // variant="standard"
                          label="First Name *"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={invitationData["firstName"] ?? ""}
                          // required
                          //   error={firstName != "" || !clickCreate ? false : true}
                          onChange={getfirstName}
                        // onBlur = {(e) => {e.target.value == "" && setErrors({...errors,"firstName" : "Required"}) }}
                        // error={userDetails.firstName != "" || !createClick ? false : true}
                        // onChange={(e) => { setUserDetails({ ...userDetails, "firstName": e.target.value }); setErrors(prev => ({ ...prev, "firstName": "" })) }}
                        />
                        {"firstName" in errors ? (
                          <MKTypography
                            fontSize="0.5rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                          >
                            {errors["firstName"]}
                          </MKTypography>
                        ) : null}
                      </MKBox>
                      <MKBox mb={2}>
                        <MKInput
                          // variant="standard"
                          label="Last Name *"
                          value={invitationData["lastName"] ?? ""}
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          // required
                          //   error={lastName != "" || !clickCreate ? false : true}
                          onChange={getlastName}
                        // onBlur = {(e) => {e.target.value == "" && setErrors({...errors,"lastName" : "Required"}) }}
                        // error={userDetails.lastName != "" || !createClick ? false : true}
                        // onChange={(e) => { setUserDetails({ ...userDetails, "lastName": e.target.value }); setErrors(prev => ({ ...prev, "lastName": "" })) }}
                        />
                        {"lastName" in errors ? (
                          <MKTypography
                            fontSize="0.5rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                          >
                            {errors["lastName"]}
                          </MKTypography>
                        ) : null}
                      </MKBox>

                      {/* <MKBox mt={4} mb={1}>
                      <MKButton variant="gradient" color="info" fullWidth onClick={generateMail} >
                        {laoding ?
                      <CircularProgress color="inherit" size="20px" />
                      :
                       "Create"}

                      </MKButton>
                    </MKBox> */}
                    </MKBox>
                  </MKBox>
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={6}
                  display="flex"
                  justifyContent={"center"}
                  flexDirection="column"
                  alignContent={"center"}
                  alignItems={"center"}
                >
                  <MKTypography variant="h5">Invite as *</MKTypography>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    required
                   
                    onChange={(e) => {
                      setInvitationData({ ...invitationData, roleId: parseInt(e.target.value) });
                      setErrors((prev) => ({ ...prev, roleId: "" }));
                    }}
                  >
                    {rolesInvite.map((ele, index) => (
                      <FormControlLabel
                        key={index}
                        value={ele.roleId}
                        checked={invitationData.roleId==ele.roleId}
                        control={<Radio />}
                        label={ele.displayName}
                      />
                    ))}
                  </RadioGroup>
                  {"roleId" in errors ? (
                    <MKTypography
                      fontSize="0.75rem"
                      color="error"
                      style={{ display: "block" }}
                      textGradient
                    >
                      {errors["roleId"]}
                    </MKTypography>
                  ) : null}

                  <MKBox mt={4} mb={1}>
                    <MKButton variant="gradient" color="info" fullWidth onClick={handleInvitation}>
                      {laoding ? (
                        <CircularProgress color="inherit" size="20px" />
                      ) : (
                        "Send Invitation"
                      )}
                    </MKButton>
                  </MKBox>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
      {(permissions.includes(6) || user?.isPlatformAdmin || permissions.includes(2)) && (
        <>
          <Grid item xs={12} mb={5} mt={3}>
            <MKTypography variant="h4">Manage user roles (assign user types to users)</MKTypography>
          </Grid>
          {/* <Divider style={{ height: "3px" }} /> */}
          <InfiniteScroll
            dataLength={user_}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <Grid item xs={12} textAlign="center">
                <CircularProgress color="inherit" />
              </Grid>
            }
            // height={600}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {user_.map((i, index) => (
              <MKBox onClick={(userRoles[index]?.some(
                (ele) => ele.name.trim().toLowerCase() == "owner"
              ) && (!isOwner)) && onlyView}>
                <MKBox

                  className={(userRoles[index]?.some(
                    (ele) => ele.name.trim().toLowerCase() == "owner"
                  ) && (!isOwner)) && "container-disabled"}
                  sx={
                    index % 2 == 0
                      ? { backgroundColor: "rgb(248,248,248)" }
                      : { backgroundColor: "#FFFFFF" }
                  }
                  key={index}
                  padding={3}
                  onClick={permissions.includes(2) && !permissions.includes(6) ? onlyView : undefined}
                >
                  <Grid className={(permissions.includes(2) && (!permissions.includes(6))) ? "container-disabled" : null} container spacing={3} alignItems="center" >

                    <Grid item xs={12} md={6} lg={6}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar alt="Umy Sharp" src={i.image} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={i.user.firstname + " " + i.user.lastname}
                          secondary={
                            <MKTypography variant="caption" component={"span"} className="org-desc">
                              {/* <strong>1. Email / User Name</strong>: {i.user.email} <br /> */}
                              <strong>1. First Name</strong>: {i.user.firstname} <br />
                              <strong>2. Last Name</strong>: {i.user.lastname} <br />
                              <strong>3. Phone No</strong>: {i.user.contact} <br />
                              <strong>4. Date of Birth</strong>: {i.user.dob} <br />
                              <strong>5. Email</strong>: {i.user.email} <br />
                            </MKTypography>
                          }
                        />
                      </ListItem>
                    </Grid>

                    <Grid container justifyContent="center" item xs={12} md={3} lg={4}>
                      <Grid item xs={12}>
                        <FormGroup>
                          {roles.map((data, index_) => (
                            <FormControlLabel
                              disabled={
                                (!permissions.includes(10) &&
                                  !user?.isPlatformAdmin &&
                                  data.name.trim().toLowerCase() == "owner") ||  data.name.trim().toLowerCase()=="usernameloginstudent"||
                                userRoles[index]?.some(
                                  (ele) => ele.name.trim().toLowerCase() == "usernameloginstudent"
                                ) ||
                                (rolesValue?.some(
                                  (ele) => ele.name.trim().toLowerCase() == "usernameloginstudent"
                                ) &&
                                  data.name.trim().toLowerCase() != "usernameloginstudent") ||
                                ((userRoles[index]?.some(
                                  (ele) => ele.name.trim().toLowerCase() !== "usernameloginstudent"
                                ) ||
                                  rolesValue?.some(
                                    (ele) => ele.name.trim().toLowerCase() !== "usernameloginstudent"
                                  )) &&
                                  data.name.trim().toLowerCase() == "usernameloginstudent") ||
                                userRoles[index]?.some(
                                  (ele) => ele.roleId == data.roleId && ele.isRoleInUse
                                ) ||
                                i.user.userId == 0 ||
                                (!userRoles?.some((ele, _index) => ele?.some((e, _i) => e.name.trim().toLowerCase() == "owner") && _index != index && user_[_index].isActive) && data.name.trim().toLowerCase() == "owner") ||
                                !i.isActive
                              }
                              onClick={() =>
                                handleClickCheck(index, data.roleId, data.name, i.user.userId, i.isActive)
                              }
                              key={index_}
                              control={
                                <Checkbox
                                  disabled={
                                    (!permissions.includes(10) &&
                                      !user?.isPlatformAdmin &&
                                      data.name.trim().toLowerCase() == "owner") ||
                                    userRoles[index]?.some(
                                      (ele) => ele.name.trim().toLowerCase() == "usernameloginstudent"
                                    ) ||
                                    userRoles[index]?.some(
                                      (ele) => ele.roleId == data.roleId && ele.isRoleInUse
                                    ) ||
                                    i.user.userId == 0 ||
                                    (!userRoles?.some((ele, _index) => ele?.some((e, _i) => e.name.trim().toLowerCase() == "owner") && _index != index && user_[_index].isActive) && data.name.trim().toLowerCase() == "owner")
                                    || !i.isActive
                                  }
                                  checked={
                                    userRoles[index]?.some((ele) => ele.roleId == data.roleId) ||
                                    rolesValue.some(
                                      (ele) =>
                                        ele.roleId == data.roleId && ele.userId == i.user.userId
                                    )
                                  }
                                />
                              }
                              onChange={(e) =>
                                handleChecked(e, data.roleId, i.user.userId, data.name)
                              }
                              label={data.displayName}
                            />
                          ))}
                        </FormGroup>
                      </Grid>
                    </Grid>
                    <Grid justifyContent="center" item xs={12} md={3} lg={2}>

                      <MKBox display="flex" flexDirection="row" mt={1}>
                        <MKButton
                          sx={{ mb: 1 }}
                          color={"info"}
                          disabled={(i.user.userId == 0 || i.status != null || i.user.userId === user.userId) && (!permissions.includes(33) || !user?.isPlatformAdmin)}
                          onClick={() => handleActivate(i, index)}
                        >
                          {isActiveUser == i.user.userId ? (
                            <CircularProgress color="inherit" size="20px" />
                          ) : i.isActive ? (
                            "Deactivate"
                          ) : (
                            "Activate")
                          }
                        </MKButton>
                      </MKBox>

                      <MKBox display="flex" flexDirection="row" mt={1}>
                        <MKButton
                          color={"info"}
                          disabled={i.user.userId == 0 || i.status != null}
                          onClick={() => handleSaved(i.user.userId, index)}
                        >
                          Save
                        </MKButton>
                      </MKBox>
                      <MKBox display="flex" flexDirection="row" mt={1}>
                        <MKTypography variant="body2">
                          <strong>Status:&nbsp;</strong>
                        </MKTypography>
                        <MKTypography variant="body2">
                          {i.status == null && i.isActive == true
                            ? "Active User"
                            : i.status == null && i.isActive == false
                              ? "Deactivated"
                              : i.status}
                        </MKTypography>
                      </MKBox>
                      <MKBox display="flex" flexDirection="column" mt={1}>
                        <MKTypography variant="body2">
                          {" "}
                          <strong>Invitation/Approval Date:</strong>
                        </MKTypography>

                        <MKTypography variant="body2" sx={{ borderBottom: 1 }}>
                          {i.date}
                        </MKTypography>
                      </MKBox>
                    </Grid>
                  </Grid>
                  {/* <Divider style={{ height: "3px" }} /> */}
                </MKBox>
              </MKBox>
            ))}
          </InfiniteScroll>
        </>
      )}
    </MKBox>
  );
};

export default UserRoles;
