import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import CircularProgress from '@mui/material/CircularProgress';
// import Logo from '../../../examples/Logo'
import Logo from "../../../Navigation/Header"

import bgImage from "assets/images/read-g18fc55640_1920.jpg";
import { useEffect, useState } from "react";
import Auth from 'services/auth.service';
import { useSearchParams } from "react-router-dom";
import MKAlert from "components/MKAlert";
import Icon from "@mui/material/Icon";
import PasswordStrengthBar from 'react-password-strength-bar';
import PhoneInput from 'react-phone-input-2';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import usermanagementService from "../../../services/usermanagement.service";


const PasswordValidation = ({ password, validatePass, errors, suggestions }) => {
  return (
    <>
      <PasswordStrengthBar minLength="8" password={password} onChangeScore={validatePass} />
      {suggestions != "" &&
        <MKTypography
          fontSize="0.75rem"
          color="error"
          textGradient
        >
          {suggestions}
        </MKTypography>
      }
    </>
  )
}


function UserCreate() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [companyImg, setCompanyImg] = useState();
  const [showPassword, setPasswordShow] = useState(false);
  const [imgLoad, setImgLoad] = useState(false);
  const [fileName, setFileName] = useState("");
  const [passError, setPassError] = useState("");




  const [errors, setErrors] = useState({
    "password": "",
    "dob": ""
  });
  const [laoding, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState({
    "firstName": "",
    "lastName": "",
    "MiddleName": "",
    "email": "",
    "password": "",
    "OrganizationName": "",
    "roleName": "",
    "roleId": "",
    "organizationId": "",
    "userId": "",
    "invitationId": "",
    "accpted": true,
    "rejected": false,
    "dob": "",
    "contact": ""


  })
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  const [createClick, setCreateClick] = useState(false)
  const [response, setResponse] = useState({
    status: false,
    error: false,
    message: ""
  });

  useEffect(() => {

  console.log(document.URL,"url document link")


      if(searchParams.get("invitationId")==null){
        setLoading(false)
        setResponse({
          status: true,
          error: false,
          message: "Lesson access given to the user successfully"
        })
      }
      else{
    usermanagementService.CheckInvitation(searchParams.get("invitationId")).then((resp)=>{
     if(resp.data.result!=true){
       usermanagementService.GetInvitationData(searchParams.get("invitationId")).then((res) => {
         setLoading(false)
         if (res.data.statusCode != 200) {
           throw { "message": res.data.message }
         }
         else {
           setUserDetails({
             ...userDetails,
             "firstName": res.data.result.firstName,
             "lastName": res.data.result.lastName,
             "email": res.data.result.email,
             "OrganizationName": res.data.result.organizationName,
             "roleName": res.data.result.role?.displayName,
             "roleId": res.data.result.role?.roleId,
             "organizationId": res.data.result.organizationId,
             "userId": res.data.result.user?.userId,
             "invitationId": parseInt(searchParams.get("invitationId")),
           })
           if (res.data.result.user == null) {
             setPasswordShow(true)
           }
   
         }
       }).catch((err) => {
         console.log(err)
         setLoading(false)
         setResponse({
           status: true,
           error: true,
           message: err.message
         })
       })
     }
     else{
         setLoading(false)
       setResponse({
         status: true,
         error: false,
         message: "Already Accepted, Please Login"
       })
     }
    })
  }
 }, [])

  const validatePass = (score, feedback) => {
    if ("warning" in feedback) setSuggestions(feedback["warning"])
    setUserDetails({
      ...userDetails, "password": password
    })
    if (score < 1) {
      setErrors({ ...errors, "password": "Please use a strong password" })
    }
    else {
      setPassError("")
    }
  }


  const saveData = () => {
    setCreateClick(true)
    let errors_ = {}
    if ((userDetails.dob == "" || userDetails.dob == null) && showPassword) {
      errors_.dob = "Required"
    }
    if (errors.password != "" && showPassword) {
      errors_.password = errors.password
    }
    else if (userDetails.password == "" && showPassword) {
      errors_.password = "Required"
    }
    if (Object.keys(errors_).length === 0) {

      setLoading(true)
      usermanagementService.AcceptRejectInvitation(userDetails).then(() => {
        setLoading(false)
        setResponse({
          status: true,
          error: false,
          message: "Configured!"
        })
      }).catch((err) => {
        setLoading(false)
        setResponse({
          status: true,
          error: true,
          message: "Something Went Wrong"
        })
      });
    }
    setErrors(errors_)
  }

  return (
    <>
      <Grid container spacing={3} alignItems="center">
        <Logo position="fixed" />
        <Grid item xs={12} lg={6}>
          <MKBox
            display={{ xs: "none", lg: "flex" }}
            width="calc(100% - 2rem)"
            height="calc(100vh - 2rem)"
            borderRadius="lg"
            ml={2}
            mt={2}
            sx={{ backgroundImage: `url(${bgImage})`, backgroundSize: "contain" }}
          />
        </Grid>

        {laoding ? <Grid item xs={12} lg={6}>   <MKBox sx={{ display: 'flex', justifyContent: "center" }}>
          <CircularProgress color="inherit" />
        </MKBox> </Grid> :

          <Grid
            item
            xs={12}
            sm={10}
            md={7}
            lg={6}
            xl={4}
            ml={{ xs: "auto", lg: 6 }}
            mr={{ xs: "auto", lg: 6 }}
          >

            {!response.status ?

              <MKBox
                bgColor="white"
                borderRadius="xl"
                shadow="lg"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                mt={{ xs: 20, sm: 18, md: 20 }}
                mb={{ xs: 20, sm: 18, md: 20 }}
                mx={3}
              >
                <MKBox
                  variant="gradient"
                  bgColor="info"
                  coloredShadow="info"
                  borderRadius="lg"
                  p={2}
                  mx={2}
                  mt={-3}
                >
                  <MKTypography variant="h3" color="white">
                    Adding User in {userDetails.OrganizationName}
                  </MKTypography>
                </MKBox>
                <MKBox p={3} sx={{ zIndex: 0 }}>

                  <MKBox width="100%" component="form" method="post" autoComplete="off">
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          // variant="standard"
                          label="First Name"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={userDetails.firstName}
                          disabled = {!showPassword}
                          onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "firstName": "Required" }) }}
                          onChange={(e) => { setUserDetails({ ...userDetails, "firstName": e.target.value }); setErrors(prev => ({ ...prev, "firstName": "" })) }}
                        />
                        {"firstName" in errors ? <MKTypography

                          fontSize="0.75rem"
                          color="error"
                          style={{ display: "block" }}
                          textGradient
                        >
                          {errors["firstName"]}
                        </MKTypography> : null}

                      </Grid>

                      <Grid item xs={12} md={6}>
                        <MKInput
                          // variant="standard"
                          label="Last Name"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          disabled = {!showPassword}
                          value={userDetails.lastName}

                          onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "lastName": "Required" }) }}
                          onChange={(e) => { setUserDetails({ ...userDetails, "lastName": e.target.value }); setErrors(prev => ({ ...prev, "lastName": "" })) }}
                        />
                        {"lastName" in errors ? <MKTypography

                          fontSize="0.75rem"
                          color="error"
                          style={{ display: "block" }}
                          textGradient
                        >
                          {errors["lastName"]}
                        </MKTypography> : null}


                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          type="email"
                          // variant="standard"
                          label="Email"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          // onBlur = {(e)=>setUserDetails({"email":e.target.value})}
                          value={userDetails.email}
                          disabled={true}
                        />
                      </Grid>

                      {showPassword &&
                        <>
                          <Grid item xs={12} md={6}>
                            <MKInput
                              type="password"
                              // variant="standard"
                              label="Password"
                              // InputLabelProps={{ shrink: true }}
                              fullWidth
                              onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "password": "Required" }) }}
                              onKeyPress={() => setShowPasswordStrength(true)}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors(prev => ({ ...prev, "password": "" }));
                                e.target.value == "" ? setShowPasswordStrength(false) & setSuggestions("") : setShowPasswordStrength(true);
                              }}
                              required
                              error={userDetails.password != "" || !createClick ? false : true}
                            />


                            {
                              showPasswordStrength ? <PasswordValidation password={password} errors={errors} validatePass={validatePass} suggestions={suggestions} /> :
                                null
                            }

                            {"password" in errors ? <MKTypography

                              fontSize="0.75rem"
                              color="error"
                              style={{ display: "block" }}
                              textGradient
                            >
                              {errors["password"]}
                            </MKTypography> : null}



                          </Grid>

                          <Grid item xs={12} md={6}>
                            <PhoneInput onChange={phone => setUserDetails({ ...userDetails, "contact": phone })} />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                label="Date of Birth"
                                value={userDetails["dob"] ? userDetails["dob"] : null}
                                maxDate = {new Date().setDate(0)}
                                onChange={(newValue) => {
                                  setUserDetails({
                                    ...userDetails, "dob": newValue?.format('LL')
                                  })
                                  setErrors({
                                    ...errors, "dob": ""
                                  })
                                }}
                                fullWidth
                                renderInput={(params) => <TextField fullWidth {...params} />}
                              />
                            </LocalizationProvider>
                            {"dob" in errors ? <MKTypography

                              fontSize="0.75rem"
                              color="error"
                              style={{ display: "block" }}
                              textGradient
                            >
                              {errors["dob"]}
                            </MKTypography> : null}

                          </Grid></>
                      }

                      <Grid item xs={12} md={12} display="flex" justifyContent={"center"} alignItems={"center"}>
                        Role : <strong>{userDetails.roleName}</strong>
                      </Grid>


                    </Grid>

                    <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                      <MKButton onClick={saveData} variant="gradient" color="info">
                      Accept
                      </MKButton>
                    </Grid>
                  </MKBox>
                </MKBox>
              </MKBox>
              :
              <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
                <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
                  {!response.error ? <MKAlert color="success">
                    <Icon fontSize="small">thumb_up</Icon>&nbsp;
                    {response.message}
                  </MKAlert> :
                    <MKAlert color="error">
                      <Icon fontSize="small">error</Icon>&nbsp;
                      {response.message}
                    </MKAlert>
                  }

                </Grid>
              </MKBox>
            }
          </Grid>
        }
      </Grid>
    </>
  );
}

export default UserCreate;
