

import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

import Grid from "@mui/material/Grid";



// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import CircularProgress from '@mui/material/CircularProgress';

import authService from "services/auth.service";
import Logo from "../../../../Navigation/Header"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";




function Forgot() {

 
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState("")
  const [laoding, setLoading] = useState(false)
  const [clickCreate, setClickCreate] = useState(false);
  const navigate = useNavigate();
  const [response, setResponse] = useState({
    status: false,
    error: false,
    message: ""
  });





  const getEmail = (e) => {
    setEmail(e.target.value)
    setErrors("")
    setResponse(prev => ({...prev, error:false}))
  }



  const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);


  useEffect(() => {
    if (localStorage.getItem("user") !== null){
      navigate("/dashboard")
    }  
  }, [])




  const ForgetPassword = () => {
    setClickCreate(true)
    if (email == "") {
      setErrors("Required")
    }else if(!isEmail(email)){
      setErrors("enter valid email")
    }
    else {
      setLoading(true)
      authService.forgetPassword(email).then((res) => {
        console.log(res)
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


       setTimeout(()=>{
        navigate("/authentication/sign-in")
       },2000)
      }).catch((err) => {
        console.log(err.response)
        setLoading(false)
        setResponse({
          error: true,
          message: err?.response ? err?.response.data.message : err?.message
        })
     

      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          {err?.response.data.message}
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
    //   <Logo position = "fixed" />
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
                  Forget Password
                </MKTypography>

              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form">
                  <MKBox mb={2}>
                    <MKInput type="email" variant="standard" label="UserName / Email" fullWidth required error={email != "" || !clickCreate ? false : true} onChange={getEmail} />
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
                    <MKButton variant="gradient" color="info" fullWidth  onClick={ForgetPassword} >
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

export default Forgot;
