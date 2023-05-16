import * as React from 'react';
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import Modal from '@mui/material/Modal';
import organisationService from 'services/organisation.service';
import CircularProgress from '@mui/material/CircularProgress';
import UploadToS3WithNativeSdk from "components/UploadS3";
import MKAvatar from "components/MKAvatar";
import PhoneInput from 'react-phone-input-2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import {Select as Selectt} from 'react-select'
import countryList from 'react-select-country-list';
// import FormControl from '@mui/material/FormControl';
import { useMemo } from 'react';


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
    const options = useMemo(() => countryList().getData(), [])
    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
    const [orgDetails, setOrgDetails] = React.useState({
        "Name": "",
        "EndPoint": "",
        "IsActive": false,
        "UserId": user,
        "AboutOrganziation": "",
        "logo": "",
        "country": "",
        "address": "",
        "contactNumber": "",
        "typeOfOrganization": 0,
        "currentOrganizationId": orgId
    });
    const [errors, setErrors] = React.useState({})
    const [response, setResponse] = React.useState({
        status: false,
        error: false,
        message: ""
    });
    const [laoding, setLoading] = React.useState(false)
    const [imgLoad, setImgLoad] = React.useState(false);
    const [fileName, setFileName] = React.useState("");
    const [companyImg, setCompanyImg] = React.useState();
    const [createClick, setCreateClick] = React.useState(false)


    const handleChange = (event) => {
        setErrors({ ...errors, "organizationType": "" })
        setOrgDetails({
            ...orgDetails, "typeOfOrganization": event.target.value
        })
    };


    React.useEffect(() => {
        if (fileName != "" && !imgLoad) {
            setOrgDetails({
                ...orgDetails, "logo": fileName
            })
        }
    }, [imgLoad])

    const saveData = () => {
        const errors_ = {};
        if (orgDetails.Name == "") {
            errors_.Name = "Required"
        }
        if (orgDetails.typeOfOrganization == 0) {
            errors_.organizationType = "Required";
            setErrors(prev => ({ ...prev, "organizationType": "Required" }))
        }
        if (orgDetails.address == "") {
            errors_.Address = "Required";
            setErrors(prev => ({ ...prev, "Address": "Required" }))
        }
        if (orgDetails.country == "") {
            errors_.countryCode = "Required";
            setErrors(prev => ({ ...prev, "countryCode": "Required" }))
        }
        if (Object.keys(errors_).length === 0) {

            setLoading(true);
            organisationService.createOrganization(orgDetails).then((res) => {
                setLoading(false);
                setVisible(false)
            }).catch((err) => {
                setLoading(false);
                setResponse({
                    error: true,
                    message: err?.response ? err?.response.data.message : err?.message
                })
            })
        }
        setErrors(errors_)
    }
    const changeHandler = (e) => {
        setOrgDetails({ ...orgDetails, "country": e.target.value })
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
                    <Grid item xs={12} md={6}>
                        <MKInput
                            type="text"

                            label="Organization Name"
                            required
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            onBlur={(e) => setOrgDetails({ ...orgDetails, "EndPoint": e.target.value.replace(/\s+/g, '-').toLowerCase() })}
                            onChange={(e) => { setOrgDetails({ ...orgDetails, "Name": e.target.value }); setErrors(prev => ({ ...prev, "Name": "" })) }}
                        />
                        {"Name" in errors ? <MKTypography

                            fontSize="0.5rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["Name"]}
                        </MKTypography> : null}
                    </Grid>
                    <Grid item xs={12} md={6}>

                        <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required>
                            <InputLabel id="demo-simple-select-autowidth-label">Organization Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                onChange={handleChange}
                                onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "organizationType": "Required" }) }}
                                autoWidth
                                required
                                label="Organization Type"
                                error={orgDetails.typeOfOrganization != "" || !createClick ? false : true}
                            >
                                <MenuItem value={0}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={1}>School</MenuItem>
                                <MenuItem value={2}>University</MenuItem>
                                <MenuItem value={3}>Day Care</MenuItem>
                                <MenuItem value={4}>Extra Curricular Activities</MenuItem>
                                <MenuItem value={5}>Club</MenuItem>
                            </Select>
                        </FormControl>
                        {"organizationType" in errors ? <MKTypography

                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["organizationType"]}
                        </MKTypography> : null}
                    </Grid>
                    {/* <Grid item xs={12}>
                        <MKInput
                            type="email"
                            variant="standard"
                            label="Email"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            // onBlur = {(e)=>setUserDetails({"email":e.target.value})}
                            value={user?.email}
                            disabled={true}
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <MKInput
                            type="text"

                            label="Organization Info"
                            multiline rows={2}
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            onBlur={(e) => setOrgDetails({ ...orgDetails, "AboutOrganziation": e.target.value })}
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <MKInput
                            // variant="standard"
                            label="Address"
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "Address": "Required" }) }}
                            error={orgDetails.address != "" || !createClick ? false : true}
                            onChange={(e) => { setOrgDetails({ ...orgDetails, "address": e.target.value }); setErrors(prev => ({ ...prev, "Address": "" })) }}
                        />
                        {"Address" in errors ? <MKTypography

                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["Address"]}
                        </MKTypography> : null}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {/* <MKInput
                            // variant="standard"
                            label="Country"
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "countryCode": "Required" }) }}
                            error={orgDetails.country != "" || !createClick ? false : true}
                            onChange={(e) => { setOrgDetails({ ...orgDetails, "country": e.target.value }); setErrors(prev => ({ ...prev, "countryCode": "" })) }}
                        /> */}
                        {/* <Selectt options={options} value={orgDetails.country} onChange={changeHandler}  /> */}
                        <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required>
                            <InputLabel id="demo-simple-select-autowidth-label">Country</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                onChange={(e) => { setOrgDetails({ ...orgDetails, "country": e.target.value }); setErrors(prev => ({ ...prev, "countryCode": "" })) }}
                                onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "countryCode": "Required" }) }}
                                autoWidth
                                label="Country"
                                required
                            // error={orgrDetails.countryCode != "" || !createClick ? false : true}
                            >
                                {options.map((res,ind) => <MenuItem key={ind} value={res.label}>{res.label}</MenuItem>)}

                            </Select>
                        </FormControl>
                        {"countryCode" in errors ? <MKTypography

                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["countryCode"]}
                        </MKTypography> : null}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <PhoneInput onChange={phone => setOrgDetails({ ...orgDetails, "contactNumber": phone })} />
                    </Grid>
                    <Grid item xs={6} display='flex' justifyContent='center' alignItems="center">
                        <UploadToS3WithNativeSdk setImage={setCompanyImg} setLoad={setImgLoad} setFileName={setFileName} fileType="image" title="UPload image" />
                    </Grid>
                    <Grid item xs={6} display='flex' justifyContent='center' alignItems="center">
                        {imgLoad ? <CircularProgress color="inherit" /> :
                            <MKAvatar src={companyImg} className="logo_2" variant="square" alt="Avatar" size="lg" />}
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

                <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                    <MKButton onClick={saveData} variant="gradient" color="info">
                        {laoding ?
                            <CircularProgress color="inherit" size="20px" />
                            :
                            "Create"}
                    </MKButton>
                </Grid>
            </MKBox>
        </Modal>
    );
}