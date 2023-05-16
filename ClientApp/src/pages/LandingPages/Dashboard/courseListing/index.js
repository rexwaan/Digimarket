import MKBox from "components/MKBox";
import React, { useState, useEffect, useCallback, Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Toolbar from "@mui/material/Toolbar";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import "../dashboard.css";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link, useNavigate } from "react-router-dom";
import MKAvatar from "components/MKAvatar";
import logo_1 from "assets/images/logos/Recurso_15.png";
import CircularProgress from "@mui/material/CircularProgress";
import _debounce from "lodash/debounce";
import usercontentService from "services/usercontent.service";
import Bucket from "../../../../aws";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "react-router-dom";
import { Languages_ } from "../Languages/index";
import awsService from "../../../../services/aws.service"
// import SearchIcon from '@mui/icons-material/Search';
const drawerWidth = 72;

const CourseListing = () => {
  const [searchAge, setSearchAge] = useState();
  const [searchLanguage, setSearchLanguage] = useState();
  const [searchMainTopic, setSearchMainTopic] = useState();
  const [searchKeywords, setSearchKeywords] = useState();
  const [ListOrg, setListOrg] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [age, setAge] = React.useState("");
  const [searchLesson,setSearchLesson]=useState("")
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [searchParams, setSearchParams] = useSearchParams();

  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : "";
  const permissions = localStorage.getItem("permissions")
    ? JSON.parse(localStorage.getItem("permissions"))
    : [];
  const navigate = useNavigate();

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  useEffect(() => {
    if (searchParams.get("contentId") != null) {
      if (searchParams.get("token") != null) {
        usercontentService
          .getContentbyId(searchParams.get("contentId"), searchParams.get("token"))
          .then((res) => {

         
            navigate("/dashboard/course-detail", {
              state: {
                create: false,
                data: res?.data?.result,
                user: currentUser,
                orgId: orgId,
              },
            });
          })
          .catch((e) => navigate("/dashboard"));
      } else {
        navigate("/dashboard");
      }
    } else {
        // setListOrg([])
      getOrgDataFromDb("", 0, limit,"","","","",true);
      setOffset(limit);
    }
  }, []);

  const fetchMoreData = () => {
    // setListOrg([])
    getOrgDataFromDb("", offset, limit,"","","","",false);
    setOffset(offset + limit);
  };

  const getOrgDataFromDb = (inputValue, offset, limit,searchKeywords, searchMainTopic, searchLanguage, searchAge, search = false) => {
    usercontentService
      .getContent(inputValue, offset, limit, currentUser?.userId, orgId,searchKeywords, searchMainTopic, searchLanguage, searchAge)
      .then((res) => {
       
        var promiseforImages = res?.data?.result?.map
        ((ele) => {
        //   // console.log(ele," ele data in list content")
          return awsService.GetSignedUrl(ele.logo).then((res)=>{
        
               
                    let _data = {};
                    _data = {
                      ...ele,
                      logo: res.data.result,
                    };
      
                    return _data;
                  
          }).catch(function (err) {
                  return ele;
                });
        });
        Promise.all(promiseforImages).then((data) => {
          if (data.length == 0) {
            setHasMore(false);
            if (limit == 0) {
              setListOrg([]);
            }
          } else {
            
            setListOrg(search ? data : ListOrg.concat(data));
          }
        });
      })
      .catch((err) => setHasMore(false));
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 1000), []);

  function handleDebounceFn(inputValue) {
    // setListOrg([])
    getOrgDataFromDb(inputValue, 0, 0,"","","","");
  }

  const handleSearch = (e) => {
    debounceFn(e.target.value);
    setSearchLesson(e.target.value)
  };

  const handleLessonCreation = () => {
    // console.log(permissions);
    if (permissions.includes(8) || currentUser?.isPlatformAdmin) {
      navigate("/dashboard/course-detail", {
        state: {
          create: true,
          data: {},
          user: currentUser,
          orgId: orgId,
        },
      });
    } else {
      


      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
          {"Sorry access denied !"}
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )

    }
  };
  const handleSearchLesson = () => {
    // console.log(searchKeywords, searchMainTopic, searchLanguage, searchAge);
    // setListOrg([]);
    getOrgDataFromDb(searchLesson, 0, 0,searchKeywords, searchMainTopic, searchLanguage, searchAge,true)
  };

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
      <Divider style={{ height: "3px" }} />
      <Grid container>
        <Grid item xs={12} lg={6}>
          <MKTypography variant="h4">List of Content (Curriculum)</MKTypography>
        </Grid>
        {currentUser ? (
          <Grid item xs={12} lg={6} display="flex" justifyContent={"center"}>
            <MKButton variant="gradient" color="info" onClick={handleLessonCreation}>
              Create New Lesson
            </MKButton>
          </Grid>
        ) : null}
      </Grid>
      <MKBox p={3}>
        <MKBox width="100%" component="form" method="post" autoComplete="off">
          <Grid container spacing={3} >
            <Grid item xs={12} lg={2}>
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
            <Grid container item xs={12} lg={10} spacing={3} >
              <Grid item xs={12} md={3}>
                <MKBox ml={{ xs: "auto", lg: 3 }} mr={{ xs: "auto", lg: 3 }}>
                  <MKInput
                    label="Main Topic"
                    //   value={name}
                    onChange={(e) => setSearchMainTopic(e.target.value.toLowerCase())}
                    required
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} md={3}>
                <MKBox ml={{ xs: "auto", lg: 3 }} mr={{ xs: "auto", lg: 3 }}>
                  <MKInput
                    label="Keywords"
                    //   value={name}
                    onChange={(e) => setSearchKeywords(e.target.value.toLowerCase())}
                    required
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} md={3}>
                <MKBox ml={{ xs: "auto", lg: 3 }} mr={{ xs: "auto", lg: 3 }}>
                  <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">Languages*</InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      onChange={(e) => setSearchLanguage(e.target.value)}
                      //   value={selectLang}
                      //   onBlur={(e) => {
                      //     e.target.value == ""
                      //       ? setErrorProperties({
                      //           ...errorProperties,
                      //           Language: "Required",
                      //         })
                      //       : setErrorProperties({ ...errorProperties, Language: "" });
                      //   }}
                      autoWidth
                      required
                      label="Languages"
                    >
                      {Languages_.map((ele, i) => {
                        return (
                            
                            ele.name=="None"?   <MenuItem key={i} value="" open={open}>None</MenuItem>
                         : <MenuItem key={i} value={ele.name} open={open}>
                            {ele.name}
                          </MenuItem>
                           );
                      })}
                    </Select>
                  </FormControl>
                </MKBox>
              </Grid>
              <Grid item xs={12} md={2}>
                <MKBox ml={{ xs: "auto", lg: 3 }} mr={{ xs: "auto", lg: 3 }}>
                  <MKInput
                    type="number"
                    InputProps={{ inputProps: { min: 1 } }}
                    onKeyDown={(evt) =>
                      ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()
                    }
                    label="Age"
                    //   value={name}
                    onChange={(e) => setSearchAge(e.target.value)}
                    required
                  />
                </MKBox>
              </Grid>
              <Grid item xs={12} md={1}>
              <SearchIcon
                style={{
                  cursor: "pointer",
                  color: "#318BEC",
                  height: "50px",
                  width: "50px"
                }}
                onClick={handleSearchLesson}
              />
              </Grid>
            </Grid>
          </Grid>
        </MKBox>
      </MKBox>
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
        // endMessage={
        //     <p style={{ textAlign: "center" }}>
        //         <b>Yay! You have seen it all</b>
        //     </p>
        // }
      >
        {ListOrg.map((i, index) => (
          <Fragment key={index}>
            <Divider style={{ height: "3px" }} />
            <MKBox
              sx={
                index % 2 == 0
                  ? { backgroundColor: "rgb(248,248,248)" }
                  : { backgroundColor: "#FFFFFF" }
              }
              key={index}
              padding={3}
            >
              <Grid container spacing={3} alignItems="center" style={{ height: 100 }}>
                <Grid item xs={12} md={4} lg={6}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <MKAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={i.name}
                      secondary={
                        <MKTypography component={"span"} className="org-desc">
                          {JSON.parse(i.shortDescription)?.blocks[0]?.text.substring(0, 100)}...
                          <Link
                            to="/dashboard/course-detail"
                            state={{ create: false, data: i, user: currentUser, orgId: orgId }}
                            style={{ fontWeight: "bold" }}
                          >
                            Read More
                          </Link>
                        </MKTypography>
                      }
                    />
                  </ListItem>
                </Grid>

                <Grid container spacing={3} justifyContent="center" item xs={12} md={4} lg={4}>
                  <MKButton
                    variant="gradient"
                    color="info"
                    onClick={() =>
                      navigate("/dashboard/course-detail", {
                        state: {
                          create: false,
                          data: i,
                          user: currentUser,
                          orgId: orgId,
                        },
                      })
                    }
                  >
                    See Lesson documentation
                  </MKButton>
                </Grid>
                <Grid container spacing={3} justifyContent="center" item xs={12} md={2} lg={2}>
                  <MKBox sx={{ display: "flex", alignItems: "center" }}>
                    <MKAvatar
                      src={i.logo}
                      className="logo_2"
                      variant="square"
                      alt="Avatar"
                      size="lg"
                    />
                  </MKBox>
                </Grid>
              </Grid>
            </MKBox>
          </Fragment>
        ))}
      </InfiniteScroll>
    </MKBox>
  );
};

export default CourseListing;
