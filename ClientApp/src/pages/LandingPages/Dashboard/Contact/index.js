import MKBox from "components/MKBox";
import React, { useState } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import Toolbar from "@mui/material/Toolbar";
// import ListItem from "@mui/material/ListItem";
// import Divider from "@mui/material/Divider";
// import ListItemText from "@mui/material/ListItemText";
// import ListItemAvatar from "@mui/material/ListItemAvatar";
// import Avatar from "@mui/material/Avatar";
// import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../organisationDetail.css";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useLocation } from "react-router-dom";
// import MKAvatar from "components/MKAvatar";
// import AskToJoin from "../AskToJoin";
// import contactService from "services/contact.service";
import MKAlert from "components/MKAlert";
// import EditOrg from "../EditOrg";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import Logo from "../../../../Navigation/Header"
// import DeleteOrg from "../DeleteOrg"


import contactService from "../../../../services/contact.service"

import bgImage from "assets/images/read-g18fc55640_1920.jpg";

function Contact() {
    // const [openAskToJoinModal, setOpenAskToJoinModal] = React.useState(false);
    const [createClick, setCreateClick] = useState(false);
    // const [editFormVisible, setEditFormVisible] = useState(false);
    // const [deleteVisible, setDeleteVisible] = useState(false);
    const [showCaptcha, setShowCaptcha] = useState(false);
  
    const { state } = useLocation();
    const [success, setSuccess] = useState(false);
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const permissions = localStorage.getItem("permissions")
      ? JSON.parse(localStorage.getItem("permissions"))
      : [];
    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : 0;


    const handleChange = (event) => {
        setErrors({ ...errors, topic: "" });
        setUserDetails({
          ...userDetails,
          topic: event.target.value,
        });
      };
      const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        emailAddress: "",
      });
 
      const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
      const [userDetails, setUserDetails] = useState({
        firstName: user == null ? "" : user?.firstName,
        lastName: user == null ? "" : user?.lastName,
        emailAddress: user == null ? "" : user?.email,
        phone: user == null ? "" : user?.contactNumber,
        topic: "",
        message: "",
        organizationID: state?.data?.organizationId,
      });
  const saveData = () => {
    setCreateClick(true);
    let errors_ = {};
    if (userDetails.topic == "") {
      errors_.topic = "Required";
      setErrors((prev) => ({ ...prev, topic: "Required" }));
    }
    if (userDetails.message == "") {
      errors_.message = "Required";
      setErrors((prev) => ({ ...prev, message: "Required" }));
    }
    if (userDetails.firstName == "") {
      errors_.firstName = "Required";
      setErrors((prev) => ({ ...prev, firstName: "Required" }));
    }
    if (userDetails.lastName == "") {
      errors_.lastName = "Required";
      setErrors((prev) => ({ ...prev, lastName: "Required" }));
    }
    if (!isEmail(userDetails.emailAddress)) {
      errors_.emailAddress = "Please provide a valid Email";
      setErrors((prev) => ({ ...prev, emailAddress: "Please provide a valid Email" }));
    } else if (userDetails.emailAddress == "") {
      errors_.Password = "Required";
      setErrors((prev) => ({ ...prev, emailAddress: "Required" }));
    }
    if (Object.keys(errors_).length === 0) {
      setShowCaptcha(true);
    }
  };
  const onVerifyCaptcha = (token) => {
    if (token) {
      contactService.AddContactUsRequest(userDetails).then(() => {
        setSuccess(true);
        setShowCaptcha(false);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      });
    }
  };





  return (
    <>
      <Grid container  alignItems="center" display="flex">
        <Logo position="fixed" />
        <Grid item xs={12} sm={6} lg={6}>
          <MKBox
            display={{ xs: "none", lg: "flex" }}
            width="calc(100% - 2rem)"
            height="calc(100vh - 2rem)"
            borderRadius="lg"
            ml={2}
            mt={2}
            sx={{ backgroundImage: `url(${bgImage})`, backgroundSize: "contain",backgroundRepeat:"no-repeat" }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
        <MKBox
                bgColor="white"
                borderRadius="xl"
                shadow="lg"
                display="flex"
                flexDirection="column"  
                justifyContent="center"
                mt={{ xs: 20, sm: 10, md: 10 }}
                mb={{ xs: 20, sm: 18, md: 20 }}
                mx={3}
              >
                <Grid item xs={12} lg={12}>
                <MKBox
                  variant="gradient"
                  bgColor="info"
                  coloredShadow="info"
                  borderRadius="lg"
                  p={2}
                  mx={2}
                  mt={-3}
                >
        {/* <Grid item xs={12} lg={4}> */}
          <MKTypography variant="h3" color="white" mt={2}>
            Contact {state?.data?.name}:
          </MKTypography>
          
          </MKBox>
                    
          <MKBox p={3}>
            <MKBox width="100%" component="form" method="post" autoComplete="off">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <MKInput
                    // variant="standard"
                    label="First Name"
                    // InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    InputProps={{ readOnly: user ? true : false }}
                    value={userDetails.firstName}
                    onBlur={(e) => {
                      e.target.value == "" && setErrors({ ...errors, firstName: "Required" });
                    }}
                    error={userDetails.firstName != "" || !createClick ? false : true}
                    onChange={(e) => {
                      setUserDetails({ ...userDetails, firstName: e.target.value });
                      setErrors((prev) => ({ ...prev, firstName: "" }));
                    }}
                  />
                  {"firstName" in errors ? (
                    <MKTypography
                      fontSize="0.75rem"
                      color="error"
                      style={{ display: "block" }}
                      textGradient
                    >
                      {errors["firstName"]}
                    </MKTypography>
                  ) : null}
                </Grid>
                <Grid item xs={12} md={6}>
                  <MKInput
                    // variant="standard"
                    label="Last Name"
                    InputProps={{ readOnly: user ? true : false }}
                    fullWidth
                    value={userDetails.lastName}
                    required
                    onBlur={(e) => {
                      e.target.value == "" && setErrors({ ...errors, lastName: "Required" });
                    }}
                    error={userDetails.lastName != "" || !createClick ? false : true}
                    onChange={(e) => {
                      setUserDetails({ ...userDetails, lastName: e.target.value });
                      setErrors((prev) => ({ ...prev, lastName: "" }));
                    }}
                  />
                  {"lastName" in errors ? (
                    <MKTypography
                      fontSize="0.75rem"
                      color="error"
                      style={{ display: "block" }}
                      textGradient
                    >
                      {errors["lastName"]}
                    </MKTypography>
                  ) : null}
                </Grid>
                <Grid item xs={12} md={6}>
                  <MKInput
                    type="email"
                    // variant="standard"
                    label="Email"
                    InputProps={{ readOnly: user ? true : false }}
                    fullWidth
                    value={userDetails.emailAddress}
                    required
                    onBlur={(e) => {
                      e.target.value == "" && setErrors({ ...errors, emailAddress: "Required" });
                    }}
                    error={userDetails.emailAddress != "" || !createClick ? false : true}
                    onChange={(e) => {
                      setUserDetails({ ...userDetails, emailAddress: e.target.value });
                      setErrors((prev) => ({ ...prev, emailAddress: "" }));
                    }}
                  />
                  {"emailAddress" in errors ? (
                    <MKTypography
                      fontSize="0.75rem"
                      color="error"
                      style={{ display: "block" }}
                      textGradient
                    >
                      {errors["emailAddress"]}
                    </MKTypography>
                  ) : null}
                </Grid>
                <Grid item xs={12} md={6}>
                  <PhoneInput
                    value={userDetails.phone}
                    onChange={(phone) => setUserDetails({ ...userDetails, phone: phone })}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required>
                    <InputLabel id="demo-simple-select-autowidth-label">Topic</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      onChange={handleChange}
                      onBlur={(e) => {
                        e.target.value == "" && setErrors({ ...errors, topic: "Required" });
                      }}
                      autoWidth
                      label="Topic"
                      required
                      error={userDetails.topic != "" || !createClick ? false : true}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={"Joining"}>Joining</MenuItem>
                      <MenuItem value={"Registration"}>Registration</MenuItem>
                      <MenuItem value={"Information Request"}>Information Request</MenuItem>
                      <MenuItem value={"Technical Issue"}>Technical Issue</MenuItem>
                      <MenuItem value={"Suggestion"}>Suggestion</MenuItem>
                    </Select>
                  </FormControl>
                  {"topic" in errors ? (
                    <MKTypography
                      fontSize="0.75rem"
                      color="error"
                      style={{ display: "block" }}
                      textGradient
                    >
                      {errors["topic"]}
                    </MKTypography>
                  ) : null}
                </Grid>

                <Grid item xs={12} lg={12}>
                  <MKInput
                    type="text"
                    // variant="standard"
                    label="Message"
                    multiline
                    rows={4}
                    // InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                    onBlur={(e) => {
                      e.target.value == "" && setErrors({ ...errors, message: "Required" });
                    }}
                    onChange={(e) => {
                      setUserDetails({ ...userDetails, message: e.target.value });
                      setErrors((prev) => ({ ...prev, message: "" }));
                    }}
                  />
                  {"message" in errors ? (
                    <MKTypography
                      fontSize="0.75rem"
                      color="error"
                      style={{ display: "block" }}
                      textGradient
                    >
                      {errors["message"]}
                    </MKTypography>
                  ) : null}
                </Grid>
              </Grid>

              <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                {!showCaptcha ? (
                  <MKButton onClick={saveData} variant="gradient" color="info">
                    Submit
                  </MKButton>
                ) : (
                  <HCaptcha
                    sitekey="ad09a53d-c1b4-4815-9553-d2716182d40a"
                    onVerify={onVerifyCaptcha}
                  />
                )}
              </Grid>

              <Grid container item justifyContent="center">
                {success && <MKAlert color="success">Message Sent Successfully</MKAlert>}
              </Grid>
            </MKBox>
          </MKBox>
        </Grid>
        </MKBox>
        </Grid>
      </Grid>
    </>
  );
}

export default Contact;
