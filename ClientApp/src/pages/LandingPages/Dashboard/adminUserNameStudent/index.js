import React, { useEffect, useState } from 'react'
import AddStudentBox from '../../../../components/AddStudentBox';
import Toolbar from '@mui/material/Toolbar';
import MKBox from "components/MKBox";
import Grid from "@mui/material/Grid"
import Divider from '@mui/material/Divider';
import { toast, ToastContainer } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DataGrid } from '@mui/x-data-grid';
import MKAvatar from "components/MKAvatar";
import MKButton from "components/MKButton";
import ResetPass from '../../../../components/ResetPass';
import usernameloginstudentService from '../../../../services/usernameloginstudent.service';
import moment from 'moment';
import Fuse from 'fuse.js'
import usermanagementService from '../../../../services/usermanagement.service';
import Bucket from '../../../../aws';
import awsService from "../../../../services/aws.service"


const options = {
    includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
    matchAllTokens: true,
    findAllMatches: true,
    includeScore: false,
    includeMatches: false,
    shouldSort: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["keywords"],
}

const drawerWidth = 72;

const AdminUserNameStudent = () => {

    const orgName = localStorage.getItem("orgName") ? JSON.parse(localStorage.getItem("orgName")) : null;
    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
    const [selectedParent, setselectedParent] = React.useState(0);
    const [resetPass, setResetPass] = React.useState(false);
    const [created, setCreated] = React.useState(false);
    const [studentId, setStudentId] = React.useState(0);
    const [rawData, setRawData] = React.useState([]);
    const [minAge, setMinAge] = React.useState("");
    const [maxAge, setMaxAge] = React.useState("");
    const [parents, setParents] = React.useState([]);
    const [searched, setSearched] = React.useState("");


    const handleSearch = (e) => {
        const result = fuse.search(e.target.value)
        if (e.target.value == "") {
            setStudents(rawData)
        }
        else {
            setStudents(result.map((ele) => ele.item))
        }
    }
    const columns = [
        {
            field: 'image',
            headerName: '',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <MKAvatar alt="Remy Sharp" src={params.row.image} />
            )
        },
        {
            field: 'firstName',
            headerName: 'First name',
            flex: 1

        },
        {
            field: 'lastName',
            headerName: 'Last name',
            flex: 1

        },
        {
            field: 'userName',
            headerName: 'User name',
            flex: 1

        },
        {
            field: 'dob',
            headerName: 'Date of Birth',
            flex: 1
        },
        {
            field: 'linkedParent',
            headerName: 'Linked Parent',
            flex: 1,
            minWidth:200,
            renderCell: (params) => <span>{params.row.linkedParent?.name}</span>
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1
        },
        {
            field: 'resetPass',
            headerName: 'Reset Password',
            flex: 1,
            renderCell: (params) => params.row.userId != null ? <MKButton color="info" onClick={() => handleResetPass(params)}>Reset Password</MKButton> : null
        },
    ];


    const handleResetPass = (params) => {
        setStudentId(params.row.userId);
        setResetPass(true)
    }

    const fuse = new Fuse(rawData, options)
    const [students, setStudents] = useState([])

    useEffect(() => {
        usernameloginstudentService.getUserNameLoginRequests(orgId).then((res) => {
            let students = [];
            var promiseforImages = res.data.result.map((ele) => {
                return awsService.GetSignedUrl(ele.image)
                    .then((res) => {
                        let _data = {}
                        _data = {
                            ...ele, "image": res.data.result 
                        }

                        return _data

                    })
                    .catch(function (err) {
                        return ele
                    })
            });
            Promise.all(promiseforImages).then((data) => {
                data.map(ele => {
                    let student = {
                        "id": ele.usernameLoginStudentId,
                        "firstName": ele.firstName,
                        "lastName": ele.lastName,
                        "userName":ele.userName,
                        "dob": ele.dob,
                        "linkedParent": ele.linkedParent,
                        "status": ele.status,
                        "image": ele.image,
                        "userId": ele.userId,
                        "keywords": [ele.linkedParent.name, ele.firstName, ele.lastName, ele.dob]
                    }
                    students.push(student)
                })
                setRawData(students)
                setStudents(students)
            
            })
           
        });
        usermanagementService.GetUsersWithRolesByOrganization(orgId).then(res => {
            let parents = []
            res.data.result.filter((ele) => ele.isActive ).map(ele => {
                if (ele.roles.some(x => x.name === "Parent")) {
                    parents.push(ele.user)
                }
            })
            setParents(parents)
        })
    }, [created])


    const handleAge = (data) => {

        if (minAge != "" && maxAge != "") {
            setStudents(data.map((x) => {
                if (x.dob !== null) {
                    let age = moment().diff(x.dob, 'years')
                    if ((age >= minAge) && (age <= maxAge)) {
                        return x
                    }
                }
            }).filter(x => x))
        }
        else if (minAge != "" && maxAge == "") {
            setStudents(data.map((x) => {
                if (x.dob !== null) {
                    let age = moment().diff(x.dob, 'years')
                    if (age >= minAge) {
                        return x
                    }
                }
            }).filter(x => x))
        }
        else if (minAge == "" && maxAge != "") {
            setStudents(data.map((x) => {
                if (x.dob !== null) {
                    let age = moment().diff(x.dob, 'years')
                    if (age <= maxAge) {
                        return x
                    }
                }
            }).filter(x => x))
        }
        else {
            setStudents(data)
        }
    }

    const handleFilter = (parentValue, searchVal ,fromSelect, fromInput) => {
        let data = [];
        let selectfilter = fromSelect ? parentValue : selectedParent
        let inputfilter = fromInput ? searchVal : searched

        if (inputfilter != "") {
            const result = fuse.search(inputfilter)
            data = result.map((ele) => ele.item)
            if (selectfilter != 0) {
                data = data.filter(x => x.linkedParent.id == selectfilter)
                console.log(data, selectfilter)
                handleAge(data)
            }
            else {
                handleAge(data)
            }
        } else {
            data = rawData
            if (selectfilter != 0) {
                data = data.filter(x => x.linkedParent.id == selectfilter)
                handleAge(data)
            }
            else {
                handleAge(data)
            }
        }
    }


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if(parseInt(minAge) > parseInt(maxAge) && maxAge != ""){
            setMaxAge(minAge)
          }
        }, 1000)
    
        return () => clearTimeout(delayDebounceFn)
      }, [minAge])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if(parseInt(maxAge) < parseInt(minAge) && maxAge != ""){
            setMinAge(maxAge)
          }
        }, 1000)
    
        return () => clearTimeout(delayDebounceFn)
      }, [maxAge])


    const handleMinAge=(e)=>{
    
        if (e.target.value < 1 && e.target.value != "") {
            setMinAge(1)
        }
        // else if (parseInt(e.target.value) > maxAge && maxAge != ""){
        //     setMaxAge(e.target.value)
        //     setMinAge(e.target.value)
        // }
        else {
            setMinAge(e.target.value)
        }
  }
  const handleMaxAge=(e)=>{
    
    if (e.target.value < 1 && e.target.value != "") {
        setMaxAge(1)
    }
    // else if (parseInt(e.target.value) < minAge && e.target.value != ""){
    //     setMaxAge(e.target.value)
    //     setMinAge(e.target.value)
    // }
    else {
        setMaxAge(e.target.value)
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
            {/* <ToastContainer /> */}
            <MKTypography variant="h4">UserName Login students in {orgName}</MKTypography>
            <Divider style={{ height: "3px" }} />
            <AddStudentBox type={0} created={setCreated} editMode={false} />
            <Divider style={{ height: "3px" }} />
            <MKTypography variant="h4">UserName Login students List:</MKTypography>
            <MKBox p={3}>

                <MKBox width="100%" component="form" method="post" autoComplete="off">
                    <Grid container >
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

                                onChange={(e) => {
                                    setSearched(e.target.value)
                                    handleFilter(0 ,e.target.value, false, true)
                                }}
                            />
                        </Grid>
                        <Grid container item xs={12} lg={8} spacing={3}>
                            <Grid item xs={12} md={4}>
                                <MKBox ml={{ xs: "auto", lg: 3 }}
                                    mr={{ xs: "auto", lg: 3 }}>
                                    <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }}>
                                        <InputLabel id="demo-simple-select-autowidth-label">Select Parent</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-autowidth-label"
                                            id="demo-simple-select-autowidth"
                                            value={selectedParent}
                                            onChange={(e) => {
                                                setselectedParent(e.target.value)
                                                handleFilter(e.target.value, "" ,true, false)
                                            }}
                                            // onBlur = {handleFilter}
                                            autoWidth
                                            label="Select Parent"
                                            defaultValue=""
                                        >
                                            <MenuItem value={0}>None</MenuItem>
                                            {parents.flatMap((x, i) => <MenuItem key={i} value={x.userId}>{x.firstname} {x.lastname}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </MKBox>

                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MKInput
                                    label="From Age"
                                    fullWidth
                                    type="number"
                                    InputProps={{ inputProps: { min: 1 } }}
                                    onKeyDown={(evt) =>
                                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                                      evt.preventDefault()
                                    }
                                    value={minAge}
                                    onChange={(e) => handleMinAge(e)}
                                    onBlur={() => handleFilter(0, "" ,false, false)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <MKInput
                                    label="To Age"
                                    fullWidth
                                    type="number"
                                    InputProps={{ inputProps: { min: 1 } }}
                                    onKeyDown={(evt) =>
                                      ["e", "E", "+", "-", "."].includes(evt.key) &&
                                      evt.preventDefault()
                                    }
                                    value={maxAge}
                                    onChange={(e) => handleMaxAge(e)}
                                    onBlur={() => handleFilter(0, "" ,false, false)}
                                />
                            </Grid>



                        </Grid>

                    </Grid>


                </MKBox>

            </MKBox>
            <Divider style={{ height: "3px" }} />
            <Grid container>
                <MKBox sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={students}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                    />
                </MKBox>
            </Grid>
            {resetPass &&
                <ResetPass visible={resetPass} setVisible={setResetPass} studentId={studentId} isAdmin={true} />
            }
        </MKBox>
    )
}

export default AdminUserNameStudent;