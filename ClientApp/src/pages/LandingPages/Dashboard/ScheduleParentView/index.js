import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import MKBox from "components/MKBox";
import Divider from "@mui/material/Divider";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import MKAvatar from "components/MKAvatar"
import Avatar from "@mui/material/Avatar";
import { useNavigate ,Navigate } from "react-router-dom";
import courseScheduleService from '../../../../services/courseSchedule.service';
import {useState }from "react"
import Modal from "@mui/material/Modal";
import moment from 'moment';
import Switch from "@mui/material/Switch";
import usercontentService from "services/usercontent.service";
export default function ScheduleParentView() {
  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const currentUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const[courseIcon,setCourseIcon]=useState()
    const[isCourseView,setCourseView]=useState(false)
    const [lessonData,setLessonData]=useState([])
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
   const [checkCourseHistoryAgain,setCheckCourseHistoryAgain]=useState(true)
   const [checkCourseHistoryShow, setCheckCourseHistoryShow]=useState({})
    const navigate=useNavigate();
  const handleNavigate=()=>{
   
  navigate("/dashboard/attendance")
  }
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
  const handleParticipants=(list)=>{
    setParticipantList(list);
    setVisible(true);
  }
  const handleLocation=(data)=>{
    setLocationData(data)
    setVisibleLocation(true)
  }
  const handleDate = (date_) => {
 
    setDate(date_);
    setVisibleDate(true);
  };
  const MoveToLesson=(lessonId)=>{
    usercontentService.getContentbyId(lessonId, "",true,user?.userId,orgId).then((res) => { 
      // console.log(res,"response nhihiodhjikidsijkoidshidjic")
      navigate("/dashboard/course-detail", {
          state: {
              create: false, data: res?.data?.result, user: currentUser, orgId: orgId
          }
      })
  }).catch((e) => navigate("/dashboard"))
  }
  const handleCourseView=()=>{
    setCourseView(true)
    courseScheduleService.GetScheduledLessonByParent(user?.userId, orgId, true).then((response) => {
      // console.log(response," response in parent course View")
      let courseDetail = [];
      let courseHistoryDetail=[];
      let _rows = {};
      let obj={};
    setCourseList(response.data.result);
      response.data.result?.map((elem,ind)=>{
        elem.courseScheduleDetails.map((element,index) => {

          let detail={
            "id":index,
            "lessonId": element.userContent.contentId,
            "lessonName":element.userContent.name,
            "lessonDetails":"View Lesson",
            "lessonDuration":element.userContent.properties.find((ele,ind)=> ele.key== "Duration in minutes")?.value,
            "age": element.userContent.properties.find(x => x.key === "Target Audience Minimal Age")?.value + `-` + element.userContent.properties.find(x => x.key === "Target Audience Maximal Age")?.value,
          "language":element.userContent.properties.find((ele,ind)=>ele.key== "Language")?.value,
        "mainTopic":element.userContent.properties.find((ele,ind)=>ele.key=="Main Topic")?.value,
        "location":element.location,
        "dateTime":element.dateTime,
        "leadTeacher":element.teacher.name,
        "additionalTeam":element.team.map((ele)=>ele.name),
        "noOfParticipant":element.participants.length+element.team.length,
        "childName":element.participants.map((ele)=>ele.name),
            }
          
          courseDetail.push(detail);
          if (moment(new Date()).diff(moment(element.dateTime)) > 0) {
            courseHistoryDetail.push(detail)
            console.log(" how manay times ",detail)
      }
        })
       
        _rows[elem.courseId] = courseDetail;
        courseDetail=[];
        if(courseHistoryDetail.length<elem.courseScheduleDetails.length){
           
          console.log(courseHistoryDetail.length,elem.courseScheduleDetails.length,elem," check conditions if")
         obj[elem.courseId]=false;
         //  setCheckCourseHistoryShow({...checkCourseHistoryShow,[elem.courseId]:false})

             console.log(obj, "check status in if block")
         }
         else{
           console.log(courseHistoryDetail.length,elem.courseScheduleDetails.length,elem," check conditions else")
          obj[elem.courseId]=true;
           // setCheckCourseHistoryShow({...checkCourseHistoryShow,[elem.courseId]:true})
           
           console.log(obj, "check status in else block")
         }
         courseHistoryDetail=[]
      })
      setCheckCourseHistoryShow(obj)
      setRows({ ...rows, ..._rows });

    })
  }
    const columns = [

      {
        field: "lessonName",
        headerName: "Lessons",
        minWidth: 150,
        flex: 1,
      
      },
      {
        field: "lessonDetails",
        headerName: "Lesson Details",
        minWidth: 150,
        flex: 1,
        renderCell:(params)=>{
          // console.log(params,"params data in link additional team")
         return <span style={{color:"blue",textDecoration:"underline",cursor:"pointer"}} onClick={()=>MoveToLesson(params.row.lessonId)}>{params.row.lessonDetails }</span>
        }
      },
      {
        field: "lessonDuration",
        headerName: "Lesson duration in",
        minWidth: 250,
        flex: 1,
     
      },
      {
        field: "age",
        headerName: "Age",
        minWidth: 130,
      flex: 1,
      
      },
      {
        field: "language",
        headerName: "Language",
        minWidth: 150,
        flex: 1,
      },
      {
        field: "mainTopic",
        headerName: "Main Topic",
        minWidth: 250,
        flex: 1,
      },
      {
        field: "location",
        headerName: "Location",
        minWidth: 250,
        flex: 1,
        renderCell:(params)=>{
          return(
            <span onClick={() => handleLocation(params.row.location)}>
            {params.row.location.name}
          </span>
          )
        }
      },
      {
        field: "dateTime",
        headerName: "Date & start time",
        minWidth: 350,
        flex: 1,
        renderCell: (params) => {
          return <span onClick={() => handleDate(moment(params.row.dateTime).format("LLLL"))}>{moment(params.row.dateTime).format("LLLL")}</span>;
        }
      },
      {
        field: "leadTeacher",
        headerName: "Lead Teacher",
        minWidth: 250,
        flex: 1,
        // editable: true,
      },
      {
        field: "additionalTeam",
        headerName: "Additional Team",
        minWidth: 350,
        flex: 1,
        renderCell:(params)=>{
          return (
            <span onClick={()=>handleParticipants(params.row.additionalTeam)}>
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
        // editable: true,
      },
      {
        field: "noOfParticipant",
        headerName: "No of Participants",
        minWidth: 120,
        flex: 1,
        // editable: true,
      },
      {
        field: "childName",
        headerName: "Name of Child",
        minWidth: 200,
        flex: 1,
        // editable: true,
      },
    ];
    React.useEffect(()=>{
      courseScheduleService.GetScheduledLessonByParent(user?.userId,orgId,false).then((res)=>{
      
        let lessonDetail = [];
        let historyLessonDetail = [];
        res.data.result?.map((ele,index)=>{
          let detail={
          "id":index,
          "lessonName":ele.userContent.name,
         
          "lessonId": ele.userContent.contentId,
          "lessonDetails":"View Lesson",
          "lessonDuration":ele.userContent.properties.find((ele,ind)=> ele.key== "Duration in minutes")?.value,
          "age": ele.userContent.properties.find(x => x.key === "Target Audience Minimal Age")?.value + `-` + ele.userContent.properties.find(x => x.key === "Target Audience Maximal Age")?.value,
        "language":ele.userContent.properties.find((ele,ind)=>ele.key== "Language")?.value,
      "mainTopic":ele.userContent.properties.find((ele,ind)=>ele.key=="Main Topic")?.value,
      "location":ele.location,
      "dateTime":ele.dateTime,
      "leadTeacher":ele.teacher.name,
      "additionalTeam":ele.team.map((ele)=>ele.name),
      "noOfParticipant":ele.participants.length+ele.team.length,
      "childName":ele.participants.map((ele)=>ele.name),
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
        setHistoryLessonData(historyLessonDetail);
      })
  
    },[])
    const handleLessonHistory = (e) => {
  
      setCheckLessonHistory(e.target.checked);
     
    };
    const handleCourseHistoryAgain=(e)=>{
      setCheckCourseHistoryAgain(e.target.checked)
      console.log(e.target.value," again")
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
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${72}px)` }}}
    >
      <MKTypography variant="h4">Lesson Schedule Parent View</MKTypography>
      <MKBox>
        <MKButton sx={{ m: 2 }} variant="gradient" color="info" onClick={()=>setCourseView(false)}>
          Lesson View
        </MKButton>
        <MKButton variant="gradient" color="info" onClick={()=>handleCourseView()}>
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
              onChange={(e)=>handleLessonHistory(e)}
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
                    onChange={(e)=>handleCourseHistoryAgain(e)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </MKBox>
          {courseList?.map((ele) => {
            return (
              <>
              {
                 ( checkCourseHistoryAgain||!checkCourseHistoryShow[ele.courseId])&&<MKBox sx={{ height: 350, width: "100%" }}>
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
                <MKBox width="100%" style={{ overflowWrap: 'break-word' }} autoComplete="off" sx={style} >
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
