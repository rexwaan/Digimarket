import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKAlert from "components/MKAlert";
import Icon from "@mui/material/Icon";
import OrganizationRequest from 'services/organizationrequest.service';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';


const InnerBox = ({ setResponse, setVisible }) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errors, setErrors] = useState({})
    const [laoding, setLoading] = useState(false)
    const [clickCreate, setClickCreate] = useState(false);


    const getName = (e) => {
        setName(e.target.value)
        setErrors(prev => ({ ...prev, "Name": "" }))
    }
    const getFirstName = (e) => {
        setFirstName(e.target.value)
        setErrors(prev => ({ ...prev, "Firstname": "" }))
    }
    const getLastName = (e) => {
        setLastName(e.target.value)
        setErrors(prev => ({ ...prev, "Lastname": "" }))
    }
    const getEmail = (e) => {
        setEmail(e.target.value)
        setErrors(prev => ({ ...prev, "Email": "" }))
    }

    const isEmail = (email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);


    const generateMail = () => {
        setClickCreate(true)

        const errors_ = {};
        if (!isEmail(email)) {
            errors_.Email = "Please provide a valid Email"
        }
        if (email == "") {
            errors_.Email = "Required"
        }
        if (name == "") {
            errors_.Name = "Required"
        }
        if (firstName == "") {
            errors_.Firstname = "Required"
        }
        if (lastName == "") {
            errors_.Lastname = "Required"
        }

        if (Object.keys(errors_).length === 0) {
            setLoading(true)
            OrganizationRequest.addOrganizationRequest({
                "EmailAddress": email,
                "organizationName": name,
                "FirstName": firstName,
                "LastName": lastName
            }).then((res) => {
                setLoading(false)
                if (res.data.statusCode != 200) {
                    throw { "message": res.data.message }
                }
                else {
                    setLoading(false)
                    setResponse({
                        status: true,
                        error: false,
                        message: "Email Sent on your provided mail address"
                    })

                    setTimeout(() => {
                        setResponse({
                            status: false,
                            error: false,
                            message: ""
                        })
                        setVisible(false)
                    }, 5000);
                }
            }).catch((err) => {
                setLoading(false)
                setResponse({
                    status: true,
                    error: true,
                    message: err?.response ? err?.response.data.message : err?.message
                })
                setTimeout(() => {
                    setResponse({
                        status: false,
                        error: false,
                        message: ""
                    })
                    setVisible(false)
                }, 5000);
            });


        }

        setErrors(errors_)
    }

    return (
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
                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Create Workspace
                </MKTypography>

            </MKBox>
            <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form" id="createorg">
                    <MKBox mb={2}>
                        <MKInput
                            // variant="standard"
                            label="First Name"
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            error={firstName != "" || !clickCreate ? false : true}
                            onChange={getFirstName}
                        // onBlur = {(e) => {e.target.value == "" && setErrors({...errors,"Firstname" : "Required"}) }}
                        // error={userDetails.Firstname != "" || !createClick ? false : true}
                        // onChange={(e) => { setUserDetails({ ...userDetails, "Firstname": e.target.value }); setErrors(prev => ({ ...prev, "Firstname": "" })) }}
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
                            // variant="standard"
                            label="Last Name"
                            // InputLabelProps={{ shrink: true }}
                            fullWidth

                            required
                            error={lastName != "" || !clickCreate ? false : true}
                            onChange={getLastName}
                        // onBlur = {(e) => {e.target.value == "" && setErrors({...errors,"Lastname" : "Required"}) }}
                        // error={userDetails.Lastname != "" || !createClick ? false : true}
                        // onChange={(e) => { setUserDetails({ ...userDetails, "Lastname": e.target.value }); setErrors(prev => ({ ...prev, "Lastname": "" })) }}
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
                    <MKBox mb={2}>
                        <MKInput type="email" label="Email" fullWidth required error={email != "" || !clickCreate ? false : true} onChange={getEmail} />
                        {"Email" in errors ? <MKTypography

                            fontSize="0.5rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["Email"]}
                        </MKTypography> : null}
                    </MKBox>

                    <MKBox mb={2}>
                        <MKInput type="text" label="Organization Name" fullWidth required error={name != "" || !clickCreate ? false : true} onChange={getName} />
                        {"Name" in errors ? <MKTypography

                            fontSize="0.5rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["Name"]}
                        </MKTypography> : null}
                    </MKBox>


                    <MKBox mt={4} mb={1}>
                        <MKButton variant="gradient" color="info" fullWidth onClick={generateMail} >
                            {laoding ?
                                <CircularProgress color="inherit" size="20px" />
                                :
                                "Submit a Request to create a workspace for my organization - its free!"}

                        </MKButton>
                    </MKBox>

                </MKBox>
            </MKBox>
        </Card>
    )
}


const CreateBox = ({ status, setVisible }) => {


    const [response, setResponse] = useState({
        status: false,
        error: false,
        message: ""
    });


    return (
        <>
            {!response.status ?
                status == 0 ?
                    <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={0}>
                        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
                            <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
                                <InnerBox setResponse={setResponse} setVisible={setVisible} />
                            </Grid>
                        </Grid>
                    </MKBox> :
                    <MKBox>
                        <Grid container spacing={1} justifyContent="center" alignItems="center" >
                            <Grid item xs={12}>
                                <InnerBox setResponse={setResponse} setVisible={setVisible} />
                            </Grid>
                        </Grid>
                    </MKBox>
                :
                status == 0 ?
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
                    </MKBox> :
                    <MKBox>
                        <Grid container spacing={1} justifyContent="center" alignItems="center" >
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
        </>
    )
}


function SignInBasic({ visible, setVisible, status }) {
    const handleClose = () => setVisible(false);
    // const navigate = useNavigate();
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
    };

    useEffect(() => {
        try {
            document.getElementById("createorg").reset();
        }
        catch (err) { }
    }, [visible])


    return (
        <>
            {status == 1 ?
                <Modal
                    keepMounted
                    open={visible}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <MKBox sx={style}>

                        <CreateBox status={status} setVisible={setVisible} />

                    </MKBox>
                </Modal>
                :
                <CreateBox status={status} />
            }
        </>
    );
}

export default SignInBasic;
