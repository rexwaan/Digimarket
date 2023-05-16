import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
// import Logo from '../../../examples/Logo'
import Logo from "../../../Navigation/Header"

import bgImage from "assets/images/read-g18fc55640_1920.jpg";
import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";
import MKAlert from "components/MKAlert";
import Icon from "@mui/material/Icon";
import usercontentService from "services/usercontent.service";
import userRequestService from "../../../services/userRequest.service";




function AcceptRequest() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [response, setResponse] = useState({
    status: false,
    error: false,
    message: ""
  });



  useEffect(() => {
    if(searchParams.get("userId")!==null&&
    searchParams.get("email")!==null&&
    searchParams.get("organizationId")!==null&&
    searchParams.get("roleId")!==null
    ){
      let request={
        "userId":Number(searchParams.get("userId")),
        "email":searchParams.get("email"),
        "organizationId":Number( searchParams.get("organizationId")),
        "roleId": Number(searchParams.get("roleId"))
      }
     
  userRequestService.AddUserRequest(request).then((res)=>{
    console.log(res,"response")
    setResponse({
      status: true,
      error: false ,
      message:res.data.message 
    }) 
  }).catch((err)=>{
    setResponse({
      status: true,
      error: false ,
      message: err.response.data.message
    })
  })

    }
    else{

      if(searchParams.get("requestId")!==null){
        usercontentService.ApproveRequestToAccessLessson(searchParams.get("requestId")).then((res)=>{
          setResponse({
            status: true,
            error: false ,
            message:res.data.message 
          }) 
        }).catch((err)=>{
          setResponse({
            status: true,
            error: false ,
            message: err.response.data.message
          })
        })
       
      }
    }
 },[])
  return (
    <>
        <Grid container spacing={3} alignItems="center">
        <Logo position="fixed" />
        {/* <MKBox sx={{display:"flex"}}> */}
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
              <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
                <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
                  <MKAlert color="success">
                    <Icon fontSize="small">thumb_up</Icon>&nbsp;
                    {response.message}
                  </MKAlert> 
                    {/* <MKAlert color="error">
                      <Icon fontSize="small">error</Icon>&nbsp;
                      {response.message}
                    </MKAlert> */}
                  

                </Grid>
              </MKBox>
              </Grid>
              {/* </MKBox> */}
    </Grid>
        
    
    </>
  );
                }
export default AcceptRequest;
