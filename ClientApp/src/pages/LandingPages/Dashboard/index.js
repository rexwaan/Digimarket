import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import MKBox from 'components/MKBox';
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MKAvatar from 'components/MKAvatar';
import organisationService from "services/organisation.service";
import Logo from '../../../Navigation/Header';
import Organization from './organization';
import CreateOrganization from './createOrganization';
import SignInOrganization from './signInOrganization';
import Footer from '../../../Navigation/Footers/CustomFooter';
import MKAlert from "components/MKAlert";
import Icon from "@mui/material/Icon";
import MainRoute from "../../../RoutesNavigation"
import Bucket from '../../../aws';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import awsService from "../../../services/aws.service"
const drawerWidth = 72;


export default function PermanentDrawerLeft() {

  const navigate = useNavigate();


  const [selected, setSelected] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [guestUser, setGuestUser] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [openShiftModal, setOpenShiftModal] = React.useState(false);
  const userId = localStorage.getItem("mainUserId") ? JSON.parse(localStorage.getItem("mainUserId")) : null;
  const [selectedUser, setSelectedUser] = React.useState(null);
  let user = "";
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = ""
  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [response, setResponse] = React.useState({
    status: false,
    error: false,
    message: ""
  });
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNewWorkspace = () => {
    handleClose()
    setOpenCreateModal(true)
  }
  const handleAnotherWorkspace = () => {
    handleClose()
    setOpenShiftModal(true)
  }

  const getDataFromApi = () => {
    setLoading(true)
    organisationService.getOrganizationbyUserId(userId).then((res) => {
  console.log(res.data.result," new user Get sttaus")
      res?.data?.result?.newUser && localStorage.setItem("user", JSON.stringify(res.data.result.newUser));
      var promiseforImages = res.data.result.organizations?.map((ele) => {
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
        setLoading(false)
        let resArr = []
        data.filter(function (item) {
          var i = resArr.findIndex(x => x.organizationId == item.organizationId);
          if (i <= -1) {
            resArr.push(item);
          }
          return null;
        });
        setOrganizationData(resArr);
        const selectedData = data.filter((el) => {
          return el.isSelected
        })
        if (selectedData.length > 0) {
          localStorage.setItem("orgId", JSON.stringify(selectedData[0]?.organizationId));
          localStorage.setItem("orgName", JSON.stringify(selectedData[0]?.name));
        
          let permission = user?.userOgranizations?.map(data => data.organizationId == selectedData[0]?.organizationId ? data.permissions?.map(ele => ele.permissionId) : null).filter((ele_) => ele_ != null)
          if (permission == undefined){
            permission = user?.permissions?.map(ele => ele.permissionId)
          }
          // debugger;
          localStorage.setItem("permissions", JSON.stringify(permission.flat(1)));
          setSelected(selectedData[0])
        }

      })


    }).catch((err) => {
      setResponse({
        error: true,
        message: err?.response ? err?.response.data.message : err?.message
      })

    })
  }

  React.useEffect(() => {
    if (user === null) {
      setGuestUser(true)
    }
    else if (!openCreateModal && !openShiftModal) {
      getDataFromApi();
    }
  }, [openCreateModal, openShiftModal])


  // React.useEffect(() => {
  //   if (openCreateModal == false) {
  //     getDataFromApi();
  //   }
  // }, [openCreateModal])

  // React.useEffect(() => {
  //   if ( == false) {
  //     getDataFromApi();
  //   }
  // }, [openShiftModal])

  const [organizationData, setOrganizationData] = React.useState();



  const getOrgData = (elem) => {
    localStorage.setItem("orgId", JSON.stringify(elem.organizationId));
    localStorage.setItem("orgName", JSON.stringify(elem.name));
    if (user?.isPlatformAdmin) {
      setSelected({
        ...elem, "isSelected": true
      })
      let permission = user?.userOgranizations?.map(data => data.organizationId == elem.organizationId ? data.permissions?.map(ele => ele.permissionId) : null).filter((ele_) => ele_ != null)
      localStorage.setItem("permissions", JSON.stringify(permission.flat(1)))
    }
    else {
      setLoading(true)
      organisationService.activateOrganization(elem.organizationId, userId).then(res => {
        setSelected({
          ...elem, "isSelected": true
        })

        if (res.data.result?.newUser?.userId !== 0) {
          localStorage.setItem("user", JSON.stringify(res.data.result?.newUser));
          setSelectedUser(res.data.result?.newUser)
          let permission = res.data.result?.newUser?.permissions != null ? res.data.result?.newUser?.permissions?.map((e => e.permissionId)) : []
          localStorage.setItem("permissions", JSON.stringify(permission.flat(1)))
        }
        else {
          localStorage.setItem("user", JSON.stringify(res.data.result?.oldUser));
          setSelectedUser(res.data.result?.oldUser)
          let permission = res.data.result?.oldUser?.permissions != null ? res.data.result?.oldUser?.permissions?.map((e => e.permissionId)) : []
          localStorage.setItem("permissions", JSON.stringify(permission.flat(1)))
        }

        setLoading(false)
      }).catch((err) => {
        setLoading(false)
        console.log(err)
      })
    }
    navigate("/dashboard")
  }
  return (

    <Box sx={{ display: 'flex', justifyContent: "center" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Logo position="sticky" guestUser={guestUser} />
      </AppBar>
      <ToastContainer style={{ width: "500px" }} />
      {guestUser ? <MKBox sx={{ display: 'flex', marginTop: "5.3rem", marginBottom: "5.3rem", width: "100%" }}>  <MainRoute />  </MKBox> :

        response.error ? <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
          <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">

            <MKAlert color="error">
              <Icon fontSize="small">error</Icon>&nbsp;
              {response.message}
            </MKAlert>
          </Grid>
        </MKBox> :
          loading ?
            <Grid item xs={12}>
              <MKBox sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress color="inherit" />
              </MKBox>
            </Grid> :
            <>
              <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', top: "5.3rem" },
                }}
              >
                <Divider />

                <Box sx={{ overflow: 'auto', marginBottom: 35 }}>
                  <List>
                    {organizationData?.map((elem, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemButton onClick={() => getOrgData(elem)}  >
                          {elem.logo ? <MKAvatar src={elem.logo} alt="Avatar" size="sm" variant="rounded" sx={selected?.organizationId == elem?.organizationId && selected?.isSelected ? {
                            border: "2px solid gray",
                            borderRadius: "5PX"
                          } : {}} /> :
                            <SquareRoundedIcon fontSize='large' sx={selected?.organizationId == elem?.organizationId && selected?.isSelected ? {
                              border: "2px solid gray",
                              borderRadius: "5PX"
                            } : {}} />
                          }
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                  <MKBox sx={{ display: 'flex', justifyContent: "center" }} >
                    <AddIcon
                      fontSize='large'
                      id="basic-button"
                      sx={{
                        cursor: "pointer"
                      }}
                      aria-controls={open ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick} />
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      value={""}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={handleAnotherWorkspace}>Sign in to another organisation</MenuItem>
                      <MenuItem onClick={handleNewWorkspace}>Create a new organisation</MenuItem>
                    </Menu>
                  </MKBox>
                </Box>
              </Drawer>
              {selected ? <Organization data={selected} user={selectedUser} /> : null}

              {openCreateModal && <CreateOrganization visible={openCreateModal} setVisible={setOpenCreateModal} user={userId} />}
              {openShiftModal && <SignInOrganization visible={openShiftModal} setVisible={setOpenShiftModal} user={userId} />}
            </>
      }<Footer /></Box>
  );
}
