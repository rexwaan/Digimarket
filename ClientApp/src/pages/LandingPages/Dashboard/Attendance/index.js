import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import Divider from "@mui/material/Divider";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";
// import Attendance from "../../../../services/attendance.service"
import attendance from "../../../../services/attendance.service";
import CircularProgress from "@mui/material/CircularProgress";
import Bucket from "../../../../aws";
import awsService from "../../../../services/aws.service"
export default function Attendance(props) {
  const [studentData, setStudentData] = useState([]);
  const  { state } = useLocation();
  const [loading, setLoading] = useState(0);
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [students, setStudents] = useState([]);
  let dat = [];
  const handleAttendance = (userId_, attendanceId, status) => {
    // setLoading(true)
    setLoading(userId_);
    let dataRequest = [];

    let request = {
      courseScheduleAttendanceId: attendanceId,
      courseScheduleCourseDetailsId: props?.state?.lessonId ??  state?.lessonId,
      userId: userId_,
      isPresent: status,
      markedBy: user?.userId,
    };
    dataRequest.push(request);
    attendance.MarkAttendance(dataRequest).then((response) => {
      GetData(userId_);
    });
  };
  const columns = [
    {
      field: "image",
      headerName: "",
      // flex: 1,
      width: 80,
      renderCell: (params) => <Avatar alt="Remy Sharp" src={params.row.image} />,
    },

    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      width: 250,
    },

    {
      field: "dateOfBirth",
      headerName: "Date",
      // type: "number",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "linkedParent",
      headerName: "Linked Parent",
      // type: "number",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "attended",
      headerName: "Attended",
      // flex: 1,
      minWidth: 150,
      renderCell: (params) => {

        if (params.row.attended == "Yes") {
          return (
            <MKButton
              sx={{ m: 2 }}
              variant="gradient"
              color="success"
              onClick={() => handleAttendance(params.row.userId, params.row.attendanceId, false)}
            >
              {params.row.userId == loading ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                params.row.attended
              )}
            </MKButton>
          );
        } else {
          return (
            <MKButton
              sx={{ m: 2 }}
              variant="gradient"
              color="error"
              onClick={() => handleAttendance(params.row.userId, params.row.attendanceId, true)}
            >
              {params.row.userId == loading ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                params.row.attended
              )}
            </MKButton>
          );
        }
      },
    },
  ];
  useEffect(() => {
    GetData(0);
  },[]);

  const GetData = (idd) => {
    attendance.GetMembersForAttendance(props?.state?.lessonId ??  state?.lessonId).then((res) => {
      // debugger;
      var promiseforImages = res?.data?.map((ele) => {
        return awsService.GetSignedUrl(ele?.image)
          .then((res) => {
            let _data = {};
            _data = {
              ...ele,
              image: res.data.result,
            };
            return _data;
          })
          .catch(function (err) {
            return ele;
          });
      });
      Promise.all(promiseforImages).then((data) => {
        if (data.length == 0) {
          setStudents([]);
        } else {
          setStudents(data);
          let detailParticipant = [];
          data?.map((ele, index) => {
            let detail = {
              id: index,
              userId: ele.userId,
              image: ele.image,
              firstName: ele.firstName,
              lastName: ele.lastName,
              dateOfBirth: ele.dob,
              linkedParent: ele.parentName,
              type: ele.type,
              attended: ele.status,
              attendanceId: ele.attendanceId,
            };
            detailParticipant.push(detail);
          });
          setStudentData(detailParticipant);
          setLoading(0);
          
        }
      
      });
    });
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
      sx={{ flexGrow: 1, p: 5, width: props?.state == undefined ? { sm: `calc(100% - ${72}px)` } : { sm: `100%` } , height: "78vh" }}
    >
      {/* < */}
      <Grid display="flex" justifyContent={"space-between"}>
        <MKTypography variant="h4">Attendance List</MKTypography>
        <MKTypography>
          <strong>Lesson Name: </strong> {props?.state?.lessonName ??  state?.data?.lessonName}
        </MKTypography>
        <MKTypography>
          <strong>Date and Start Time: </strong> {props?.state?.data?.dateTime ??  state?.data?.dateTime}
        </MKTypography>
        <MKTypography>
          <strong>Language: </strong> {props?.state?.data?.language ??  state?.data?.language}
        </MKTypography>
      </Grid>
      <Divider sx={{ height: "3px" }}></Divider>
      <DataGrid
        rows={studentData ? studentData : []}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </MKBox>
  );
}
