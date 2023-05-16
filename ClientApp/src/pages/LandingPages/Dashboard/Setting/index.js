import React from "react";
import { useState, useEffect } from "react";
import MKBox from "components/MKBox";
import Divider from "@mui/material/Divider";
import MKTypography from "components/MKTypography";
import MKAvatar from "components/MKAvatar";
import InputLabel from "@mui/material/InputLabel";
import MKButton from "components/MKButton";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import MKInput from "components/MKInput";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ChangePassword from "../changePassword";
import authService from "services/auth.service";
import CircularProgress from '@mui/material/CircularProgress';
import UploadToS3WithNativeSdk from "components/UploadS3";
import { toast, ToastContainer } from "react-toastify";
import Bucket from '../../../../aws';
import awsService from "services/aws.service";
import "react-toastify/dist/ReactToastify.css";
import OtpInput from 'react-otp-input';
function Portal() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")))
  const [settingModal, setSettingModal] = useState(false);
  let errror = {};
  const [erorr_, setError_] = useState({
    firstName: "",
    lastName: "",
    password: "",
    date: "",
  });
  const drawerWidth = 72;
  const [date, setDate] = useState({
    day: "01",
    month: "01",
    year: "1999",
  });
  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
  const [imgLoad, setImgLoad] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  const [userImg, setUserImg] = React.useState();
  const [emails, setEmails] = useState([])
  const [additionalEmail, setAdditionalEmail] = useState("")
  const [emailError, setEmailError] = useState()
  const [otp, setOtp] = useState()
  const [otpDisplay, setOtpDisplay] = useState(false)
  // const [companyImg, setCompanyImg] = React.useState();
  // useEffect(()=>{
  //    userData = JSON.parse(localStorage.getItem("user"));
  // },[firstName,lastName,date])

  const getFirstName = (e) => {
    setFirstName(e.target.value);
  };
  const getLastName = (e) => {
    setLastName(e.target.value);
  };

  useEffect(() => {
    if (firstName.trim() == "") {
      errror["firstName"] == "required"
    } else {
      errror["firstName"] == ""
    }
    if (lastName.trim() == "") {
      errror["lastName"] == "required"
    } else {
      errror["lasttName"] == ""
    }
    setError_(errror);
  }, [firstName, lastName])
  const saveData = () => {

    let errror = {};
    if (firstName.trim() == "" || firstName.trim() == "" || date == null) {
      if (firstName == "") {
        errror["firstName"] = "required";
      }
      if (lastName == "") {
        errror["lastName"] = "required";
      }
      if (date == null) {
        errror["date"] = "required";
      }
      setError_(errror);
    } else {
      let dob;
      console.log(date, " date in ")
      if (erorr_["firstName"] !== "" && erorr_["lastName"] !== "") {
        if (date !== null) {
          dob = typeof date == "string" ? date : date.format('LL');
        }
        else {
          dob = null;
        }

        let newInfo = { ...userData, "firstName": firstName, "lastName": lastName, "dob": dob, "image": fileName };
        let userId = newInfo.userId;
        authService.updateUserInfo(userId, firstName, lastName, dob, fileName).then((res) => {
          setUserData(newInfo)
          localStorage.setItem("user", JSON.stringify(newInfo));



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
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        }).catch((err) => {
          console.log(err.response)



          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                {err.response}
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          )

        })
      }
    }
  }

  const handleSettingModal = () => {
    setSettingModal(true);
  };

  useEffect(() => {
    setFirstName(userData?.firstName.trim());
    setLastName(userData?.lastName.trim());
    setDate(userData?.dob);
    setFileName(userData?.image)
    // Bucket.promisesOfS3Objects(userData?.image)
    //   .then((data) => {
    //     setUserImg(data);
    //   })
    //   .catch(function (err) {
    //     console.log(err)
    //   })
      awsService.GetSignedUrl(userData?.image).then((res)=>{
        // console.log(res," res from get api bucket")
        setUserImg(res.data.result)
      })
    authService.GetEmailsByOrganization(orgId, userData?.userId).then(res => {
      console.log("response Emails", res)
      setEmails(res.data.result)
    })
  }, []);
  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  const handleAdditionalEmail = () => {

    if (additionalEmail == "" || additionalEmail == undefined) {
      // console.log("first")
      setEmailError("required")
    } else
      if (!isEmail(additionalEmail)) {
        // console.log("2nd")
        setEmailError("provide valid email")
      } else {
        // console.log("3rd")
        setEmailError("")
        authService.AddEmailForOrganization({
          "email": additionalEmail,
          "userId": userData?.userId,
          "organizationId": orgId
        }).then((res) => {



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


          setOtpDisplay(true)
        }).catch((err) => {


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
        })
      }
  }
  const handleOtp = (e) => {
    setOtp(e)
  }

  const handleVerifyEmail = () => {
    authService.VerifyEmailByPin({
      "email": additionalEmail,
      "userId": userData?.userId,
      "organizationId": orgId,
      "pin": parseInt(otp)
    }).then(() => {
      setAdditionalEmail("")
      authService.GetEmailsByOrganization(orgId, userData?.userId).then(res => setEmails(res.data.result))
      setOtp(false)
      setOtpDisplay(false)
    })
  }

  const handleNotification = (data) => {
    if (emails.length != 1 && emails.some((e) => e.isNotificationOn && data.emailId != e.emailId)) {
      authService.TurnNotificationOnOff({
        "emailId": data.emailId,
        "isNotificationsOn": !data.isNotificationOn
      }).then((res) => {

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


        authService.GetEmailsByOrganization(orgId, userData?.userId).then(res => setEmails(res.data.result))
      }).catch((err) => {



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


      })
    }
    else {




      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
            Atleast One email/username is required to be notified !
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )
    }
  }
  const handleDelete = (data) => {
    if (emails.length != 1) {
      authService.RemoveEmailId(data.emailId).then((res) => {



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



        authService.GetEmailsByOrganization(orgId, userData?.userId).then(res => setEmails(res.data.result))
      }).catch((err) => {



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

      })
    }
    else {




      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
            Atleast One email/username is required !
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )

    }
  }

  const PrimaryEmail = (ele) => {
    authService.SetPrimaryEmail(ele.emailId).then(() => {
      authService.GetEmailsByOrganization(orgId, userData?.userId).then(res => setEmails(res.data.result))
    })
  }

  return (
    // <div>Portal</div>
    <MKBox
      component="main"
      bgColor="white"
      borderRadius="xl"
      shadow="lg"
      display="flex"
      flexDirection="column"
      sx={{ p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    >
      {/* <Toolbar /> */}
      {/* <ToastContainer /> */}
      <MKBox
        sx={{
          //   flexGrow: 1,
          display: "flex",
          p: 3,
          justifyContent: "space-between",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <MKTypography variant="h4">
          {userData.firstName} {userData.lastName} settings
        </MKTypography>
        {/* <MKAvatar src="/broken-image.jpg" /> */}
        <MKBox sx={{}}>
          <MKBox mb={1} sx={{ display: "flex", justifyContent: "center" }}>
            {imgLoad ? <CircularProgress color="inherit" /> :
              <Avatar src={userImg} variant="circle" alt="Avatar" size="lg"></Avatar>
            }
          </MKBox>
          <Grid item xs={6} display='flex' justifyContent='center' alignItems="center">
            <UploadToS3WithNativeSdk setImage={setUserImg} setLoad={setImgLoad} setFileName={setFileName} fileType="image" title="Update Profile Picture" />
          </Grid>
          {/* <Grid item xs={6} display='flex' justifyContent='center' alignItems="center">
                        {imgLoad ? <CircularProgress color="inherit" /> :
                            <MKAvatar  src={userImg} className="logo_2" variant="square" alt="Avatar" size="lg" />}
                    </Grid> */}
        </MKBox>
      </MKBox>
      <Divider style={{ height: "3px", marginTop: "2px" }} />
      <MKBox>
        <MKBox mt={2}>
          <MKInput
            label="First Name"
            sx={{ width: 400 }}
            required
            value={firstName}
            // error={firstName != "" || !clickCreate ? false : true}
            onChange={(e) => getFirstName(e)}
          />
          {"firstName" in erorr_ ? (
            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {erorr_["firstName"]}
            </MKTypography>
          ) : null}
        </MKBox>
        <MKBox mt={2}>
          <MKInput
            label="Last Name"
            sx={{ width: 400 }}
            required
            value={lastName}
            // error={firstName != "" || !clickCreate ? false : true}
            onChange={(e) => getLastName(e)}
          />
          {"lastName" in erorr_ ? (
            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {erorr_["lastName"]}
            </MKTypography>
          ) : null}
        </MKBox>
        <MKBox mt={2} sx={{ width: 400 }}>
          <InputLabel style={{ marginBottom: 10 }}>Date of Birth</InputLabel>
          <Grid container>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Date"
                  value={date}
                  maxDate={new Date().setDate(0)}
                  onChange={(newValue) => {
                    setDate(newValue); setError_({ ...erorr_, "date": "" })
                    console.log(newValue, " datae");
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          {"date" in erorr_ ? (
            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {erorr_["date"]}
            </MKTypography>
          ) : null}
        </MKBox>
        <MKBox mt={2} mb={2}>
          <MKButton variant="gradient" color="info" onClick={handleSettingModal}>
            Change Password
          </MKButton>
        </MKBox>
        <MKButton variant="gradient" color="info" onClick={saveData}>
          Save
        </MKButton>
      </MKBox>
      <Divider style={{ height: "3px", marginTop: "5px" }} />
      <MKBox mt={2}>
        <MKTypography variant="h5">Email associated with orgNAME:</MKTypography>
        <MKBox >
          {
            emails?.map((ele, ind) => {
              return <Grid key={ind} mt={2} display="flex" >
                <li style={{ width: "400px" }}>{ele.email}</li>
                <MKButton color={ele.isNotificationOn ? "success" : "secondary"} variant="contained" sx={{ marginLeft: "100px", marginRight: "100px" }} onClick={() => handleNotification(ele)} >{ele.isNotificationOn ? "Turn Notification OFF" : "Turn Notification ON"}</MKButton>
                <MKButton color="error" variant="contained" onClick={() => handleDelete(ele)} >Remove this email</MKButton>
                <MKButton color={ele.isPrimary ? "success" : "secondary"} variant="contained" sx={{ marginLeft: "100px", marginRight: "100px" }} onClick={() => PrimaryEmail(ele)}>Primary Email</MKButton>
              </Grid>
            }
            )
          }
        </MKBox>
      </MKBox>
      <Divider style={{ height: "3px", marginTop: "5px" }} />
      <MKBox mt={2} display="flex" mb={2}>
        {!otpDisplay ?
          <>
            <MKBox>          <MKInput
              label="Add an Additional Email"
              sx={{ width: 400 }}
              required
              value={additionalEmail}
              // error={firstName != "" || !clickCreate ? false : true}
              onChange={(e) => { setAdditionalEmail(e.target.value); setEmailError("") }}
            />
              {emailError ? <MKTypography
                fontSize="0.75rem"
                color="error"
                style={{ display: "block" }}
                textGradient >
                {emailError}
              </MKTypography> : null}
            </MKBox>

            <MKButton variant="contained" color="info" sx={{ marginLeft: 10, marginRight: 10 }} onClick={handleAdditionalEmail}>Add Email</MKButton>
          </>
          :
          <>
            <MKBox mb={2}>
              <MKTypography>Enter OTP</MKTypography>
              <OtpInput
                inputStyle={{ fontSize: "30px" }}
                style={{ fontSize: "60px" }}
                value={otp}
                onChange={handleOtp}
                numInputs={6}
                separator={<span>-</span>}
              />

            </MKBox>
            <MKButton variant="contained" color="info" sx={{ marginLeft: 10, marginRight: 10 }} onClick={handleVerifyEmail}>Verify Otp</MKButton>

          </>
        }
      </MKBox>
      <ChangePassword visible={settingModal} setVisible={setSettingModal} />

    </MKBox>
  );
}

export default Portal;



//  let newinfo = {...userdata, "f":v, "l":v , d }