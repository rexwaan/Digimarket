import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import MKTypography from "components/MKTypography";
import Grid from '@mui/material/Grid';
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKBox from "components/MKBox";
import MKAvatar from "components/MKAvatar";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import usermanagementService from '../../services/usermanagement.service';
import usernameloginstudentService from '../../services/usernameloginstudent.service';
import organisationService from '../../services/organisation.service';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import UploadToS3WithNativeSdk from "components/UploadS3";
import "react-toastify/dist/ReactToastify.css";


const AddStudentBox = (props) => {

    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [userName,setUserName]=useState("")
    const [errors, setErrors] = useState({});
    const [resError, setResError] = useState("");
    const [parent, setParent] = useState([]);
    const [clickCreate, setClickCreate] = useState(false);
    const [parentLists, setParentLists] = useState([]);
    const [selectedParent, setSelectedParent] = useState("");
    const [selectedParentList, setSelectedParentList] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [usernameLoginStudentId, setusernameLoginStudentId] = useState(0);
    const [username, setUsername] = useState("");
    const [date, setDate] = useState(null);
    const [laoding, setLoading] = useState(false)
    const [imgLoad, setImgLoad] = React.useState(false);
    const [fileName, setFileName] = React.useState("");
    const [companyImg, setCompanyImg] = React.useState();
    const [loader,setLoader]=useState(true)
    const getFirstName = (e) => {
        setFirstName(e.target.value)
        setErrors(prev => ({ ...prev, "Firstname": "" }))
    }
    const getLastName = (e) => {
        setLastName(e.target.value)
        setErrors(prev => ({ ...prev, "Lastname": "" }))
    }
    const getUserName = (e) => {
        setUsername(e.target.value)
        setErrors(prev => ({ ...prev, "Username": "" }))
        setResError("")
    }

    const handleChange = (event) => {
        if (props.type == 0) setSelectedParent(event.target.value)
        else setSelectedParentList(event.target.value)
      console.log(selectedParentList,"event get")
        setErrors(prev => ({ ...prev, "Parent": "" }))
        console.log(event.target.value)
    };

    const createStudent = () => {
        const errors_ = {};

        if (firstName == "") {
            errors_.Firstname = "Required"
        }
    
        if (lastName == "") {
            errors_.Lastname = "Required"
        }
      
        if (username == "" && usernameLoginStudentId == 0) {
            errors_.Username = "Required"
        }
        if (props.type == 0 && selectedParent == "") {
            errors_.Parent = "Required"
        }
        else if (props.type != 0 && selectedParentList.length < 1 && usernameLoginStudentId == 0) {
            errors_.Parent = "Required"
    
        } else if (props.type != 0 && selectedParentList.length < 1 && usernameLoginStudentId !== 0) {
            errors_.Parent = "Required"
    
        }
        if (props.type != 0 && (date == undefined || date === "")) {
            errors_.dob = "Required"
        }

        if (Object.keys(errors_).length === 0) {
            setLoading(true)
            if (usernameLoginStudentId == 0) {
                let postRequest = props.type == 0 ? {
                    "firstName": firstName,
                    "lastName": lastName,
                    "userName": username,
                    "linkParentId": selectedParent,
                    "image": fileName,
                    "createdBy": user?.userId,
                    "organizationIds": [
                        orgId
                    ]
                } : {
                    "firstName": firstName,
                    "lastName": lastName,
                    "userName": username,
                    "image": fileName,
                    "linkParentId": user?.userId,
                    "createdBy": user?.userId,
                    "organizationIds": selectedParentList,
                    "isParent": true,
                    "dob": date ? date.format('LL') : null
                }
                console.log(postRequest," post request")
              
                usernameloginstudentService.CreateUserNameLoginStudentRequest(postRequest).then((res) => {
                    setLoading(false)
                    props.created(true)
                  


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


                    window.location.reload()
                }).catch(err => {
                    setResError(err?.response?.data?.message)
                    setLoading(false)
                })

            }
            else {

                let postRequest = {
                    "usernameLoginStudentId": usernameLoginStudentId,
                    "firstName": firstName,
                    "lastName": lastName,
                    "image": fileName,
                    "organizationIds": selectedParentList,
                    "dob": typeof date == "string" ? date : date.format('LL')
                }
                
                usernameloginstudentService.updateUserNameLoginRequest(user?.userId, postRequest).then((res) => {
                    props.created(true)
                    setLoading(false)
                    setusernameLoginStudentId(0)
                   
                    

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



                    window.location.reload()
                }).catch(err => {
                    setResError(err?.response?.data?.message)
                    setLoading(false)
                })
            }
        }
        setErrors(errors_)

    }

    useEffect(() => {
        if (props.type == 0) {
            usermanagementService.GetUsersWithRolesByOrganization(orgId, 0, 1000).then(res => {
                setLoader(false)
                let parent = [];
                res.data.result.filter((ele)=> ele.isActive ).map(ele => {
                    if (ele.roles.some(x => x.name === "Parent")) {
                        parent.push(ele.user)
                    }
                })
                setParent(parent)
            })
        }
        else {
            organisationService.getOrganizationbyUserId(user?.userId, true).then(res => {

                setLoader(false)
                // console.log(res," parent list in student box")
                setParentLists(res?.data?.result?.organizations)
            })
        }
    }, [])

    useEffect(() => {
   
        if (props.editMode) {
         
            let orgArray=props.paramsData.row.organizationName;
            let orgs=orgArray.map((ele)=>ele.id)
            setErrors({})
            setFirstName(props.paramsData?.row?.firstName)
            setLastName(props.paramsData?.row?.lastName)
            setUsername(props.paramsData?.row?.userName)
            setFileName(props.paramsData?.row?.fileName)
            setSelectedParentList(orgs)
            setCompanyImg(props.paramsData?.row?.image)
            setusernameLoginStudentId(props.paramsData?.id)
            setDate(props.paramsData?.row?.dob)
            setDisabled(true)
            props.setEditMode(false)
        }
    }, [props.editMode])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper elevation={2} style={{ padding: 10 }}>
                    <MKTypography variant="h4" mb={2}>
                        Add new Student
                    </MKTypography>
                    <MKBox component="form" method="post" autoComplete="off">
                        <Grid container>
                            <Grid item xs={12} md={4} >
                                <MKBox mb={5}>
                                    <MKInput
                                        label="First Name"
                                        fullWidth
                                        required
                                        error={firstName != "" || !clickCreate ? false : true}
                                        value={firstName}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={getFirstName}
                                    />
                                    {"Firstname" in errors ? <MKTypography

                                        fontSize="0.75rem"
                                        color="error"
                                        style={{ display: "block" }}
                                        textGradient
                                    >
                                        {errors["Firstname"]}
                                    </MKTypography> : null}
                                </MKBox>
                                <MKBox mb={2}>
                                    <MKInput
                                        label="Last Name"
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        value={lastName}
                                        error={lastName != "" || !clickCreate ? false : true}
                                        onChange={getLastName}

                                    />
                                    {"Lastname" in errors ? <MKTypography

                                        fontSize="0.75rem"
                                        color="error"
                                        style={{ display: "block" }}
                                        textGradient
                                    >
                                        {errors["Lastname"]}
                                    </MKTypography> : null}

                                </MKBox>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MKBox ml={{ xs: "auto", lg: 3 }}
                                    mr={{ xs: "auto", lg: 3 }} mb={2}>
                                    <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required disabled={props.type==0 && disabled}>
                                        <InputLabel id="demo-simple-select-autowidth-label">{props.type == 0 ? "Link to Parent" : "Link to organizations"}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            value={props.type == 0 ? selectedParent : selectedParentList}
                                            onChange={handleChange}
                                            multiple={props.type == 0 ? false : true}
                                            autoWidth
                                            
                                            disabled={props.type==0 &&disabled}
                                            label={props.type == 0 ? "Link to Parent" : "Link to organizations"}
                                            defaultValue=""
                                        >
                                            {/* {props.type == 0 ? parent.length>0?parent.map((ele, index) => <MenuItem key={index} value={ele.userId}>{ele.firstname} {ele.lastname}</MenuItem>):<MenuItem key={"nodata"}>No Data</MenuItem>
                                                : parentLists.length>0? parentLists.map((ele,ind) => <MenuItem key={ind} value={ele.organizationId}>{ele.name}</MenuItem>):<MenuItem key={"nodata"}>No Data</MenuItem>
                                            } */}


                                            {props.type == 0 ?(loader? (<MenuItem key={"nodata"}><CircularProgress color="inherit" /></MenuItem>): parent.length>0?(parent.map((ele, index) => <MenuItem key={index} value={ele.userId}>{ele.firstname} {ele.lastname}</MenuItem>)):<MenuItem key={"nodata"}>No options</MenuItem>
                                                ):(loader? (<MenuItem key={"nodata"}><CircularProgress color="inherit" /></MenuItem>):( parentLists.length>0? parentLists.map((ele,ind) => <MenuItem key={ind} value={ele.organizationId}>{ele.name}</MenuItem>):<MenuItem key={"nodata"}>No options</MenuItem>))
                                            }
                                           
                                        </Select>
                                    </FormControl>
                                    {"Parent" in errors ? <MKTypography

                                        fontSize="0.75rem"
                                        color="error"
                                        style={{ display: "block" }}
                                        textGradient
                                    >
                                        {errors["Parent"]}
                                    </MKTypography> : null}
                                </MKBox>

                                {props.type != 0 &&

                                    <MKBox ml={{ xs: "auto", lg: 3 }}
                                        mr={{ xs: "auto", lg: 3 }}>
                                        <InputLabel style={{ marginBottom: 25 }}></InputLabel>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <LocalizationProvider dateAdapter={AdapterMoment}>

                                                    <DatePicker
                                                        label="Date of Birth *"
                                                        required
                                                        maxDate = {new Date().setDate(0)}
                                                        value={date}
                                                        onChange={(newValue) => {
                                                            setDate(newValue);
                                                            setErrors(prev => ({ ...prev, "dob": "" }))
                                                        }}
                                                        fullWidth
                                                        renderInput={(params) => <TextField fullWidth {...params} />}
                                                    />
                                                </LocalizationProvider>

                                            </Grid>
                                        </Grid>
                                        {"dob" in errors ? <MKTypography

                                            fontSize="0.75rem"
                                            color="error"
                                            style={{ display: "block" }}
                                            textGradient
                                        >
                                            {errors["dob"]}
                                        </MKTypography> : null}
                                    </MKBox>
                                }
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MKTypography variant="h6" mb={5}>
                                    <MKBox mb={2}>
                                        <MKInput
                                            label="User Name"
                                            fullWidth
                                            required
                                            disabled={disabled}
                                            error={username != "" || !clickCreate ? false : true}
                                            onChange={getUserName}
                                            value={username}

                                        />
                                        {"Username" in errors ? <MKTypography

                                            fontSize="0.75rem"
                                            color="error"
                                            style={{ display: "block" }}
                                            textGradient
                                        >
                                            {errors["Username"]}
                                        </MKTypography> : <MKTypography

                                            fontSize="0.75rem"
                                            color="error"
                                            style={{ display: "block" }}
                                            textGradient
                                        >
                                            {resError}
                                        </MKTypography>}

                                    </MKBox>
                                </MKTypography>
                                {props.type != 0 &&
                                    <Grid display='flex' justifyContent='space-between' >
                                        <Grid  >
                                            <UploadToS3WithNativeSdk setImage={setCompanyImg} setLoad={setImgLoad} setFileName={setFileName} fileType="image" title="UPload image" />
                                        </Grid>
                                        <Grid  >
                                            {imgLoad ? <CircularProgress color="inherit" /> :
                                                <MKAvatar src={companyImg ?? props.paramsData} className="logo_2" variant="square" alt="Avatar" size="lg" />}
                                        </Grid>

                                    </Grid>
                                }
                                <Grid display='flex' justifyContent='flex-end' >
                                    <MKButton variant="gradient" color="info" fullWidth onClick={createStudent}>
                                        {laoding ?
                                            <CircularProgress color="inherit" size="20px" /> :
                                            usernameLoginStudentId != 0 ? "Update Student" :
                                                "Add Student"}
                                    </MKButton>
                                </Grid>
                            </Grid>

                        </Grid>
                    </MKBox>
                </Paper>
            </Grid>
        </Grid>

    )
}

export default AddStudentBox;