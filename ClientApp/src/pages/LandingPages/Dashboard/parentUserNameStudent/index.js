import React, { useEffect } from 'react'
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
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import usernameloginstudentService from '../../../../services/usernameloginstudent.service';
// import studentService from '../../../../services/usernameloginstudent.service';
import Bucket from '../../../../aws';
import awsService from "../../../../services/aws.service"


const drawerWidth = 72;


const ParentUserNameStudent = () => {
   const navigate=useNavigate()
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const [resetPass, setResetPass] = React.useState(false);
    const [student, setStudent] = React.useState([])
    const [requestData, setRequestData] = React.useState([]);
    const [refresh, setRefresh] = React.useState(false);
    const [created, setCreated] = React.useState(false);
    const [date, setDate] = React.useState("");
    const [editMode, setEditMode] = React.useState(false);
    const [paramsData, setParamsData] = React.useState({});
    const [studentId, setStudentId] = React.useState(0);
    const [errors, setErrors] = React.useState({});
    const [reject, setReject] = React.useState({});
 
    useEffect(() => {

  if(!user?.userId){

    console.log(" parent not loginnnnnnnnn")
    navigate("/authentication/sign-in")
  }
  else{
    console.log(" parent not loginnnnnnnnn in else block")
  }

        usernameloginstudentService.getUserNameLoginRequests(0, user?.userId).then(res => {
            let rows = []
            let requestRows = []
            let rejected = {}
            // let imageUrl = ""

    console.log(res.data.result, " paren studnoo")
            var promiseforImages = res.data.result.map((ele) => {
                return awsService.GetSignedUrl(ele.image)
                    .then((res) => {
                        let _data = {}
                        _data = {
                            ...ele, "image": res?.data?.result , "fileName": ele.image
                        }

                        return _data

                    })
                    .catch(function (err) {
                        return ele
                    })
            });
            Promise.all(promiseforImages).then((data) => {
                data.map(ele => {
                    if (ele.userId != null) {
                        let row = {
                            "id": ele.usernameLoginStudentId,
                            "firstName": ele.firstName,
                            "lastName": ele.lastName,
                            "status": ele.status,
                            "userName":ele.userName,
                            "dob": ele.dob,
                            "image": ele.image,
                            "fileName": ele.fileName,
                            "organizationName": ele.linkedOrganizations,
                            "userId": ele.userId
                        }
                        rows.push(row)
                    }
                    else {
                        let row = {
                            "id": ele.usernameLoginStudentId,
                            "firstName": ele.firstName,
                            "lastName": ele.lastName,
                            "organizationName": ele.organizationName,
                            "status": ele.status,
                            "userName":ele.userName,
                            "dob": ele.dob,
                            "image": ele.image,
                            "fileName": ele.fileName,
                            "organizationName": ele.linkedOrganizations,
                        }
                        requestRows.push(row)
                        rejected = { ...rejected, [ele.usernameLoginStudentId]: ele.status.trim().toLowerCase() === "rejected" }
                    }
                })
                setStudent(rows)
                setRequestData(requestRows)
                setReject(rejected)
            })

        })

    }, [refresh, created])


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
            field: 'organizationName',
            headerName: 'Linked',
            flex: 1,
            renderCell: (params) => params.row.organizationName.map((x,i) => <span key={i}>{x.name} , </span>)
        },

        {
            field: 'resetPass',
            headerName: 'Reset Password',
            flex: 1,
            sortable: false,
            renderCell: (params) => <MKButton color="info" onClick={() => handleResetPass(params)}>Reset Password</MKButton>
        },
        {
            field: 'edit',
            headerName: 'Edit',
            flex: 1,
            sortable: false,
            renderCell: (params) => <MKButton color="info" onClick={() => handleEdit(params)}>Edit Info</MKButton>
        },
        {
            field: 'shareInfo',
            headerName: 'Share Info',
            flex: 1,
            sortable: false,
            renderCell: (params) => <Checkbox {...label} />
        },
    ];

    const handleEdit = (params) => {
        setEditMode(true)
        setParamsData(params)
        console.log(params)
    }

    const handleResetPass = (params) => {
        setStudentId(params.row.userId);
        setResetPass(true)
    }



    const columns2 = [
        // { field: 'id', headerName: 'ID', flex: 1 },

        // {
        //     field: 'image',
        //     headerName: '',
        //     flex: 1,
        //     minWidth: 150,
        //     renderCell: (params) => (
        //         <MKAvatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        //     )
        // },

        {
            field: 'firstName',
            headerName: 'First name',
            flex: 1,
            minWidth: 150,

        },
        {
            field: 'lastName',
            headerName: 'Last name',
            flex: 1,
            minWidth: 150,

        },
        {
            field: 'userName',
            headerName: 'User name',
            flex: 1,
            minWidth: 150,

        },
        {
            field: 'dob',
            headerName: 'Date of Birth',
            flex: 1,
            minWidth: 450,
            sortable: false,
            renderCell: (params) => (
                <Grid container>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Date of Birth"
                                value={date[params.id] ? date[params.id] : null}
                                maxDate = {new Date().setDate(0)}
                                onChange={(newValue) => {
                                    setDate({
                                        ...date, [params.id]: newValue
                                    });
                                    setErrors({
                                        ...errors, [params.id]: ""
                                    })
                                }}
                                fullWidth
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <MKTypography
                        fontSize="0.75rem"
                        color="error"
                        style={{ display: "block" }}
                        textGradient
                    >
                        {errors[params.id]}
                    </MKTypography>
                </Grid>
            )
        },

        {
            field: 'organizationName',
            headerName: 'Org Name',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => params.row.organizationName.map((x,i) => <span key={i}>{x.name} , </span>)
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                <MKTypography>{params.row.status}</MKTypography>
            )
        },
        {
            field: 'app/reject',
            headerName: 'Approve / Reject',
            flex: 1,
            minWidth: 250,
            sortable: false,
            renderCell: (params) => (
                <Grid display={"flex"} justifyContent="space-between">
                    <MKButton color="info" style={{ marginRight: 10 }} onClick={() => handleApprove(params, 0)}>Approve</MKButton>
                    {reject[params.id] ? <MKButton color="info" onClick={() => handleDelete(params)}>  Delete</MKButton> :
                        <MKButton color="info" onClick={() => handleApprove(params, 1)}>  Reject</MKButton>
                    }
                </Grid>
            )
        },

    ];

    const handleApprove = (params, status) => {

        const error_ = {}
        if ((date[params.id] == undefined || date[params.id] == "") && status == 0) {
            error_[params.id] = "Required"
        }
        if (Object.keys(error_).length === 0) {
            setRefresh(false)
            let postRequest = {
                "usernameLoginStudentId": params.id,
                "dob": status == 0 ? date[params.id].format('LL') : null,
                "isApprved": status == 0 ? true : false,
                "isRejected": status == 1 ? true : false
            }
            usernameloginstudentService.updateUserNameLoginRequest(user?.userId, postRequest).then(res => {
                setReject({
                    ...reject, [params.id]: true
                })
                setRefresh(true)
            })
        }
        setErrors(error_)
    }

    const handleDelete = (params) => {
        setRefresh(false)
        usernameloginstudentService.deleteUserNameLoginRequest(params.id).then(res => {
            setRefresh(true)
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
            {/* <ToastContainer /> */}
            <MKTypography variant="h4">My Kids</MKTypography>
            <Divider style={{ height: "3px" }} />
            <AddStudentBox type={1} created={setCreated} editMode={editMode} paramsData={paramsData} setEditMode={setEditMode} />
            <Divider style={{ height: "3px" }} />
            <MKTypography variant="h4">List of kids (students) for approval:</MKTypography>

            <Divider style={{ height: "3px" }} />
            <Grid container>
                <MKBox sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={requestData}
                        columns={columns2}
                        rowHeight={100}
                        autoPageSize
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                    />
                </MKBox>
            </Grid>
            <Divider style={{ height: "3px" }} />
            <MKTypography variant="h4">My Kids (Students):</MKTypography>

            <Divider style={{ height: "3px" }} />
            <Grid container>
                <MKBox sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={student}
                        columns={columns}
                        rowHeight={100}
                        autoPageSize
                        rowsPerPageOptions={[10]}
                        disableSelectionOnClick
                    />
                </MKBox>
            </Grid>
            {resetPass &&
                <ResetPass visible={resetPass} setVisible={setResetPass} studentId={studentId} isAdmin={false} />
            }
        </MKBox>
    )
}

export default ParentUserNameStudent;