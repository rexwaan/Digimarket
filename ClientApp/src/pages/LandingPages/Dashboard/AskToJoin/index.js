import * as React from 'react';
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import Modal from '@mui/material/Modal';
import PhoneInput from 'react-phone-input-2';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import userRequestService from 'services/userRequest.service';
import usermanagementService from 'services/usermanagement.service';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const ThankYou = ({ userDetails, orgName, style }) => (
    <MKBox sx={style}>
        <MKTypography>
            Thank you {userDetails.firstName} {userDetails.lastName} for submitting your request to join {orgName}! <br />
            The admin team of {orgName} will be notified, once the request would be approved, you will get a notification email
        </MKTypography>
    </MKBox>
)



export default function KeepMountedModal({ visible, setVisible, orgName, orgId }) {
    const handleClose = () => setVisible(false);
    const [roles, setRoles] = React.useState([]);
    const [showThankyou, setShowThankyou] = React.useState(false);
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const _orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;

    const [userDetails, setUserDetails] = React.useState({
        "firstName": "",
        "lastName": "",
        "email": "",
        "contact_number": "",
        "dob": "",
        "roleId": 0,
        "organizationId": orgId,
        "userId": user?.userId,
        "currentOrganizationId": _orgId
    })


    const [errors, setErrors] = React.useState({})

    React.useEffect(() => {
        if (visible) {
            usermanagementService.GetRolesByOrganization(orgId).then((res) => {
                let _roles = res.data.result.filter(e => e.name !== "UsernameLoginStudent")
                setRoles(_roles)
            })
        }
        setUserDetails(({
            "firstName": user == null ? "" : user.firstname,
            "lastName": user == null ? "" : user.lastname,
            "email": "",
            "contact_number": "",
            "dob": "",
            "roleId": 0,
            "organizationId": orgId,
            "userId": user ? user.userId : 0,
            "currentOrganizationId": _orgId
        }))
        try {
            document.getElementById("asktoJoin").reset();
        }
        catch (err) { }
    }, [visible])


    const isEmail = (email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);


    const handleRequest = () => {
        console.log(userDetails)
        let errors_ = {}

        if (user === null) {

            if (!isEmail(userDetails.email)) {
                setErrors(prev => ({ ...prev, "email": "Please provide a valid Email" }))
            }

            if (userDetails.firstName == "") {
                errors_.firstName = "Required";
                setErrors(prev => ({ ...prev, "firstName": "Required" }))
            }
            if (userDetails.lastName == "") {
                errors_.lastName = "Required";
                setErrors(prev => ({ ...prev, "lastName": "Required" }))
            }

            if (userDetails.email == "") {
                errors_.email = "Required";
                setErrors(prev => ({ ...prev, "email": "Required" }))
            }

        }
        if (userDetails.roleId == 0) {
            errors_.roleId = "Required";
            setErrors(prev => ({ ...prev, "roleId": "Required" }))
        }

        if (Object.keys(errors_).length === 0) {
            userRequestService.AddUserRequest(userDetails).then((res) => {
                setShowThankyou(true)
                setTimeout(() => {
                    setShowThankyou(false)
                    setVisible(false)
                }, 5000);
            }).catch((err) => {
                setErrors(prev => ({ ...prev, "main": err?.response?.data?.message }))
            })
        }
    }

    return (
        <Modal
            keepMounted
            open={visible}
            onClose={handleClose}
            sx={{ zIndex: 2300 }}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            disableScrollLock
        >

            {!showThankyou ?
                <MKBox component="form" role="form" sx={style} id="asktoJoin">
                    <MKTypography variant="body2" fontWeight="bold" sx={{ marginBottom: "10px" }}>Request to join {orgName}</MKTypography>
                    {user === null &&
                        <>


                            <MKBox mb={2} mt={3}>
                                <MKInput type="text" label="First Name" fullWidth
                                    required
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
                            </MKBox>
                            <MKBox mb={2}>
                                <MKInput type="text" label="Last Name" fullWidth required
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

                            </MKBox>
                            <MKBox mb={2}>
                                <MKInput type="date" label="Date of Birth" fullWidth value={userDetails["dob"] != "" ? userDetails["dob"] : new Date()} onChange={(e) => { setUserDetails({ ...userDetails, "dob": e.target.value }); }} />
                            </MKBox>
                            <MKBox mb={2}>
                                <MKInput type="email" label="Email" fullWidth required
                                    onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "email": "Required" }) }}

                                    onChange={(e) => { setUserDetails({ ...userDetails, "email": e.target.value }); setErrors(prev => ({ ...prev, "email": "" })) }}
                                />
                                {"email" in errors ? <MKTypography

                                    fontSize="0.75rem"
                                    color="error"
                                    style={{ display: "block" }}
                                    textGradient
                                >
                                    {errors["email"]}
                                </MKTypography> : null}
                            </MKBox>

                            <MKBox mb={2}>
                                <PhoneInput value={userDetails["contact_number"]} onChange={(e) => setUserDetails({ ...userDetails, "contact_number": e })} />
                            </MKBox>
                        </>
                    }
                    <MKBox mb={2}>
                        <FormControl>
                           <MKTypography variant="body2" fontWeight="bold" sx={{ fontSize: "0.9rem" }}>Request to join as</MKTypography>
                            <RadioGroup
                               
                                name="radio-buttons-group"
                                required
                                onChange={(e) => { setUserDetails({ ...userDetails, "roleId": parseInt(e.target.value) }); setErrors(prev => ({ ...prev, "roleId": "" })) }}
                            >
                                {roles.map((ele, index) => <FormControlLabel key={index} value={ele.roleId} control={<Radio />} label={ele.displayName} />)}

                            </RadioGroup>
                        </FormControl>
                        {"roleId" in errors ? <MKTypography

                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["roleId"]}
                        </MKTypography> : null}
                    </MKBox>

                    <MKBox mt={4} mb={1}>
                        <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                            <MKButton variant="gradient" color="info" onClick={handleRequest}>
                                Request Join {orgName}
                            </MKButton>
                        </Grid>
                        {"main" in errors ? <MKTypography

                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["main"]}
                        </MKTypography> : null}
                    </MKBox>
                    {/* <MKBox mt={3} mb={1} textAlign="center">
                    {response.error ? <MKTypography

                        fontSize="0.75rem"
                        color="error"
                        style={{ display: "block" }}
                        textGradient
                    >
                        {response.message}
                    </MKTypography> : null}
                </MKBox> */}
                </MKBox>
                : <ThankYou userDetails={userDetails} orgName={orgName} style={style} />}

        </Modal>
    );
}