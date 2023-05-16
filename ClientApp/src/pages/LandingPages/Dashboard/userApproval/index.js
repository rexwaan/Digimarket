import MKBox from "components/MKBox";
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import MKAvatar from "components/MKAvatar";
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import '../dashboard.css'
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import CircularProgress from '@mui/material/CircularProgress';
import Bucket from '../../../../aws';
import organisationService from "services/organisation.service";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import userRequestService from "services/userRequest.service";


const drawerWidth = 72;

const OrganizationApproval = () => {
    const [ListOrg, setListOrg] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(20)
    const [rejectionReasons, setRejectionReasons] = useState({});
    const [error, setError] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(0);


    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : "";
    const orgName = localStorage.getItem("orgName") ? JSON.parse(localStorage.getItem("orgName")) : "";
    useEffect(() => {
        getUserDataFromDb(orgId, 0, limit)
        setOffset(limit)
    }, [])

    const fetchMoreData = () => {
        getUserDataFromDb(orgId, offset, limit)
        setOffset(offset + limit)
    };


    const getUserDataFromDb = (orgId, offset, limit) => {
        userRequestService.GetUserRequestsForApproval(orgId, offset, limit).then(
            (res) => {

                if (res.data.result.length == 0) {
                    setHasMore(false)
                    if (offset == 0)
                        setListOrg([])
                }
                else {
                    setListOrg(offset != 0 ? ListOrg.concat(res.data.result) : res.data.result)
                }


            }
        ).catch(err => {

            setHasMore(false)
            if (offset == 0)
                setListOrg([])

        })
    }

    const handleRequest = (type, userRequestId) => {
        if (type == 0 && (rejectionReasons[`${userRequestId}`] == undefined || rejectionReasons[`${userRequestId}`]?.length < 30)) {
            setSelectedUserId(userRequestId)
            setError(true)
        }
        else {
            setError(false)
            setListOrg([])
            setHasMore(true)
            let user = JSON.parse(localStorage.getItem("user"));

            userRequestService.SetUserRequestApprovalStatus({
                userRequestId: userRequestId,
                isApproved: type == 1 ? true : false,
                isRejected: type == 1 ? false : true,
                reason: type != 1 ? rejectionReasons[`${userRequestId}`] : "",
                userId: user?.userId,
                roleId: null
            }).then(() => {
                getUserDataFromDb(orgId, 0, limit)
                setOffset(limit)
            });
        }
    }

    return (
        <MKBox
            component="main"
            bgColor="white"
            borderRadius="xl"
            shadow="lg"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
            <Toolbar />
            <MKTypography variant="h4">List of Members joining requests to {orgName}</MKTypography>

            {/* <Divider style={{ height: "3px" }} /> */}
            <InfiniteScroll
                dataLength={ListOrg.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <Grid item xs={12} textAlign="center">
                        <CircularProgress color="inherit" />
                    </Grid>
                }
                // height={600}
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>No More Data to show</b>
                    </p>
                }
            >
                {ListOrg.map((i, index) => (
                    <MKBox
                        sx={
                            index % 2 == 0 ? { backgroundColor: "rgb(248,248,248)" } : { backgroundColor: "#FFFFFF" }}
                        key={index}
                        padding={3}
                    >
                        <Grid container spacing={3} alignItems="center"  >
                            <Grid item xs={12} md={9} lg={9}>
                                <ListItem alignItems="flex-start">
                                    {/* <ListItemAvatar>
                                        <MKAvatar alt="Remy Sharp" src={i.logo} />
                                    </ListItemAvatar> */}
                                    <ListItemText
                                        primary={i.firstName + " " + i.lastName}
                                        secondary={
                                            <MKBox sx={{ padding: 2 }}>
                                                <MKTypography variant="caption" component={'span'} className="org-desc" >
                                                    <strong>1. Email Address</strong>: {i.email} <br />
                                                    <strong>2. First Name</strong>:   {i.firstName}<br />
                                                    <strong>3. Last Name</strong>:    {i.lastName}<br />
                                                    <strong>4. Date of Birth</strong>:    {i.dob}<br />
                                                    <strong>5. Contact No</strong>:    {i.contact_number}<br />
                                                    <strong>6. User requested to join as: </strong>:    {i.role.name}<br />
                                                </MKTypography>
                                            </MKBox>
                                        }
                                    />
                                </ListItem>
                            </Grid>

                            <Grid container justifyContent="center" item xs={12} md={3} lg={3}>
                                <Grid item xs={12}>
                                    <MKButton variant="gradient" color="success" fullWidth sx={{ marginBottom: "10px" }} onClick={() => handleRequest(1, i.userRequestId)}>
                                        Approve user request
                                    </MKButton>
                                </Grid>



                                <Grid item xs={12} mt={2}>

                                    <MKTypography variant="caption" component={"div"}>
                                        Rejection reason(s)
                                    </MKTypography>
                                </Grid>
                                <Grid item xs={12}>

                                    <MKTypography variant="caption" component={"div"}>
                                        This will be shared via email with the user
                                    </MKTypography>
                                </Grid>
                                <Grid item xs={12} mt={2}>

                                    <MKInput
                                        type="text"
                                        label="Reasons"
                                        multiline rows={4}
                                        fullWidth
                                        onChange={(e) => setRejectionReasons({ ...rejectionReasons, [`${i.userRequestId}`]: e.target.value })}
                                    />
                                    {(error && selectedUserId == i.userRequestId) &&
                                        <MKTypography variant="caption" color="error">
                                            Minimum 30 character required
                                        </MKTypography>
                                    }
                                </Grid>
                                <Grid item xs={12} mt={2}>

                                    <MKTypography variant="caption" component={"div"}>
                                        Request Status: <strong>Pending</strong>
                                    </MKTypography>
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <MKButton variant="gradient" color="error" fullWidth sx={{ marginBottom: "10px" }} onClick={() => handleRequest(0, i.userRequestId)}>
                                        Reject user request
                                    </MKButton>
                                </Grid>

                            </Grid>
                        </Grid>
                        {/* <Divider style={{ height: "3px" }} /> */}
                    </MKBox>
                ))}
            </InfiniteScroll>
        </MKBox>

    );
}


export default OrganizationApproval


