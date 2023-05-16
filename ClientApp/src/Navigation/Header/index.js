import * as React from 'react';
import MKAvatar from "components/MKAvatar";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo_1 from "assets/images/logos/Recurso_15.png"
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MKTypography from "components/MKTypography";
import { useNavigate } from "react-router-dom";
import "../../assets/customStyling/logo.css";
import CreateOrgRequest from '../../pages/LandingPages/Dashboard/registerOrgModal';
import authService from "services/auth.service";
import SettingsIcon from "@mui/icons-material/Settings";
import Bucket from "../../aws"
import awsService from "../../services/aws.service"
import { useEffect, useState } from "react";

function Logo(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const [visibleCreateOrgModal, setVisibleCreateOrgModal] = useState(false);
    const [checkUser, setCheckUser] = useState();
    const [userImage, setUserImage] = useState();
    let user = "";
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
        user = ""
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSignIn = () => {
        navigate("/authentication/sign-in")
        setAnchorEl(null);
    }
    const handleLogout = () => {
        authService.logout();
        navigate("/authentication/sign-in")
        setAnchorEl(null);
    }
    const handleAskToJoin = () => {
        navigate("/dashboard")
        setAnchorEl(null);
    }
    const handleCreateOrg = () => {
        setVisibleCreateOrgModal(true)
        setAnchorEl(null);
    }



    useEffect(() => {
        const handleInvalidToken = e => {
            if (e.key === 'user' && e.oldValue && !e.newValue) {
                authService.logout();
                navigate("/authentication/sign-in")
            }
        }
        window.addEventListener('storage', handleInvalidToken)
        return function cleanup() {
            window.removeEventListener('storage', handleInvalidToken)
        }
    }, [handleLogout])

    const userSetting = () => {
        navigate("/dashboard/setting")
    }
    useEffect(() => {

        //  console.log(user.image," this is image");
        setCheckUser(localStorage.getItem("user") !== null);
        awsService.GetSignedUrl(user?.image)
            .then((res) => {

                // console.log(res, "in dashboard")
                setUserImage(res.data.result);
            })
            .catch(function (err) {
                console.log(err);
            })
    }, [])

    return (
        <Grid position={props.position} top="0" left="0" zIndex="1" width="100%" >
            <Grid>
                <MKBox
                    sx={
                        {
                            display: "flex",
                            justifyContent: "space-between"
                        }
                    }
                    color="white"
                    bgColor="white"
                    variant="gradient"
                    borderRadius="sm"
                    shadow="sm"
                    opacity={1}
                    p={2}
                >
                    <MKBox sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
                        <MKAvatar src={logo_1} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        <MKTypography>Digimarket</MKTypography>
                    </MKBox>
                    <MKBox sx={{ display: "flex", alignItems: "center" }}>
                        {checkUser ? (
                            <MKBox mt={1} mr={2} sx={{ fontSize: "30px", cursor: "pointer" }} onClick={userSetting}>
                                <SettingsIcon />
                            </MKBox>
                        ) : null}
                        {user?.image === null || user?.image === "" || user == null ?
                            <AccountCircleIcon
                                fontSize="large"
                                id="basic-button1"

                                sx={{
                                    cursor: "pointer",
                                }}
                                aria-controls={open ? "basic-menu1" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClick}
                            /> : <MKAvatar
                                fontSize="large"
                                id="basic-button1"
                                src={userImage}
                                sx={{
                                    cursor: "pointer",
                                }}
                                aria-controls={open ? "basic-menu1" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClick}
                            />
                        }

                        {user === null ? (
                            <Menu
                                id="basic-menu1"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                value={""}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button1',
                                }}
                            >

                                <MenuItem onClick={handleSignIn}>Sign in</MenuItem>
                                <MenuItem onClick={handleAskToJoin}>Ask to join organisation</MenuItem>
                                <MenuItem onClick={handleCreateOrg}>Create a new organisation</MenuItem>
                            </Menu>
                        ) : (
                            <Menu
                                id="basic-menu1"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}

                                MenuListProps={{
                                    'aria-labelledby': 'basic-button1',
                                }}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>

                            </Menu>
                        )}



                    </MKBox>
                </MKBox>
            </Grid>
            <CreateOrgRequest visible={visibleCreateOrgModal} setVisible={setVisibleCreateOrgModal} status={1} />
        </Grid>
    )
}

export default Logo;