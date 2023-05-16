import MKBox from "components/MKBox";
import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import MKAvatar from "components/MKAvatar";
import Grid from "@mui/material/Grid";
import '../dashboard.css'
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import CircularProgress from '@mui/material/CircularProgress';
import Bucket from '../../../../aws';
import awsService from '../../../../services/aws.service'
import organisationService from "../../../../services/organisation.service";
import organizationrequestService from "../../../../services/organizationrequest.service";

import Modal from "@mui/material/Modal";

const drawerWidth = 72;
const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    //  wrap:"break-word",
    height: "60%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const OrganizationApproval = () => {
    const [ListOrg, setListOrg] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [error, setError] = useState(false);
    const [selectedOrgId, setSelectedOrgId] = useState(0);
    const [rejectionReasons, setRejectionReasons] = useState({});
    const [visible, setVisible] = useState(false)
    const [changes, setChanges] = useState({});
    const [oldData, setOldData] = useState({});
    const handleClose = () => setVisible(false);
    const orgType = ["School", "University", "Day Care", "Extra Curricular Activities", "Club"]
    useEffect(() => {
        getOrgDataFromDb(offset, limit)
        setOffset(limit)
    }, [])

    const fetchMoreData = () => {
        getOrgDataFromDb(offset, limit)
        setOffset(offset + limit)
    };


    const getOrgDataFromDb = (offset, limit) => {
        organisationService.getOrganizationRequests(offset, limit).then(
            (res) => {
                let orgData = res.data.result.filter((_ele) => _ele.organizationIsApproved != 1 && _ele.organizationIsRejected != 1)
                var promiseforImages = orgData.map((ele) => {
                   
                    return awsService.GetSignedUrl(ele.logo)
                        .then((res) => {
                            let _data = {}
                            _data = {
                                ...ele, "logo": res.data.result
                            }

                            return _data

                        })
                        .catch(function (err) {
                            return ele
                        })
                });
                Promise.all(promiseforImages).then((data) => {
                    if (data.length == 0) {
                        setHasMore(false)
                        if (offset == 0)
                            setListOrg([])
                    }
                    else {
                        setListOrg(offset != 0 ? ListOrg.concat(data) : data)
                    }

                })
            }
        )
    }

    const handleRequest = (type, orgId, editMode, organizationRequestId) => {

        if (!editMode) {

            if (type == 0 && (rejectionReasons[`${orgId}`] == undefined || rejectionReasons[`${orgId}`]?.length < 30)) {
                setSelectedOrgId(orgId)
                setError(true)
            }
            else {
                setError(false)
                setListOrg([])
                setHasMore(true)
                let user = JSON.parse(localStorage.getItem("user"));


                organisationService.setOrganizationApprovalStatus({
                    organizationId: orgId,
                    isApproved: type == 1 ? true : false,
                    isRejected: type == 1 ? false : true,
                    reason: type != 1 ? rejectionReasons[`${orgId}`] : "",
                    createdBy: user?.userId
                }).then(() => {

                    getOrgDataFromDb(0, limit)
                    setOffset(limit)
                });
            }
        }
        else {
            let user = JSON.parse(localStorage.getItem("user"));
            organizationrequestService.ApproveRejectOrganizationEditRequest(
                organizationRequestId,
                type == 1 ? true : false,
                user?.userId
            ).then(() => {
                getOrgDataFromDb(0, limit)
                setOffset(limit)
            });
        }
    }

    const openPopUp = (REQUEST) => {
       console.log(REQUEST,"request changes")
        setChanges(REQUEST)
        organisationService.getSingleOrganization(REQUEST.organizationId).then((res) => {
            
            if (res.data.result.logo != "" || res.data.logo != null) {
                awsService.GetSignedUrl(res.data.result?.logo)
                    .then((resp) => {
                        console.log("then block data ")
                        setOldData({ ...res.data.result, "logo": resp.data.result });
                        if(REQUEST.logo==null||REQUEST.logo==""){
                        setChanges({...REQUEST,"logo": resp.data.result})}
                    })
                    .catch(function (err) {
                        console.log("catch block data ")
                        console.log(err);
                    })

            }
            else {
                setOldData({ ...res.data.result, "logo": "" });
                // setChanges({...REQUEST,"logo":""})
            }
            setVisible(true)
        })
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
            <MKTypography variant="h4">List of workspaces creation requests</MKTypography>

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
                                    <ListItemAvatar>
                                        <MKAvatar alt="Remy Sharp" src={i.logo} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={i.isEditRequest ? <MKTypography style={{ cursor: "pointer" }} onClick={() => openPopUp(i)}>{i.organizationName}</MKTypography> : i.organizationName}
                                        secondary={
                                            <MKBox sx={{ padding: 2 }}>
                                                <MKTypography variant="caption" component={'span'} className="org-desc" >
                                                    <ol>
                                                        {!i.isEditRequest &&
                                                            <>
                                                                {/* <li>  <strong> Email Address</strong>: {i.email}</li> */}
                                                                <li>  <strong> First Name</strong>:   {i.firstname}</li>
                                                                <li>  <strong> Last Name</strong>:    {i.lastname}</li>
                                                            </>
                                                        }
                                                        <li>    <strong> About Organization</strong>:    {i.aboutOrganziation}</li>
                                                        <li>    <strong> Country</strong>:    {i.country}               </li>
                                                        <li>    <strong> Address</strong>:    {i.address}</li>
                                                        <li>     <strong> Contact No</strong>:    {i.contactNumber}</li>
                                                        <li>     <strong> Type of Organization</strong>:    {orgType[i.typeOfOrganization - 1]}</li>
                                                    </ol>


                                                </MKTypography>
                                            </MKBox>
                                        }

                                    />
                                </ListItem>
                            </Grid>

                            <Grid container justifyContent="center" item xs={12} md={3} lg={3}>
                                <Grid item xs={12}>
                                    <MKButton variant="gradient" color="success" fullWidth sx={{ marginBottom: "10px" }} onClick={() => handleRequest(1, i.organizationId, i.isEditRequest, i.organizationRequestId)}>
                                        {!i.isEditRequest ? "Approve workspace creation request" : "Approve workspace edit request"}
                                    </MKButton>
                                </Grid>


                                {!i.isEditRequest &&
                                    <>
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
                                                onChange={(e) => setRejectionReasons({ ...rejectionReasons, [`${i.organizationId}`]: e.target.value })}
                                            />
                                            {(error && selectedOrgId == i.organizationId) &&
                                                <MKTypography variant="caption" color="error">
                                                    Minimum 30 character required
                                                </MKTypography>
                                            }
                                        </Grid>
                                    </>
                                }

                                <Grid item xs={12} mt={2}>

                                    <MKTypography variant="caption" component={"div"}>
                                        Request Status: <strong>Pending</strong>
                                    </MKTypography>
                                </Grid>
                                <Grid item xs={12} mt={2}>
                                    <MKButton variant="gradient" color="error" fullWidth sx={{ marginBottom: "10px" }} onClick={() => handleRequest(0, i.organizationId, i.isEditRequest, i.organizationRequestId)}>
                                        {!i.isEditRequest ? "Reject workspace creation request" : "Reject workspace edit request"}
                                    </MKButton>
                                </Grid>

                            </Grid>
                        </Grid>
                        {/* <Divider style={{ height: "3px" }} /> */}
                    </MKBox>
                ))}
            </InfiniteScroll>

            {visible &&

                <Modal
                    keepMounted
                    open={visible}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <MKBox width="100%" style={{ overflowWrap: 'break-word' }} sx={style} >
                        <Grid display="flex" justifyContent={"center"} style={{ gap: 345 }} item xs={12} md={6}>
                            <MKTypography variant="h4" sx={{ textAlign: "center" }}>
                                Old Data
                            </MKTypography>
                            <MKTypography variant="h4" sx={{ textAlign: "center" }}>
                                Updated Data
                            </MKTypography>
                        </Grid>
                        <Divider style={{ height: "3px" }} />
                        <Grid container>

                            <Grid display="flex" justifyContent={"center"} item xs={12} md={6}>
                                <ol>
                                <li>    <strong>Organization Name</strong>:    {oldData?.name}</li>
                                    <li>    <strong> About Organization</strong>:    {oldData?.aboutOrganziation}</li>
                                    <li>    <strong> Country</strong>:    {oldData?.country}               </li>
                                    <li>    <strong> Address</strong>:    {oldData?.address}</li>
                                    <li>     <strong> Contact No</strong>:    {oldData?.contactNumber}</li>
                                    <li>     <strong> Type of Organization</strong>:    {orgType[oldData?.typeOfOrganization - 1]}</li>
                                    <li>   <Grid display="flex" item xs={12} md={6}>  <strong> Image</strong>:
                                        <MKAvatar alt="Avatar" src={oldData?.logo} />
                                    </Grid>
                                    </li>
                                </ol>
                            </Grid>
                            <Grid display="flex" justifyContent={"center"} item xs={12} md={6}>
                                <ol>
                                <li>    <strong>Organization Name</strong>:    {changes?.organizationName}</li>
                                    <li>    <strong> About Organization</strong>:    {changes?.aboutOrganziation}</li>
                                    <li>    <strong> Country</strong>:    {changes?.country}               </li>
                                    <li>    <strong> Address</strong>:    {changes?.address}</li>
                                    <li>     <strong> Contact No</strong>:    {changes?.contactNumber}</li>
                                    <li>     <strong> Type of Organization</strong>:    {orgType[changes?.typeOfOrganization - 1]}</li>
                                    <li>      <Grid display="flex" item xs={12} md={6}>  <strong> Image</strong>:&nbsp;&nbsp;&nbsp;
                                        <MKAvatar alt="Avatar" src={changes?.logo} />
                                    </Grid>
                                    </li>
                                </ol>
                            </Grid>
                        </Grid>
                    </MKBox>
                </Modal>
            }
        </MKBox>

    );
}


export default OrganizationApproval


