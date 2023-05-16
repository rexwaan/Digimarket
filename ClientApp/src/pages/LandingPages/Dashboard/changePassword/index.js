import React, { useEffect } from "react";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import authService from "services/auth.service";
import { toast, ToastContainer } from 'react-toastify';
import PasswordStrengthBar from 'react-password-strength-bar';
import "react-toastify/dist/ReactToastify.css";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
export default function KeepSettingModal({ visible, setVisible }) {
  const handleClose = () => setVisible(false);
  const [oldPassword, setOldPassword] = useState("");
  const [userid, setUserid] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = React.useState({});
  const [suggestions, setSuggestions] = useState("");
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)
  const [response, setResponse] = React.useState({
    status: false,
    error: false,
    message: "",
  });
  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user, " JSON Object")
    setUserid(user?.userId);
    console.log(" ghghhg", user?.userId)
  }, [])
  const validatePass = (score, feedback) => {
    if ("warning" in feedback) setSuggestions(feedback["warning"])
    // // setUserDetails({
    // //   ...userDetails, "Password": password
    // // })
    if (score < 1) {
      setErrors({ ...errors, "newPass": "Please use a strong password" })
    }
    else {
      setErrors({ ...errors, "newPass": "" })
    }
  }

  const saveData = () => {
    if (oldPassword.trim() == "" || newPassword.trim() == "") {
      if (oldPassword.trim() == "") {
        setErrors((prev) => ({ ...prev, oldPass: "Required" }))
      }
      if (newPassword.trim() == "") {
        setErrors((prev) => ({ ...prev, newPass: "Required" }))
      }
    }
    else {
      if (errors["newPass"] == "" && errors["oldPass"] == "") {
        authService.checkPassword(userid, oldPassword).then((res) => {
          console.log(res.data, "password data")
          authService.resetPassword(newPassword, userid, false, orgId).then((resp) => {
            console.log(resp.data, " password reset");

            toast.success(
              <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                <MKTypography variant="contained" color="secondary">
                {resp.data.message}
                </MKTypography>
              </MKBox>,
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
              }
            )
            // setSuggestions("")
            setShowPasswordStrength(false)
            setResponse({});
            setErrors((prev) => ({ ...prev, newPass: "" }))
            setTimeout(() => {
              setVisible(false);
              setOldPassword("");
              setNewPassword("");
            }, 1000)
          }).catch((err) => {
            console.log(" password match error")
            setResponse({
              error: true,
              message: err?.response ? err?.response.data.message : err?.message
            })
          })
        }).catch((err) => {
          console.log(err, " check password error data")
          // setLoading(false)
          setResponse({
            error: true,
            message: err?.response ? err?.response.data.message : err?.message
          })
        })
        //

      }
    }
  }

  return (
    <Modal
      keepMounted
      open={visible}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <MKBox width="100%" component="form" method="post" autoComplete="off" sx={style}>
        <Grid container spacing={3}>
          <Grid item xs={12} >
            <MKInput
              type="text"
              label="Old Password"
              required

              fullWidth

              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value)
                setErrors((prev) => ({ ...prev, oldPass: "" }));
              }}
            />
            {"oldPass" in errors ? <MKTypography

              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors["oldPass"]}
            </MKTypography> : null}
          </Grid>
          <Grid item xs={12} >
            <MKInput
              type="password"
              label="Password"
              fullWidth
              value={newPassword}
              onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "newPass": "Required" }) }}
              onKeyPress={() => setShowPasswordStrength(true)}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors(prev => ({ ...prev, "newPass": "" }));
                e.target.value == "" ? setShowPasswordStrength(false) & setSuggestions("") : setShowPasswordStrength(true);
              }}
              required
            />
            {
              showPasswordStrength ? <PasswordValidation password={newPassword} errors={errors} validatePass={validatePass} suggestions={suggestions} /> :
                null
            }

            {"newPass" in errors ? <MKTypography

              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors["newPass"]}
            </MKTypography> : null}



          </Grid>
          <Grid item xs={12}>
            <MKButton variant="gradient" color="info" onClick={saveData} >
              Submit
            </MKButton>
          </Grid>
        </Grid>
        <MKBox mt={3} mb={1} textAlign="center">
          {response.error ? <MKTypography

            fontSize="0.75rem"
            color="error"
            style={{ display: "block" }}
            textGradient
          >
            {response.message}
          </MKTypography> : null}
        </MKBox>
      </MKBox>
    </Modal>
  );
}
