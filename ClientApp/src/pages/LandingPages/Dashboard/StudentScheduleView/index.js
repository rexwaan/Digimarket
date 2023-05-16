import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import Divider from "@mui/material/Divider";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import { useState } from "react";
import Modal from "@mui/material/Modal";
import moment from 'moment';
import courseScheduleService from '../../../../services/courseSchedule.service';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import usercontentService from "services/usercontent.service";
import Switch from "@mui/material/Switch";
import classService from "services/class.service";
import address from '../../../../env';
import io from "socket.io-client";

export default function StudentScheduleView() {
  const [isCourseView, setCourseView] = useState(false)
  const [lessonData, setLessonData] = useState([])
  const [historyLessonData, setHistoryLessonData] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [participantList, setParticipantList] = useState([]);
  const [visible, setVisible] = useState(false)
  const [visibleLocation, setVisibleLocation] = useState(false)
  const [visibleDate, setVisibleDate] = useState(false);
  const handleClose = () => setVisible(false);
  const handleCloseLocation = () => setVisibleLocation(false);
  const handleCloseDate = () => setVisibleDate(false);
  const [locationData, setLocationData] = useState({});
  const [rows, setRows] = useState({});
  const [date, setDate] = useState("");
  const [checkLessonHistory, setCheckLessonHistory] = useState(true);
  const [checkCourseHistoryAgain, setCheckCourseHistoryAgain] = useState(true)
  const [checkCourseHistoryShow, setCheckCourseHistoryShow] = useState({})
  const navigate = useNavigate();
  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const currentUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const ENDPOINT = address.SOCKET;
  const socket = io(ENDPOINT);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    //  wrap:"break-word",
    height: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const handleParticipants = (list) => {
    setParticipantList(list);
    setVisible(true);
  }
  const handleLocation = (data) => {
    setLocationData(data)
    setVisibleLocation(true)
  }
  const handleDate = (date_) => {

    setDate(date_);
    setVisibleDate(true);
  };


  const handleClass = (data) => {
    if(moment(new Date()).diff(moment(data.dateTime), "minutes") > -15 ){
          
      socket.emit("check-user",{
        room:data.lessonName.replace(/\s+/g, '_').toLowerCase() + "_" + data.courseScheduleCourseDetailsId,
        id:user.userId
       })
          navigate("/classroom", {
            state: {
              user: user,
              role: 0,
              className: data.lessonName.replace(/\s+/g, '_').toLowerCase() + "_" + data.courseScheduleCourseDetailsId,
              leadTeacherId: data.leadTeacherId,
              // ongoingClassId: x?.data?.result
            }
          })
          
        // )).catch((e) =>
        // localStorage.getItem("classEnded") === "true" ? 
        // navigate("/classroom", {
        //   state: {
        //     user: user,
        //     role: 0,
        //     className: data.lessonName.replace(/\s+/g, '_').toLowerCase() + "_" + data.courseScheduleCourseDetailsId,
        //     leadTeacherId: data.leadTeacherId,
        //     ongoingClassId:  e?.response?.data?.result
        //   }
        // }) 
        // :
        //   toast.error(
        //     <MKBox sx={{ display: "flex", justifyContent: "center" }}>
        //       <MKTypography variant="contained" color="secondary">
        //         User has Already joined a class!
        //       </MKTypography>
        //     </MKBox>,
        //     {
        //       position: toast.POSITION.TOP_CENTER,
        //       autoClose: false,
        //     }
        //   )
        // )
        }
      else{
      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
            Class not started yet Please wait!
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )
      }

  }
  const MoveToLesson = (lessonId) => {
    usercontentService.getContentbyId(lessonId, "", true).then((res) => {
      navigate("/dashboard/course-detail", {
        state: {
          create: false, data: res?.data?.result, user: currentUser, orgId: orgId
        }
      })
    }).catch((e) => navigate("/dashboard"))
  }
  const handleCourseView = () => {
    setCourseView(true)
    courseScheduleService.GetScheduledLessonByStudent(user?.userId, orgId, true).then((response) => {
      let courseDetail = [];
      let courseHistoryDetail = [];
      let _rows = {};
      let obj = {};
      setCourseList(response.data.result);
      response.data.result?.map((elem, ind) => {
        console.log(elem, "course")
        elem.courseScheduleDetails.map((element, i) => {
          let detail = {
            id: i,
            lessonName: element.userContent.name,
            lessonJoin: "Join Class",
            lessonId: element.userContent.contentId,
            lessonDetails: "View Lesson",
            lessonDuration: element.userContent.properties.find(
              (ele, ind) => ele.key == "Duration in minutes"
            )?.value,
            age:
              element.userContent.properties.find((x) => x.key === "Target Audience Minimal Age")
                ?.value +
              `-` +
              element.userContent.properties.find((x) => x.key === "Target Audience Maximal Age")
                ?.value,
            language: element.userContent.properties.find((ele, ind) => ele.key == "Language")
              ?.value,
            mainTopic: element.userContent.properties.find((ele, ind) => ele.key == "Main Topic")
              ?.value,
            location: element.location,
            dateTime: element.dateTime,
            leadTeacher: element.teacher.name,
            leadTeacherId: element.teacher.id,
            additionalTeam: element.team.map((ele) => ele.name),
            participants: element.participants.map((ele) => ele.name),
            noOfParticipant: element.participants.length + element.team.length,
            "courseScheduleCourseDetailsId": element.courseScheduleCourseDetailsId,
            lessonGuid: element.lessonGuid


          };
          courseDetail.push(detail);
          if (moment(new Date()).diff(moment(element.dateTime)) > 0) {
            courseHistoryDetail.push(detail)
            console.log(" how manay times ", detail)
          }
        });

        _rows[elem.courseId] = courseDetail;
        courseDetail = [];
        if (courseHistoryDetail.length < elem.courseScheduleDetails.length) {

          console.log(courseHistoryDetail.length, elem.courseScheduleDetails.length, elem, " check conditions if")
          obj[elem.courseId] = false;
          //  setCheckCourseHistoryShow({...checkCourseHistoryShow,[elem.courseId]:false})

          console.log(obj, "check status in if block")
        }
        else {
          console.log(courseHistoryDetail.length, elem.courseScheduleDetails.length, elem, " check conditions else")
          obj[elem.courseId] = true;
          // setCheckCourseHistoryShow({...checkCourseHistoryShow,[elem.courseId]:true})

          console.log(obj, "check status in else block")
        }
        courseHistoryDetail = []
      });
      setCheckCourseHistoryShow(obj)
      setRows({ ...rows, ..._rows });

    })
  }

  const columns = [


    {
      field: "lessonJoin",
      headerName: "",
      minWidth: 150,
      renderCell: (params) => {
        return (
          <MKButton variant="contained" color="info" onClick={() => handleClass(params.row)}>
            {params.row.lessonJoin}
          </MKButton>
        );
      }
    },
    {
      field: "lessonName",
      headerName: "Lessons",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "lessonDetails",
      headerName: "Lesson Details",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        // console.log(params,"params data in link  kjsnsdsh")
        return <span style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }} onClick={() => MoveToLesson(params.row.lessonId)}>{params.row.lessonDetails}</span>
      }
    },
    {
      field: "lessonDuration",
      headerName: "Lesson duration in",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "age",
      headerName: "Age",
      // type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "language",
      headerName: "Language",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "mainTopic",
      headerName: "Main Topic",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        return (
          <span onClick={() => handleLocation(params.row.location)}>
            {params.row.location.name}
          </span>
        )
      }
    },
    {
      field: "dateTime",
      headerName: "Date & start time",
      flex: 1,
      minWidth: 350,
      renderCell: (params) => {
        return <span onClick={() => handleDate(moment(params.row.dateTime).format("LLLL"))}>{moment(params.row.dateTime).format("LLLL")}</span>;
      }
    },
    {
      field: "leadTeacher",
      headerName: "Lead Teacher",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "additionalTeam",
      headerName: "Additional Team",
      width: 350,
      renderCell: (params) => {
        return (
          <span onClick={() => handleParticipants(params.row.additionalTeam)}>
            {params.row.additionalTeam.length > 2
              ? (params.row.additionalTeam
                .slice(0, 2)
                .map((x, index) => (
                  <span key={index}>
                    {params.row.additionalTeam.length > 1 ? x + "," : x}
                  </span>
                ))
              )
              : params.row.additionalTeam.map((x, index) => (
                <span key={index}>
                  {params.row.additionalTeam.length > 1 ? x + "," : x}
                </span>
              ))}</span>
        )
      }
    },

    {
      field: "noOfParticipant",
      headerName: "No of Participants",
      type: "number",
      width: 130,

    },
  ];
  React.useEffect(() => {
    courseScheduleService.GetScheduledLessonByStudent(user?.userId, orgId, false).then((res) => {
      let lessonDetail = [];
      let historyLessonDetail = [];
      res.data.result?.map((ele, index) => {
        let detail = {
          "id": index,
          "lessonName": ele.userContent.name,
          "lessonJoin": "Join Class",
          "lessonId": ele.userContent.contentId,
          "lessonDetails": "View Lesson",
          "lessonDuration": ele.userContent.properties.find((ele, ind) => ele.key == "Duration in minutes")?.value,
          "age": ele.userContent.properties.find(x => x.key === "Target Audience Minimal Age")?.value + `-` + ele.userContent.properties.find(x => x.key === "Target Audience Maximal Age")?.value,
          "language": ele.userContent.properties.find((ele, ind) => ele.key == "Language")?.value,
          "mainTopic": ele.userContent.properties.find((ele, ind) => ele.key == "Main Topic")?.value,
          "location": ele.location,
          "dateTime": ele.dateTime,
          "leadTeacher": ele.teacher.name,
          "leadTeacherId": ele.teacher.id,
          "additionalTeam": ele.team.map((ele) => ele.name),
          "participants": ele.participants.map((ele) => ele.name),
          "noOfParticipant": ele.participants.length + ele.team.length,
          "courseScheduleCourseDetailsId": ele.courseScheduleCourseDetailsId,
          "lessonGuid": ele.lessonGuid

        }
        lessonDetail.push(detail)
        if (moment(new Date()).diff(moment(ele.dateTime)) < 0) {
          console.log(moment(new Date()).diff(moment(ele.dateTime)), ele.dateTime, "old data");
          console.log(moment(new Date()).diff(moment("2022-05-26T07:14:00")));
          historyLessonDetail.push(detail);

          console.log(historyLessonDetail, "sdhsgyuasgduiashduashduiwa");
        } else {
          console.log(moment(new Date()).diff(moment(ele.dateTime)), ele.dateTime, "new data");
          console.log(moment(new Date()).diff(moment("2023-05-26T07:14:00")));
        }
      })
      setLessonData(lessonDetail)
      setHistoryLessonData(historyLessonDetail)
    })


  }, [])
  const handleLessonHistory = (e) => {

    setCheckLessonHistory(e.target.checked);

  };
  const handleCourseHistoryAgain = (e) => {
    setCheckCourseHistoryAgain(e.target.checked)
    console.log(e.target.value, " again")
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
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${72}px)` } }}
    >
      <MKTypography variant="h4">Lesson Schedule Student View</MKTypography>
      <MKBox>
        <MKButton
          sx={{ m: 2 }}
          variant="gradient"
          color="info"
          onClick={() => setCourseView(false)}
        >
          Lesson View
        </MKButton>
        <MKButton variant="gradient" color="info" onClick={() => handleCourseView()}>
          Course View
        </MKButton>
      </MKBox>
      <Divider sx={{ height: "3px" }}></Divider>

      {!isCourseView == true ? (
        <>
          <MKBox display="flex">
            <MKTypography>Show history:</MKTypography>
            <Switch
              checked={checkLessonHistory}
              onChange={(e) => handleLessonHistory(e)}
              inputProps={{ "aria-label": "controlled" }}
            />
          </MKBox>
          <MKBox sx={{ height: 380, width: "100%" }}>
            <DataGrid
              rows={!checkLessonHistory ? historyLessonData : lessonData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </MKBox>
        </>
      ) : (
        <>
          <MKBox display="flex">
            <MKTypography> Show history:</MKTypography>
            <Switch
              checked={checkCourseHistoryAgain}
              onChange={(e) => handleCourseHistoryAgain(e)}
              inputProps={{ "aria-label": "controlled" }}
            />
          </MKBox>
          {courseList?.map((ele) => {
            return (
              <>
                {
                  (checkCourseHistoryAgain || !checkCourseHistoryShow[ele.courseId]) && <MKBox sx={{ height: 350, width: "100%" }}>
                    <MKTypography variant="h5">Course Name: {ele.courseName}</MKTypography>
                    <DataGrid
                      rows={rows[ele.courseId] ? rows[ele.courseId] : []}
                      columns={columns}
                      pageSize={10}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      experimentalFeatures={{ newEditingApi: true }}
                    />
                  </MKBox>
                }
                <Divider sx={{ height: "3px" }}></Divider>
              </>

            );
          })}
        </>
      )}

      <Modal
        keepMounted
        open={visible}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox width="100%" style={{ overflowWrap: "break-word" }} autoComplete="off" sx={style}>
          {participantList.map((ele, ind) => ele + " , ")}
        </MKBox>
      </Modal>
      <Modal
        keepMounted
        open={visibleDate}
        onClose={handleCloseDate}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox width="100%" style={{ overflowWrap: "break-word" }} autoComplete="off" sx={style}>
          <MKTypography variant="h6">Date: </MKTypography>{date}
        </MKBox>
      </Modal>
      <Modal
        keepMounted
        open={visibleLocation}
        onClose={handleCloseLocation}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox width="100%" style={{ overflowWrap: "break-word" }} autoComplete="off" sx={style}>
          <MKTypography variant="h5">Location:</MKTypography>
          <MKTypography>{locationData.name}</MKTypography>
          <MKTypography variant="h5">Description:</MKTypography>
          <MKTypography>{locationData.description}</MKTypography>
        </MKBox>
      </Modal>
    </MKBox>
  );
}
