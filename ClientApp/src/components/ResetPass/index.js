import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import authService from '../../services/auth.service';
import CircularProgress from '@mui/material/CircularProgress';
import MKTypography from "components/MKTypography";


const ResetPass = (props) => {

    const [error, setError] = useState("")
    const [newPass, setNewPass] = useState("")
    const [loading, setLoading] = useState(false)
    const getNewPass = (e) => {
        setNewPass(e.target.value)
        setError("")
    }

    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;

    const setPassword = () => {
        if (newPass == "") {
            setError("required")
        }
        else {
            setLoading(true)
            authService.resetPassword(newPass, props.studentId, props.isAdmin,orgId).then(() => {
                setLoading(false)
                props.setVisible(false)
            })
        }
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal
            keepMounted
            open={props.visible}
            onClose={() => props.setVisible(false)}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >

            <MKBox component="form" role="form" sx={style}>
                <MKBox mb={2}>
                    <MKInput type="password" variant="standard" label="New Password" fullWidth required onChange={getNewPass} />
                    {error !== "" ? <MKTypography

                        fontSize="0.75rem"
                        color="error"
                        style={{ display: "block" }}
                        textGradient
                    >
                        {error}
                    </MKTypography> : null}
                </MKBox>
                <MKBox mb={2}>
                    <MKButton color="info" onClick={setPassword}> {loading ? <CircularProgress color="inherit" size="20px" /> : "Save"} </MKButton>
                </MKBox>
            </MKBox>

        </Modal>
    )
}


export default ResetPass
