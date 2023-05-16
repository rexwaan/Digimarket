import MKBox from "components/MKBox";
import React, { useState, useCallback, useEffect, Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Toolbar from '@mui/material/Toolbar';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import './dashboard.css';
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import AskToJoin from './AskToJoin';
import _debounce from 'lodash/debounce';
import organizationData from 'services/organisation.service';
import Bucket from '../../../aws';
import MKAvatar from "components/MKAvatar";
import CreateOrgRequest from './registerOrgModal';
import CreateOrganization from './createOrganization';
import countryList from 'react-select-country-list';
import { useMemo } from 'react';
import { useSearchParams } from "react-router-dom";
import organisationService from "services/organisation.service";
import awsService from "../../../services/aws.service"
const drawerWidth = 72;
const Dashboardd = () => {
    const options = useMemo(() => countryList().getData(), [])
    const [ListOrg, setListOrg] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(10)
    const [age, setAge] = React.useState("");
    const [orgId, setOrgId] = useState();
    const [orgName, setOrgName] = useState("");
    const [openAskToJoinModal, setOpenAskToJoinModal] = React.useState(false);
    const [visibleCreateOrgModal, setVisibleCreateOrgModal] = React.useState(false)
    const [openCreateModal, setOpenCreateModal] = React.useState(false)
    const [searchParams,setSearchParams]=useSearchParams()
    const navigate = useNavigate();
    const [typeOrg,setTypeOrg]=useState()
    const[countryOrg,setCountryOrg]=useState("")
    const [searchOrg,setSearchOrg]=useState("")
    const [orgLoader,setOrgLoader]=useState(false)
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    let user = "";
    let orgId_=null;
    try {
        user = JSON.parse(localStorage.getItem("user"));
        orgId_ = JSON.parse(localStorage.getItem("orgId"));
    } catch (error) {
        user = ""
    }
    useEffect(() => {
        getOrgDataFromDb("", offset, limit,"","",true)
        setOffset(offset + limit)
    }, [])

    useEffect(()=>{
   if(searchParams.get("orgId")!==null){

    organisationService.getSingleOrganization(searchParams.get("orgId")).then((res)=>{
        console.log(res.data.result, "get data . single")
  navigate("/dashboard/organization-detail",{
    state:{
        data: res?.data?.result

    }
  })
    }).catch((e) => navigate("/dashboard"))
   }
    },[])

    const fetchMoreData = () => {
        getOrgDataFromDb("", offset, limit,"","",false)
        setOffset(offset + limit)
    };


    const getOrgDataFromDb = (inputValue, offset, limit,type,country,search=false) => {

        organizationData.getOrganizations(inputValue, offset, limit, user?.userId,type,country).then(
            (res) => {
                setOrgLoader(false)
                // var promiseforImages = res?.data?.result?.map((ele) => {
                //     return Bucket.promisesOfS3Objects(ele.logo)
                //         .then((data) => {
                //             let _data = {}
                //             _data = {
                //                 ...ele, "logo": data
                //             }
                //             return _data
                //         })
                //         .catch(function (err) {
                //             return ele
                //         })
                // });

              var promisesForImg=res?.data?.result?.map((ele)=>{
               return awsService.GetSignedUrl(ele.logo).then((res)=>{
                    let _data = {}
                    _data = {
                        ...ele, "logo": res?.data?.result
                    }
                    return _data
                    // console.log(res.data.result,"images results")
                }).catch(function (err) {
                    return ele
                })
              })
              

                Promise.all(promisesForImg).then((data) => {
      
                    if (data.length == 0) {
                        // console.log("in 1st")
                        setHasMore(false)
                        if (limit == 0) {
                            // console.log("in second")
                            setListOrg([])
                        }
                    }
                    else {

                        // console.log(data," data from sdhhasdkasl")
                        setListOrg(search ? data : ListOrg.concat(data))
                        
                    }

                })


            }
        ).catch((err) => {
            setHasMore(false)
        })
    }

    const debounceFn = useCallback(_debounce(handleDebounceFn, 1000), []);

    function handleDebounceFn(inputValue) {
        getOrgDataFromDb(inputValue, 0, 0,"","",true)
    }

    const handleSearch = (e) => {
        debounceFn(e.target.value)
        setSearchOrg(e.target.value)
        console.log(debounceFn," search datahidhioew")

    }

    const handleOpenCreateRequest = () => {

        user === null ? setVisibleCreateOrgModal(true) : setOpenCreateModal(true)
    }

    const handleAsktoJoin = (orgId, orgName) => {
        setOrgId(orgId)
        setOrgName(orgName)
        setOpenAskToJoinModal(true)
    }
    const handleSearchOrg=()=>{
        console.log(Number(typeOrg),countryOrg,"dataaa")
        setListOrg([])
        setOrgLoader(true)
        getOrgDataFromDb(searchOrg,0,2000,typeOrg,countryOrg,true)
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
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <Typography variant="body1">
                        The Erasmus+ programme has launched a special tender for strategic partnerships in autumn 2020 in response to the educational challenges posed by COVID-19. (KA-226-SCH)
                    </Typography>
                </Grid>
                <Grid item xs={4} display="flex" justifyContent="center">
                    <MKButton variant="gradient" color="info"
                        onClick={handleOpenCreateRequest}
                    >
                        Register a New Organization
                    </MKButton>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2">
                        In our international cooperation in the frame of Erasmus+ KA-226-SCH, launched in May 2021, we aim to develop a knowledge base of methodological and teaching materials and an interactive, freely usable and developable online framework, which will equip teachers with knowledge, ideas, adeptness with different methodologies and easy-to-use teaching materials in the difficult situation of COVID-19, while at the same time helping to forge a positive future out of what we can learn from COVID-19. The knowledge base puts a special emphasis on teaching children with learning difficulties and gifted children - while also leading toward new ways of pedagogy for the future, facilitated by digital solutions.

                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <MKButton variant="gradient" color="info" onClick={() => navigate("/dashboard/course-listing")}>
                        Go to Content (Curriculum) Page
                    </MKButton>
                </Grid>

            </Grid>
            <Divider style={{ height: "3px" }} />
            <MKTypography variant="h4">List of Organizations</MKTypography>
            <MKBox p={3}>

                <MKBox width="100%" component="form" method="post" autoComplete="off">
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={4}>
                            <MKInput

                                label="Search"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}

                                onChange={handleSearch}
                            />
                        </Grid>
                        <Grid container item xs={12} lg={8} spacing={3}>
                            <Grid item xs={12} md={5}>
                                <MKBox ml={{ xs: "auto", lg: 3 }}
                                    mr={{ xs: "auto", lg: 3 }}>
                                     <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 500 }} required>
                            <InputLabel id="demo-simple-select-autowidth-label">Organization Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                onChange={(e)=>setTypeOrg(e.target.value)}
                                // onBlur={(e) => { e.target.value == "" && setErrors({ ...errors, "organizationType": "Required" }) }}
                                autoWidth
                                
                                label="Organization Type"
                                // error={orgDetails.typeOfOrganization != "" || !createClick ? false : true}
                            >
                                <MenuItem value={""}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={1}>School</MenuItem>
                                <MenuItem value={2}>University</MenuItem>
                                <MenuItem value={3}>Day Care</MenuItem>
                                <MenuItem value={4}>Extra Curricular Activities</MenuItem>
                                <MenuItem value={5}>Club</MenuItem>
                            </Select>
                        </FormControl>
                                </MKBox>

                            </Grid>
                            <Grid item xs={12} md={5}>
                                <MKBox ml={{ xs: "auto", lg: 3 }}
                                    mr={{ xs: "auto", lg: 3 }}>
                                    <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }} required>
                            <InputLabel id="demo-simple-select-autowidth-label">Country</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                onChange={(e) =>  setCountryOrg(e.target.value) }
                
                                autoWidth
                                label="Country"
                               
                            // error={orgrDetails.countryCode != "" || !createClick ? false : true}
                            >
                                {options.map((res,ind) => <MenuItem key={ind} value={res.label}>{res.label}</MenuItem>)}

                            </Select>
                        </FormControl>
                                </MKBox>
                            </Grid>
                        
                          
                            <SearchIcon
        style={{ cursor: "pointer", color: "#318BEC", height: "50px", width: "50px",marginTop:"20px" }} onClick={handleSearchOrg}/>

                        </Grid>
      
                    </Grid>
     


                </MKBox>

            </MKBox>

            <InfiniteScroll
                dataLength={ListOrg.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                    <Grid item xs={12} textAlign="center">
                        <CircularProgress color="inherit" />
                    </Grid>
                }
            >
                {  orgLoader?  <Grid item xs={12} textAlign="center">
                        <CircularProgress color="inherit" />
                    </Grid>: ListOrg.map((i, index) => (
                    <Fragment key={index}>
                        <Divider style={{ height: "3px" }} />
                        <MKBox

                            sx={
                                index % 2 == 0 ? { backgroundColor: "rgb(248,248,248)" } : { backgroundColor: "#FFFFFF" }}
                            key={index}
                            padding={3}
                        >

                            <Grid container spacing={3} alignItems="center"
                            >
                                <Grid item xs={12} md={4} lg={4}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemAvatar>
                                            <MKAvatar alt="Remy Sharp" src={i.logo} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={i.name}
                                            secondary={
                                                <MKTypography component={'span'} className="org-desc" >{i.aboutOrganziation?.substring(0, 100)}... <Link to="/dashboard/organization-detail" state={{ index: index, data: i }} style={{ fontWeight: "bold" }}>Read More</Link>
                                                </MKTypography>
                                            }
                                        />
                                    </ListItem>
                                </Grid>
                                <Grid container spacing={3} justifyContent="center" item xs={12} md={4} lg={4}>
                                    <MKButton variant="gradient" color="info" onClick={() => navigate("/dashboard/organization-detail", {
                                        state: {
                                            index: index,
                                            data: i
                                        }
                                    })}>
                                        Info
                                    </MKButton>
                                </Grid>
                                <Grid container spacing={3} justifyContent="center" item xs={12} md={4} lg={4}>
                                    {i.creator != user?.userId && !i.isUserExistInOrganization &&
                                        <MKButton variant="gradient" color="info" onClick={() => handleAsktoJoin(i.organizationId, i.name)}>
                                            Ask to join {i.name}
                                        </MKButton>
                                    }
                                </Grid>
                            </Grid>

                        </MKBox>
                    </Fragment>
                ))}
            </InfiniteScroll>
            <AskToJoin visible={openAskToJoinModal} setVisible={setOpenAskToJoinModal} orgId={orgId} orgName={orgName} />

            <CreateOrgRequest visible={visibleCreateOrgModal} setVisible={setVisibleCreateOrgModal} status={1} />
            <CreateOrganization visible={openCreateModal} setVisible={setOpenCreateModal} user={user?.userId} />
        </MKBox>

    );
}


export default Dashboardd;


