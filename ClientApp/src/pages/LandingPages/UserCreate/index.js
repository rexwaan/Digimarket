
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import CircularProgress from '@mui/material/CircularProgress';
// import Logo from '../../../examples/Logo'
import Logo from "../../../Navigation/Header"

import bgImage from "assets/images/read-g18fc55640_1920.jpg";
import { useEffect, useState, useMemo } from "react";
import OrganizationRequest from 'services/organizationrequest.service';
import Auth from 'services/auth.service';
import { useSearchParams } from "react-router-dom";
import MKAlert from "components/MKAlert";
import Icon from "@mui/material/Icon";
import PasswordStrengthBar from 'react-password-strength-bar';
import UploadToS3WithNativeSdk from "components/UploadS3";
import MKAvatar from "components/MKAvatar";
import PhoneInput from 'react-phone-input-2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import countryList from 'react-select-country-list'


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
  const [imgLoad, setImgLoad] = useState(false);
  const [fileName, setFileName] = useState("");
  const [passError, setPassError] = useState("");
  const options = useMemo(() => countryList().getData(), [])

  const handleChange = (event) => {
    setErrors({ ...errors, "organizationType": "" })
    setUserDetails({
      ...userDetails, "organizationType": event.target.value
    })
  };



  const [errors, setErrors] = useState({
    "Firstname": "",
    "Lastname": "",
    "Password": "",
  });
  const [laoding, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState({
    "Firstname": "",
    "Lastname": "",
    "MiddleName": "",
    "email": "",
    "Password": "",
    "OrganizationName": "",
    "organizationType": "",
    "EndPoint": "",
    "AboutOrganziation": "",
    "OrganizationRequestId": 0,
    "ProfileInfo": "",
    "logo": "",
    "contactNumber": "",
    "address": "",
    "countryCode": ""
  })
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  const [createClick, setCreateClick] = useState(false)
  const [response, setResponse] = useState({
    status: false,
    error: false,
    message: ""
  });

  useEffect(() => {
    OrganizationRequest.getOrganizationRequestDetails(searchParams.get("orgId")).then((res) => {
      setLoading(false)
      if (res.data.statusCode != 200) {
        throw { "message": res.data.message }
      }
      else {
        setUserDetails({
          ...userDetails,
          "Firstname": res.data.result.firstName,
          "Lastname": res.data.result.lastName,
          "email": res.data.result.emailAddress,
          "OrganizationName": res.data.result.organizationName,
          "EndPoint": res.data.result.organizationName.replace(/\s+/g, '-').toLowerCase(),
          "OrganizationRequestId": res.data.result.organizationRequestId
        })
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
  }, [])

  const validatePass = (score, feedback) => {
    if ("warning" in feedback) setSuggestions(feedback["warning"])
    setUserDetails({
      ...userDetails, "Password": password
    })
    if (score < 1) {
      setErrors({ ...errors, "Password": "Please use a strong password" })
    }
    else {
      setPassError("")
    }
  }

  useEffect(() => {
    if (fileName != "" && !imgLoad) {
      setUserDetails({
        ...userDetails, "logo": fileName
      })
    }
  }, [imgLoad])


  const saveData = () => {
    setCreateClick(true)
    let errors_ = {}
    if (userDetails.organizationType == "") {
      errors_.organizationType = "Required";
      setErrors(prev => ({ ...prev, "organizationType": "Required" }))
    }
    if (userDetails.address == "") {
      errors_.Address = "Required";
      setErrors(prev => ({ ...prev, "Address": "Required" }))
    }
    if (userDetails.countryCode == "") {
      errors_.countryCode = "Required";
      setErrors(prev => ({ ...prev, "countryCode": "Required" }))
    }
    if (errors.Password != "") {
      errors_.Password = errors.Password
    }
    else if (userDetails.Password == "") {
      errors_.Password = "Required"
      setErrors(prev => ({ ...prev, "Password": "Required" }))
    }
    if (Object.keys(errors_).length === 0) {

      setLoading(true)
      Auth.addOrganization(userDetails).then(() => {
        setLoading(false)
        setResponse({
          status: true,
          error: false,
          message: "Configured"
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
                    User
                  </MKTypography>
                </MKBox>
                <MKBox p={3} sx={{ zIndex: 0 }}>

                  <MKBox width="100%" component="form" method="post" autoComplete="off">
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <MKInput
                          // variant="standard"
                          label="First Name"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={userDetails.Firstname}
                          disabled={true}
                        />

                      </Grid>
                      <Grid item xs={12} md={4}>
                        <MKInput
                          // variant="standard"
                          label="Middle Name"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          onBlur={(e) => setUserDetails({ ...userDetails, "MiddleName": e.target.value })}
                        />

                      </Grid>
                      <Grid item xs={12} md={4}>
                        <MKInput
                          // variant="standard"
                          label="Last Name"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={userDetails.Lastname}
                          disabled={true}
                        />


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
                      <Grid item xs={12} md={6}>
                        <MKInput
                          type="password"
                          // variant="standard"
                          label="Password"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "Password": "Required" }) }}
                          onKeyPress={() => setShowPasswordStrength(true)}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors(prev => ({ ...prev, "Password": "" }));
                            e.target.value == "" ? setShowPasswordStrength(false) & setSuggestions("") : setShowPasswordStrength(true);
                          }}
                          required
                          error={userDetails.Password != "" || !createClick ? false : true}
                        />


                        {
                          showPasswordStrength ? <PasswordValidation password={password} errors={errors} validatePass={validatePass} suggestions={suggestions} /> :
                            null
                        }

                        {"Password" in errors ? <MKTypography

                          fontSize="0.75rem"
                          color="error"
                          style={{ display: "block" }}
                          textGradient
                        >
                          {errors["Password"]}
                        </MKTypography> : null}



                      </Grid>
                      {/* <Grid item xs={12} md={6}>
                        <MKInput
                          type="password"
                          variant="standard"
                          label="Confirm Password"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          onBlur = {(e) => {
                            e.target.value == "" && setErrors({...errors,"CnfrmPassword" : "Required"});
                          }}
                          onChange={(e) => {
                            setUserDetails({ ...userDetails, "CnfrmPassword": e.target.value });
                            setErrors(prev => ({ ...prev, "CnfrmPassword": "" }));
                            e.target.value != userDetails.Password && setErrors({...errors,"CnfrmPassword" : "Confirm Password must match with Password"});
                          }}
                          required
                          error={userDetails.Password != "" || !createClick ? false : true}
                        />
                        {"CnfrmPassword" in errors ? <MKTypography

                          fontSize="0.75rem"
                          color="error"
                          style={{ display: "block" }}
                          textGradient
                        >
                          {errors["CnfrmPassword"]}
                        </MKTypography> : null}
                      </Grid> */}
                      <Grid item xs={12}>
                        <MKInput
                          type="text"
                          // variant="standard"
                          label="User Info"
                          multiline rows={2}
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          onBlur={(e) => setUserDetails({ ...userDetails, "ProfileInfo": e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <MKInput
                          type="text"
                          // variant="standard"
                          label="Organization Name"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          value={userDetails.OrganizationName}
                          disabled={true}

                        />
                      </Grid>
                      <Grid item xs={12} md={6}>

                        <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required>
                          <InputLabel id="demo-simple-select-autowidth-label">Organization Type</InputLabel>
                          <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            onChange={handleChange}
                            onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "organizationType": "Required" }) }}
                            autoWidth
                            label="Organization Type"
                            required
                            error={userDetails.organizationType != "" || !createClick ? false : true}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={"1"}>School</MenuItem>
                            <MenuItem value={"2"}>University</MenuItem>
                            <MenuItem value={"3"}>Day Care</MenuItem>
                            <MenuItem value={"4"}>Extra Curricular Activities</MenuItem>
                            <MenuItem value={"5"}>Club</MenuItem>
                          </Select>
                        </FormControl>
                        {"organizationType" in errors ? <MKTypography

                          fontSize="0.75rem"
                          color="error"
                          style={{ display: "block" }}
                          textGradient
                        >
                          {errors["organizationType"]}
                        </MKTypography> : null}
                      </Grid>
                      <Grid item xs={12}>
                        <MKInput
                          // variant="standard"
                          label="Address"
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          required
                          onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "Address": "Required" }) }}
                          error={userDetails.Address != "" || !createClick ? false : true}
                          onChange={(e) => { setUserDetails({ ...userDetails, "address": e.target.value }); setErrors(prev => ({ ...prev, "Address": "" })) }}
                        />
                        {"Address" in errors ? <MKTypography

                          fontSize="0.75rem"
                          color="error"
                          style={{ display: "block" }}
                          textGradient
                        >
                          {errors["Address"]}
                        </MKTypography> : null}
                      </Grid>
                      <Grid item xs={12} md={6}>

                        <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required>
                          <InputLabel id="demo-simple-select-autowidth-label">Country</InputLabel>
                          <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            onChange={(e) => { setUserDetails({ ...userDetails, "countryCode": e.target.value }); setErrors(prev => ({ ...prev, "countryCode": "" })) }}
                            onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "countryCode": "Required" }) }}
                            autoWidth
                            label="Country"
                            required
                            error={userDetails.countryCode != "" || !createClick ? false : true}
                          >
                            {options.map((res,ind) => <MenuItem key={ind} value={res.label}>{res.label}</MenuItem>)}

                          </Select>
                        </FormControl>


                        {"countryCode" in errors ? <MKTypography

                          fontSize="0.75rem"
                          color="error"
                          style={{ display: "block" }}
                          textGradient
                        >
                          {errors["countryCode"]}
                        </MKTypography> : null}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <PhoneInput onChange={phone => setUserDetails({ ...userDetails, "contactNumber": phone })} />
                      </Grid>

                      <Grid item xs={12}>
                        <MKInput
                          type="text"
                          // variant="standard"
                          label="Organization Info"
                          multiline rows={2}
                          // InputLabelProps={{ shrink: true }}
                          fullWidth
                          onBlur={(e) => setUserDetails({ ...userDetails, "AboutOrganziation": e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={8} display='flex' justifyContent='center' alignItems="center">
                        <UploadToS3WithNativeSdk setImage={setCompanyImg} setLoad={setImgLoad} setFileName={setFileName} fileType="image" title="UPload image" />
                      </Grid>
                      <Grid item xs={4} display='flex' justifyContent='center' alignItems="center">
                        {imgLoad ? <CircularProgress color="inherit" /> :
                          <MKAvatar src={companyImg} className="logo_2" variant="square" alt="Avatar" size="lg" />}
                      </Grid>

                    </Grid>

                    <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                      <MKButton onClick={saveData} variant="gradient" color="info">
                        Create
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
