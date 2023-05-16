import * as React from 'react';
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import Modal from '@mui/material/Modal';
import authService from 'services/auth.service';

import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import organisationService from 'services/organisation.service';

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


const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);



export default function KeepMountedModal({ visible, setVisible, orgData }) {
    const [visibleData, setVisibleData] = useState(false)
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [clickCreate, setClickCreate] = useState(false);

    const [laoding, setLoading] = useState(false)

    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const [response, setResponse] = useState({
        status: false,
        error: false,
        message: ""
    });
    const handleClose = () => setVisible(false);

    const handleCloseData = () => setVisibleData(false)
    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
    const [onlyButton, setOnlyButton] = useState(false)


    const [errors, setErrors] = React.useState({})


    const getEmail = (e) => {
        setEmail(e.target.value)
        setErrors(prev => ({ ...prev, "Email": "" }))
    }

    const getPassword = (e) => {
        setPassword(e.target.value)
        setErrors(prev => ({ ...prev, "Password": "" }))
    }


    //  useEffect(()=>{
    //     console.log(" organization data", orgData)
    //  },[])
    const handleDeleteOrganization = () => {
        setVisible(false)
        setVisibleData(true)
    }
    const submitData = () => {
        const errors_ = {};
        if (!isEmail(email)) {
            errors_.Email = "Please provide a valid Email"
        }
        if (email == "") {
            errors_.Email = "Required"
        }
        if (password == "") {
            errors_.Password = "Required"
        }
        // if(email!==user?.email){
        //     errors_.Email = "Email not match" 
        // }

        if (Object.keys(errors_).length === 0) {
            setLoading(true)
            authService.VerifyOrganiationDetails({
                "organizationId": orgId,
                "email": email,
                "password": password
            })
                .then((res) => {
                    setLoading(false)
                    setEmail("")
                    setPassword("")
                    setOnlyButton(true)
                }).catch((err) => {

                    setLoading(false)
                    setResponse({
                        error: true,
                        message: err?.response ? err?.response.data.message : err?.message
                    })
                })
        }
        setErrors(errors_)



    }

    const deleteOrganization = () => {
        organisationService.DeleteOrganization(orgId).then(() => {
            window.location.replace("/dashboard");
        })
    }
    return (
        <>
            <Modal
                keepMounted
                open={visible}
                onClose={handleClose}
                sx={{ zIndex: 2300 }}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                disableScrollLock
            >
                <MKBox sx={style}>
                    <MKTypography textAlign="center" variant="h5">Are you sure? This action can't be undone.</MKTypography>
                    <MKBox mt={5} textAlign="center">
                        <MKButton style={{ marginRight: 10 }} color="error" onClick={() => handleDeleteOrganization()}>Yes, Delete {orgData?.name}</MKButton>
                        <MKButton color="info" onClick={() => setVisible(false)}>No, do not delete {orgData?.name}</MKButton>
                    </MKBox>
                </MKBox>
            </Modal>

            <Modal
                keepMounted
                open={visibleData}
                onClose={handleCloseData}
                sx={{ zIndex: 2300 }}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                disableScrollLock
            >
                <MKBox sx={style}>

                    {
                        !onlyButton ? (
                            <>
                                <MKTypography variant="h6">Note that this action can't be undone, to continue enter your </MKTypography>

                                <MKBox mb={2} mt={2}>
                                    <MKInput type="email" label="Email" value={email} autoComplete="off" fullWidth required error={email != "" || !clickCreate ? false : true} onChange={getEmail} />
                                    {"Email" in errors ? <MKTypography

                                        fontSize="0.75rem"
                                        color="error"
                                        style={{ display: "block" }}
                                        textGradient
                                    >
                                        {errors["Email"]}
                                    </MKTypography> : null}
                                </MKBox>
                                <MKBox mb={2}>
                                    <MKInput type="password" label="Password" autoComplete="off" value={password} fullWidth required error={password != "" || !clickCreate ? false : true} onChange={getPassword} />
                                    {"Password" in errors ? <MKTypography

                                        fontSize="0.75rem"
                                        color="error"
                                        style={{ display: "block" }}
                                        textGradient
                                    >
                                        {errors["Password"]}
                                    </MKTypography> : null}
                                </MKBox>
                                <MKBox textAlign="center">
                                    <MKButton sx={{ marginTop: 2 }} color="info" onClick={() => submitData()}>{laoding ?
                                        <CircularProgress color="inherit" size="20px" />
                                        :
                                        "Submit"}</MKButton>
                                    {"message" in response ? <MKTypography
                                        fontSize="0.75rem"
                                        color="error"
                                        sx={{ display: "block", marginTop: "2px" }}
                                    >
                                        {response["message"]}
                                    </MKTypography> : null}
                                </MKBox>

                            </>
                        ) : (
                            <MKBox mt={1} textAlign="center">
                                <MKButton style={{ marginRight: 10 }} color="error" onClick={() => deleteOrganization()}>Yes, Delete {orgData?.name}</MKButton>
                                <MKButton color="info" onClick={() => { setVisibleData(false); setOnlyButton(false); }}>No, do not delete {orgData?.name}</MKButton>
                            </MKBox>
                        )
                    }
                </MKBox>

            </Modal>
        </>

    );
}