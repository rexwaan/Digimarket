

import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import { useSearchParams } from "react-router-dom";
import PasswordStrengthBar from "react-password-strength-bar";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import CircularProgress from '@mui/material/CircularProgress';

import authService from "services/auth.service";
// import Logo from '../../../examples/Logo'
import Logo from "../../../Navigation/Header"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


const PasswordValidation = ({ password, validatePass, errors, suggestions }) => {
    return (
        <>
            <PasswordStrengthBar minLength="8" password={password} onChangeScore={validatePass} />
            {suggestions != "" && (
                <MKTypography fontSize="0.75rem" color="error" textGradient>
                    {suggestions}
                </MKTypography>
            )}
        </>
    );
};

function Reset() {


    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("")
    const [laoding, setLoading] = useState(false)
    const [clickCreate, setClickCreate] = useState(false);
    const [userID, setUserID] = useState(0);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [suggestions, setSuggestions] = useState("");
    const [showPasswordStrength, setShowPasswordStrength] = useState(false);

    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;


    const [response, setResponse] = useState({
        status: false,
        error: false,
        message: ""
    });

    const validatePass = (score, feedback) => {
        if ("warning" in feedback) setSuggestions(feedback["warning"]);
        if (score < 1) {
            setErrors("Please use a strong password");
        } else {
            setErrors("");
        }
    };


    const ResetPassword = () => {
        setClickCreate(true)
        if (password == "") {
            setErrors("Required")
        }
        else if (errors.trim() == "") {
            setLoading(true)
            authService.resetPassword(password, parseInt(searchParams.get("userId")), false, orgId).then((res) => {
                setLoading(false)
              

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
                    navigate("/authentication/sign-in")
                }, 2000);

            }).catch((err) => {
                setLoading(false)
                setResponse({
                    error: true,
                    message: err?.response ? err?.response.data.message : err?.message
                })
              


                toast.error(
                    <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                      <MKTypography variant="contained" color="secondary">
                      {err?.response ? err?.response.data.message : err?.message}
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
    return (
        <>
    //   <Logo position="fixed" />
            <MKBox
                position="absolute"
                top={0}
                left={0}
                zIndex={0}
                width="100%"
                minHeight="100vh"
                sx={{
                    backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
                        `${linearGradient(
                            rgba(gradients.dark.main, 0.6),
                            rgba(gradients.dark.state, 0.6)
                        )}, url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            />
            <ToastContainer />
            <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={0}>
                <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
                    <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
                        <Card>
                            <MKBox
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                                mx={2}
                                mt={-3}
                                p={2}
                                mb={1}
                                textAlign="center"
                            >
                                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1} >
                                    Reset Password
                                </MKTypography>

                            </MKBox>
                            <MKBox pt={4} pb={3} px={3}>
                                <MKBox component="form" role="form">
                                    <MKBox mb={2}>
                                        <MKInput type="password" variant="standard"
                                            label="New Password" fullWidth required
                                            error={password != "" || !clickCreate ? false : true}
                                            value={password}
                                            onBlur={(e) => {
                                                e.target.value == "" && setErrors("required");
                                            }}
                                            //  onChange={getPassword} 
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setErrors("");
                                                e.target.value == ""
                                                    ? setShowPasswordStrength(false) & setSuggestions("")
                                                    : setShowPasswordStrength(true);
                                                setResponse(prev => ({ ...prev, error: false }))
                                            }}


                                        />
                                        {showPasswordStrength ? (
                                            <PasswordValidation
                                                password={password}
                                                errors={errors}
                                                validatePass={validatePass}
                                                suggestions={suggestions}
                                            />
                                        ) : null}
                                        {errors ? <MKTypography

                                            fontSize="0.75rem"
                                            color="error"
                                            style={{ display: "block" }}
                                            textGradient
                                        >
                                            {errors}
                                        </MKTypography> : null}
                                    </MKBox>

                                    <MKBox mt={4} mb={1}>
                                        <MKButton variant="gradient" color="info" fullWidth onClick={ResetPassword} >
                                            {laoding ?
                                                <CircularProgress color="inherit" size="20px" />
                                                :
                                                "Submit"}

                                        </MKButton>
                                    </MKBox>
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
                            </MKBox>
                        </Card>
                    </Grid>
                </Grid>
            </MKBox>
            {/* <MKBox width="100%" position="absolute" zIndex={2} bottom="1.625rem">
        <SimpleFooter light />
      </MKBox> */}
        </>
    );
}

export default Reset;
