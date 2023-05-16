import * as React from 'react';
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import Modal from '@mui/material/Modal';
import { useState, useEffect } from "react";
import { TextField } from '@mui/material';
import organizationData from "../../../../services/organisation.service"
import CircularProgress from '@mui/material/CircularProgress';
import authService from "services/auth.service";
import Autocomplete from '@mui/material/Autocomplete';
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
export default function KeepMountedModal({ visible, setVisible, user }) {
    const handleClose = () => setVisible(false);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({})
    const [laoding, setLoading] = useState(false)
    const [clickCreate, setClickCreate] = useState(false);
    const [orgData, setOrgData] = useState([]);
    const [selectOrg, setSelectOrg] = useState();
    const [response, setResponse] = useState({
        status: false,
        error: false,
        message: ""
    });
    let user_ = "";
    try {
        user_ = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        user_ = ""
    }
    const handleOrgValue = (value) => {
        setSelectOrg(value.id)
        setErrors(prev => ({ ...prev, "OrgName": "" }))
    }
    const getEmail = (e) => {
        setEmail(e.target.value)
        setErrors(prev => ({ ...prev, "Email": "" }))
    }

    const getPassword = (e) => {
        setPassword(e.target.value)
        setErrors(prev => ({ ...prev, "Password": "" }))
    }
    const isEmail = (email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    useEffect(() => {
        organizationData.getOrganizations("", 0, 2000, user).then((res) => {

            console.log(res.data," organization error")
            
            let data = res.data.result.filter((ele) => !ele.isUserExistInOrganization == true)
            setOrgData(data);

        })
    }, [])
    const login = () => {
        setClickCreate(true)
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
        if (selectOrg == undefined || selectOrg == "") {
            errors_.OrgName = "Required"
        }

        if (Object.keys(errors_).length === 0) {
            setLoading(true)
            authService.signInToAnotherOrg(selectOrg, email, password, user).then((res) => {
                setLoading(false)
                setVisible(false)
                setEmail("")
                setPassword("")
            }).catch((err) => {
                console.log(err)
                setLoading(false)
                setResponse({
                    error: true,
                    message: err?.response ? err?.response.data.message : err?.message
                })
            })
        }
        setErrors(errors_)
    }

    return (
        <Modal
            keepMounted
            open={visible}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <MKBox component="form" role="form" sx={style}>
                <MKBox mb={2}>
                    <Autocomplete
                        value={selectOrg}
                        // disabled={selectedDateTime[params.id] == undefined || selectedDateTime[params.id] == ""}
                        onChange={(e, value) => handleOrgValue(value)}
                        autoWidth

                        // isOptionEqualToValue={(option, value) => option.id === value.id}
                        label='End Point'
                        options={[...orgData.map((option) => {
                            return { id: option.endPoint, name: option.name }
                        })]}

                        getOptionLabel={(option) => option.name || ""}
                        renderInput={(params) => (
                            <TextField {...params} label="Organization List" placeholder="Search" />
                        )}
                        renderOption={(props, option) => {

                            const { name, id } = option;
                            return (
                                <span {...props}>
                                    {name}
                                </span>
                            );
                        }}
                    />
                    {"OrgName" in errors ? <MKTypography

                        fontSize="0.5rem"
                        color="error"
                        style={{ display: "block" }}
                        textGradient
                    >
                        {errors["OrgName"]}
                    </MKTypography> : null}
                </MKBox>
                <MKBox mb={2}>
                    <MKInput type="email" variant="standard" label="Email" value={email} autoComplete="off" fullWidth required error={email != "" || !clickCreate ? false : true} onChange={getEmail} />
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
                    <MKInput type="password" variant="standard" label="Password" autoComplete="off" value={password} fullWidth required error={password != "" || !clickCreate ? false : true} onChange={getPassword} />
                    {"Password" in errors ? <MKTypography

                        fontSize="0.5rem"
                        color="error"
                        style={{ display: "block" }}
                        textGradient
                    >
                        {errors["Password"]}
                    </MKTypography> : null}
                </MKBox>

                <MKBox mt={4} mb={1}>
                    <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                        <MKButton variant="gradient" color="info" onClick={login} >
                            {laoding ?
                                <CircularProgress color="inherit" size="20px" />
                                :
                                "sign in"}

                        </MKButton>
                    </Grid>
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
        </Modal>
    );
}