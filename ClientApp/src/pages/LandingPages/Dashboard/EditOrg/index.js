import * as React from 'react';
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";
import Modal from '@mui/material/Modal';
import PhoneInput from 'react-phone-input-2';
import FormControl from '@mui/material/FormControl';
import usermanagementService from 'services/usermanagement.service';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import countryList from 'react-select-country-list'
import UploadToS3WithNativeSdk from "components/UploadS3";
import MKAvatar from "components/MKAvatar";
import CircularProgress from '@mui/material/CircularProgress';
import organizationrequestService from '../../../../services/organizationrequest.service';


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
            Thank you for submitting your request to edit {orgName}! <br />
            The admin team of {orgName} will be notified, once the request would be approved, you will get a notification email
        </MKTypography>
    </MKBox>
)



export default function KeepMountedModal({ visible, setVisible, orgData }) {
    const handleClose = () => setVisible(false);
    const [roles, setRoles] = React.useState([]);
    const [showThankyou, setShowThankyou] = React.useState(false);
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const [companyImg, setCompanyImg] = React.useState(null);
    const [imgLoad, setImgLoad] = React.useState(false);
    const [fileName, setFileName] = React.useState("");
    const options = React.useMemo(() => countryList().getData(), [])
    const [createClick, setCreateClick] = React.useState(false)
    const [userDetails, setUserDetails] = React.useState({
        "organizationName": "",
        "organizationType": "",
        "country": "",
        "about": "",
        "address": "",
        "organizationId": 0,
        "contact": "",
    })


    const handleChange = (event) => {
        setErrors({ ...errors, "organizationType": "" })
        setUserDetails({
            ...userDetails, "organizationType": event.target.value
        })
    };

    const [errors, setErrors] = React.useState({})

    React.useEffect(() => {
        setUserDetails(({
            "organizationName": orgData?.name,
            "organizationType": orgData?.typeOfOrganization,
            "country": orgData?.country,
            "about": orgData?.aboutOrganziation,
            "address": orgData?.address,
            "contact": orgData?.contactNumber,
            "organizationId": orgData?.organizationId,
        }))
        try {
            document.getElementById("asktoJoin").reset();
            setErrors({})
        }
        catch (err) { }
    }, [visible])

    React.useEffect(() => {
        if (fileName != "" && !imgLoad) {
            setUserDetails({
                ...userDetails, "logo": fileName
            })
        }
    }, [imgLoad])


    const handleRequest = () => {
        console.log(userDetails)
        let errors_ = {}
        setCreateClick(true)
        if (userDetails.organizationName == "") {
            errors_.organizationName = "Required";

        }
        if (userDetails.address == "") {
            errors_.address = "Required";

        }

        if (userDetails.country == "") {
            errors_.country = "Required";

        }
        if (userDetails.organizationType == "") {
            errors_.organizationType = "Required";
        }


        if (Object.keys(errors_).length === 0) {

            organizationrequestService.editOrganizationRequest(userDetails).then((res) => {
                setShowThankyou(true)
                setTimeout(() => {
                    setShowThankyou(false)
                    setVisible(false)
                }, 5000);
            }).catch((err) => {
                setErrors(prev => ({ ...prev, "main": err?.response?.data?.message }))
            })
        }
        setErrors(errors)
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
                    <MKTypography variant="body2" fontWeight="bold" sx={{ marginBottom: "10px" }}>Request to update {orgData?.name}</MKTypography>
                    <Grid item xs={12} md={6} mb={2}>
                        <MKInput
                            type="text"
                            // variant="standard"
                            label="Organization Name"
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={userDetails.organizationName}
                            onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "organizationName": "Required" }) }}
                            error={userDetails.organizationName != "" || !createClick ? false : true}
                            onChange={(e) => { setUserDetails({ ...userDetails, "organizationName": e.target.value }); setErrors(prev => ({ ...prev, "organizationName": "" })) }}
                        />
                        {"organizationName" in errors ? <MKTypography

                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["organizationName"]}
                        </MKTypography> : null}


                    </Grid>
                    <Grid item xs={12} md={6} mb={2}>

                        <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required>
                            <InputLabel id="demo-simple-select-autowidth-label">Organization Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                onChange={handleChange}
                                value={userDetails.organizationType}
                                onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "organizationType": "Required" }) }}
                                autoWidth
                                label="Organization Type"
                                required
                                error={userDetails.organizationType != "" || !createClick ? false : true}
                            >
                                <MenuItem value="">
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
                    <Grid item xs={12} mb={2}>
                        <MKInput
                            // variant="standard"
                            label="Address"
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                            value={userDetails.address}
                            onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "address": "Required" }) }}
                            error={userDetails.address != "" || !createClick ? false : true}
                            onChange={(e) => { setUserDetails({ ...userDetails, "address": e.target.value }); setErrors(prev => ({ ...prev, "address": "" })) }}
                        />
                        {"address" in errors ? <MKTypography

                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["address"]}
                        </MKTypography> : null}
                    </Grid>
                    <Grid item xs={12} md={6} mb={2}>

                        <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required>
                            <InputLabel id="demo-simple-select-autowidth-label">Country</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                onChange={(e) => { setUserDetails({ ...userDetails, "country": e.target.value }); setErrors(prev => ({ ...prev, "country": "" })) }}
                                onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "country": "Required" }) }}
                                autoWidth
                                label="Country"

                                value={userDetails.country}
                                required
                                error={userDetails.country != "" || !createClick ? false : true}
                            >
                                {options.map((res,i) => <MenuItem key={i} value={res.label}>{res.label}</MenuItem>)}

                            </Select>
                        </FormControl>


                        {"country" in errors ? <MKTypography

                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                        >
                            {errors["country"]}
                        </MKTypography> : null}
                    </Grid>
                    <Grid item xs={12} md={6} mb={2}>
                        <PhoneInput value={userDetails.contact} onChange={phone => setUserDetails({ ...userDetails, "contact": phone })} />
                    </Grid>

                    <Grid item xs={12} mb={2}>
                        <MKInput
                            type="text"
                            // variant="standard"
                            label="Organization Info"
                            multiline rows={2}
                            value={userDetails.about}
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            onChange={(e) => setUserDetails({ ...userDetails, "about": e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={8} display='flex' justifyContent='center' alignItems="center">
                        <UploadToS3WithNativeSdk setImage={setCompanyImg} setLoad={setImgLoad} setFileName={setFileName} fileType="image" title="UPload image" />
                    </Grid>
                    <Grid item xs={4} display='flex' justifyContent='center' alignItems="center">
                        {imgLoad ? <CircularProgress color="inherit" /> :
                            <MKAvatar src={companyImg ?? orgData.logo} className="logo_2" variant="square" alt="Avatar" size="lg" />}
                    </Grid>

                    <MKBox mt={4} mb={1}>
                        <Grid container item justifyContent="center" xs={12} mt={5} mb={2}>
                            <MKButton variant="gradient" color="info" onClick={handleRequest}>
                                Request to update {orgData?.name}
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
                : <ThankYou orgName={orgData?.name} style={style} />}

        </Modal>
    );
}