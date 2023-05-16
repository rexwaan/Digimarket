import { TextField } from "@mui/material";
import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Logo from "../../../Navigation/Header";
import { toast, ToastContainer } from "react-toastify";
import MKBox from "components/MKBox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import MKButton from "components/MKButton";
import Grid from "@mui/material/Grid";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormGroup from "@mui/material/FormGroup";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Button, Modal } from "@mui/material";
import Attendance from "../Dashboard/Attendance";
import io from "socket.io-client";
import { PieChart } from "react-minimal-pie-chart";
import Avatar from "@mui/material/Avatar";
import { Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CancelIcon from '@mui/icons-material/Cancel';
import Bucket from "../../../aws";
import usercontentService from "services/usercontent.service";
import Autocomplete from "@mui/material/Autocomplete";
import Switch from "@mui/material/Switch";
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrafficIcon from '@mui/icons-material/Traffic';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import QuizIcon from '@mui/icons-material/Quiz';
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import InputLabel from "@mui/material/InputLabel";
import short from "short-uuid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CustomClass from "./CustomClass";
import address from '../../../env';
import awsService from "../../../services/aws.service"
// import ReactModal from 'react-modal-resizable-draggable';


// import Switch from "@mui/material/Switch";
const extensions = ["jpeg", "jpg", "png", "gif", "mp4", "mpeg", "mkv"]
const domain = "meet.jit.si";
// let api = {};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const styleThumbs = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  height:600,
  overflowY:"auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const styleScratch = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}


const JitsiComponent = (props) => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [attendanceVisible, setAttendenceVisible] = useState(false);
  const [thumbUpDown, setthumbUpDown] = useState(false);
  const [thumbsUp, setthumbsUp] = useState();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [jitsiId, setJitsiId] = useState();
  const [openQuestion, setOpenQuestion] = useState(false);
  const [openCreateQuestion, setOpenCreateQuestion] = useState(false);
  const [studentQuestionsData, setStudentQuestionsData] = useState();
  const [open, setOpen] = useState(false);
  const [openResponse, setOpenResponse] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [result, setResult] = useState([]);
  const [checkThumb, setCheckThumb] = useState(false);

  const [openScratch, setOpenScratch] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openSetting, setOpenSetting] = useState(false)
  const [openMouseOverSetting, setOpenMouseOverSetting] = useState(false)
  const [scratchLink, setScratchLink] = useState("");
  const [scratchStudentSelection, setScratchStudentSelection] = useState(false);
  const [selectedScratchParticipants, setSelectedScratchParticipants] = useState([]);
  const [allUsers, setAllusers] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyData_, setHistoryData_] = useState([]);
  const [muteData, setMuteData] = useState({})
  const [stillMuteData, setStillMuteData] = useState({})
  const [selectedActivity, setSelectedActivity] = useState()
  const [canvasData, setCanvasData] = useState();
  const [participantData, setParticipantData] = useState([]);
  const [createQuestion, setCreateQuestion] = useState(false)
  const [getQuestionId, setGetQuestionId] = useState()
  const [typeShare, setTypeShare] = useState()

  const  [shareRejectedBy, setShareRejectedBy] = useState("")
  const  [openShareRequest, setOpenShareRequest] = useState(false)
  const  [videoMutedByTeacher, setVideoMutedByTeacher] = useState(false)
  const  [audioMutedByTeacher, setAudioMutedByTeacher] = useState("")
  const  [audioUnmutedByTeacher, setAudioUnmutedByTeacher] = useState("")
  const  [checkUserExist,setCheckUserExist]=useState(false)
  const ENDPOINT = address.SOCKET;
  const socket = io(ENDPOINT);


  const columns = [
    {
      field: "image",
      headerName: "",
      width: 80,
    },

    {
      field: "name",
      headerName: "Name",
      flex: 1,
      width: 150,
    },
    {
      field: "camera",
      headerName: "Camera",
      flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          <Switch
            inputProps={{ "aria-label": "controlled" }}
          />
        )
      }
    },

    {
      field: "microphone",
      headerName: "Microphone",
      // type: "number",
      flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          <Switch
            // checked={checked}
            // onChange={handleSwitchChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        )
      }
    },
    {
      field: "screen",
      headerName: "Screen",
      // type: "number",
      flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          <Switch
            // checked={checked}
            // onChange={handleSwitchChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        )
      }
    },
    {
      field: "all",
      headerName: "All",
      flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          <MKButton variant="contained" color="secondary">Please Open</MKButton>
        )
      }
    },
    {
      field: "action",
      headerName: "Action",
      // flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          <Switch
            // checked={checked}
            // onChange={handleSwitchChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        )
      }

    },
  ];
  const rows = [
    { id: 1, name: 'Snow', camera: false, microphone: false, screen: false, all: false, action: false },
    { id: 2, name: 'All student', camera: false, microphone: false, screen: false, all: false, action: false },
  ];
  const columns_ = [
    {
      field: "camera",
      headerName: "Camera",
      flex: 1,
      minWidth: 80,
      // renderCell: (params) => <Avatar alt="Remy Sharp" src={params.row.image} />,
    },

    {
      field: "mic",
      headerName: "Mic",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "screen",
      headerName: "Screen",
      flex: 1,
      minWidth: 80,
      // renderCell: (params) => <Avatar alt="Remy Sharp" src={params.row.image} />,
    },

    {
      field: "all",
      headerName: "All",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 80,
    }
  ]
  const rows_ = [
    { id: 1, camera: 'Jon', mic: 35, screen: 'J', all: "Please Open", action: "On" },
  ];

  const handleCloseCreateQuestion = (event, reason) => {
    setAnswer("")
    setAnswers_([])
    setChecked(false)

    if (reason && reason == "backdropClick") return;
    setOpenCreateQuestion(false);
  };
  const handleCloseQuestion = () => {
    if (reason && reason == "backdropClick") return;
    setOpenQuestion(false);
  };
  const handleResponseClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    socket.emit("closeStatsToAll", {
      room: state?.className,
      data: false
    })
    setOpenResponse(false)
  };
  const handleConfirmClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpenConfirm(false)
  };

  const handleScratchClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setOpenScratch(false)
  };

  const handleActivityClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setActivityOpen(false)
  };

  const handleScratchShare = () => {
    setScreenSharing(true)
  };
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState();
  const [checkedValues, setCheckedValues] = useState([]);
  const [percentageList, setPercentageList] = useState([]);
  const [answers_, setAnswers_] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [savedScratch, setSavedScratch] = useState([]);
  const [savedActivity, setSavedActivity] = useState([]);
  const [questions_, setQuestions_] = useState({});
  const [QuestionsError, setQuestionsError] = useState({});
  const [listt_, setListt_] = useState([])
  const [answerToTeacher, setAnswerToTeacher] = useState(false);

  const [sharedTrack, setSharedTrack] = useState({});

  const [Questionn_, setQuestionn_] = useState([]);
  const [classroomHistory, setClassroomHistory] = useState({});
  const [resources_, setResources_] = useState([]);
  const [activities_, setActivies_] = useState([]);
  const [scratch_, setScratch] = useState([]);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false)
  const [changeClearWhiteBoard, setChangeClearWhiteBoard]=useState()
  const [annotateData,setAnnotateData]=useState({})
  const [videoRequestedByTeacher, setVideoRequestedByTeacher] = useState(false);
  const [audioRequestedByTeacher, setAudioRequestedByTeacher] = useState(false);

  const [userDesktopClosed, setUserDesktopClosed] = useState();

  const [selectedResources, setSelectedResources] = useState();

  const [screenSharing, setScreenSharing] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [stillMuteCamera, setStillMuteCamera] = useState("");
  const [stillMuteMic, setStillMuteMic] = useState("");

  const [answer, setAnswer] = useState();
  const targetRef = useRef();

  const { state } = useLocation();

  const handleCloseThumb = () => {
    setCheckThumb(false);
  };
  const handleThumb = () => {
    setCheckThumb(true);
  };

  const handleThumbsUpDown = () => {
    if (thumbsUp != undefined) {
      setthumbUpDown(false);
    }
  };
  const handleThumbs = (thumb) => {
    socket.emit("sendEvent", {
      id: user?.userId,
      name: user?.firstName + " " + user?.lastName,
      image: user?.image,
      leadTeacherId: state.leadTeacherId,
      thumb: thumb,
      jitsiId: jitsiId,
      room: state?.className
    });
    setthumbUpDown(false);
  };

  const GetImage = (dataa) => {
    return awsService.GetSignedUrl(dataa?.image)
      .then((res) => {
        let _data = {};
        _data = {
          ...dataa,
          image: res.data.result
        };
        // console.log(_data," data  in bucket")
        return _data;
      })
      .catch(function (err) {
        return dataa;
      });
  };
  const handleChange = (event, e, type) => {

    if (type == 1) {
      event.target.checked
        ? setCheckedValues([...checkedValues, e])
        : setCheckedValues(checkedValues.filter((x) => x !== e));
    } else {
      setValue(event.target.value);
    }
  };

  // useEffect(() => {
  //   const handleTabClose = event => {
  //     event.preventDefault();

  //     localStorage.setItem("classEnded", "true");

  //     return (event.returnValue =
  //       'Are you sure you want to exit?');
  //   };

  //   window.addEventListener('unload', handleTabClose);

  //   return () => {
  //     window.removeEventListener('unload', handleTabClose);
  //   };
  // }, []);



  useEffect(() => {
    socket.emit("connected", {
      user: user,
      room: state?.className
    });

    localStorage.setItem("classEnded", "false");
    // socket.on("screenClosed", async (data) =>  {
    //   debugger;
    //   setUserDesktopClosed(data)
    // })

    if (state.role == 1) {
      socket.emit("getUsers", {
        room: state?.className
      })
    }

    socket.on("muteVideo", async () => {
      setVideoMutedByTeacher(true)
    })
   

    socket.on("requestShare", async () => {
      setOpenShareRequest(true)
    })

    socket.on("canvas-data", async (data) => {

      setCanvasData(data)
    })

    socket.on("clear", async (data_)=>{
      setChangeClearWhiteBoard(data_)
    })

    socket.on("shareTrack", async (data) => {
      setSharedTrack(data)
    })
    socket.on("open-whiteboard", async (data) => {
      setWhiteboardOpen(data)
      //  console.log("socket.on in react")
    });
    socket.on("check-user",async (data)=>{
      
      console.log(checkUserExist)
      setCheckUserExist(data)
    })
    if (state.role == 0) {
      socket.on("popToAll", async (data) => {
        data ? setthumbUpDown(true) : setthumbUpDown(false);
      });
      socket.on("mute", async (data) => {
        setMuteData(data)
      })
      socket.on("muteAudio", async (data) => {
        debugger;
        setAudioMutedByTeacher(data?.id)
      })
      socket.on("unmuteAudio", async (data) => {
        setAudioUnmutedByTeacher(data?.id)
      })
      socket.on("allow-annotate",async (data)=>{
        console.log(data,"data in index.js")
        setAnnotateData(data)
      })
      socket.on("requestCameraTurnOn", async (data) => {
        setVideoRequestedByTeacher(true)
      })

      socket.on("requestMicTurnOn", async (data) => {
        setAudioRequestedByTeacher(true)
      })

      socket.on("closeStatsToAll", async (data) => {
        setOpenResponse(false);
        // console.log("socket.on in react")
      });
      socket.on("closeAnswers", async (data) => {
        setOpen(false);
        //  console.log("socket.on in react")
      });
     
      socket.on("ScratchCloseToAll", async (data) => {
        setOpenScratch(false)
        // setScreenSharing(false)
      });

      socket.on("scratchCloseforUser", async (data) => {
        setOpenScratch(false)
        // setScreenSharing(false)
      });

      socket.on("popQuestionsToAll", async (data) => {
        setStudentQuestionsData(data);
        setOpenQuestion(true);
      });
      socket.on("closeQuestionsToAll", async (data) => {
        setCheckedValues([])
        setOpenQuestion(false);
      });
      socket.on("shareAnswers", async (data) => {
        setAnswers_(data.answers_);
        setQuestions_(data.question);
        setStudentAnswers(data.studentAnswers);
        !openQuestion && setOpen(true);
      });
      socket.on("shareStatsToAll", async (data) => {
        setAnswers_(data.answers_);
        setQuestions_(data.question);
        setStudentAnswers(data.studentAnswers);
        !openQuestion && setOpenResponse(true);
      });

      socket.on("scratchReceived", async (data) => {
        setScratchLink(data.link)
        setOpenScratch(true)
      })

      

    } else {

      usercontentService.getContentDetails(state?.contentId).then((resp) => {
        setSavedQuestions(resp?.data?.result?.questions);
        setSavedResources(resp?.data?.result?.resources);
        setSavedScratch(resp?.data?.result?.scratchProjects);
        setSavedActivity(resp?.data?.result?.attachments)
      });

      socket.on("stillMuteCamera", async (data_) => {
        setStillMuteCamera(data_)
      })

      socket.on("stillMuteMic", async (data_) => {
        setStillMuteMic(data_)
      })

      socket.on("connectedUsers", async (data) => {
        setAllusers((prev) => [...prev, data])
      })

      socket.on("getAllUsers", async (data) => {
        setAllusers(data.filter((e) => e))
      })

      socket.on("thumbsReceived", async (data) => {
        let newData = await GetImage(data);
        setParticipantData((prev) => [...prev, newData]);
      });
      socket.on("AnswerReceived", async (data) => {
        setStudentAnswers((prev) => [...prev, data]);
        Questionn_.push(data);
        classroomHistory["questions"] = Questionn_;
        localStorage.setItem("classHistory", JSON.stringify(classroomHistory));
      });

      socket.on("requestRejected", async (data) => {
        setShareRejectedBy(data)
      })
    }

    return () => {
      socket.off("AnswerReceived");
      socket.off("popToAll");
      socket.off("connectedUsers");
      socket.off("popQuestionsToAll");
      socket.off("shareStatsToAll");
      socket.off("thumbsReceived");
      socket.off("closeStatsToAll");
      socket.off("closeQuestionsToAll");
      socket.off("ScratchCloseToAll");
      socket.off("scratchCloseforUser")
      socket.off("stillMute")
      socket.off("mute")
      socket.off("canvas-data")
      socket.off("clear")
      socket.off("allow-annotate")
      socket.off("requestRejected")
      socket.off("requestShare")
      socket.off("open-whiteboard")
      socket.off("check-user")
    };
  }, []);

  useEffect(() => {

    let newArray = [];
    if (questions_.isMultiSelect) {
      studentAnswers.forEach((e) => {
        e.answer.forEach((element) => {

          let data = {
            id: e.id,
            leadTeacherId: e.leadTeacherId,
            name: e.name,
            answer: element,
          };
          newArray.push(data);
        });
      });
    } else {
      newArray = studentAnswers;
    }
    var duplicateCount = {};
    newArray.forEach(
      (e) =>
        (duplicateCount[e.answer] = duplicateCount[e.answer] ? duplicateCount[e.answer] + 1 : 1)
    );
    var _result = Object.keys(duplicateCount).map((e) => {
      return { key: e, count: duplicateCount[e] };
    });
    setResult(_result);
    var _percentageList = [];
    var percentage = {};
    answers_.forEach((e, index) => {
      const randomColor = Math.floor(Math.random() * 16777215).toString(16);
      const percent = _result.filter((x) => x.key === e)[0]?.count
        ? (_result.filter((x) => x.key === e)[0]?.count / newArray.length) * 100
        : 0;
      percentage = {
        title: e + " (" + percent + "%)",
        value: percent,
        color: `#${randomColor}`,
      };
      _percentageList.push(percentage);
    });
    setPercentageList(_percentageList);
  }, [studentAnswers]);


  const handleAttendenceBoxClose = () => {
    setAttendenceVisible(false);
  };

  const handleAttendance = () => {
    setAttendenceVisible(true);
  };

  const handleThumbsUp = (data) => {
    socket.emit("popToAll", {
      data: data,
      room: state?.className
    });
    setCheckThumb(true);
  };
  const handleThumbsClose = (data) => {
    socket.emit("popToAll", {
      data: data,
      room: state?.className
    });
    setCheckThumb(false);
    setParticipantData([])
  };
  const handleAddQuestions = () => {
    setAnswers_([]);
    setQuestions_({});
    setOpenCreateQuestion(true);
  };

  const handleCreateQuestionClose = () => {
    questions_["id"] = short.generate();
    questions_["type"] = "Question";
    let errorQuestion = {};
    if (answers_.length < 2) {
      errorQuestion.Answers = "minimum 2 answers required";
      setQuestionsError(errorQuestion);
    } else {
      setQuestionsError({ ...QuestionsError, qnswers: "" });
    }

    if (questions_["question"] == "" || questions_["question"] == undefined) {
      errorQuestion.Questions = "required";
      setQuestionsError(errorQuestion);
    }

    if (questions_["questionDescription"] == "" || questions_.questionDescription == undefined) {
      errorQuestion.QuestionsDesc = "required";
      setQuestionsError(errorQuestion);
    } else {
      if (questions_["questionDescription"].length > 50) {
        errorQuestion.QuestionsDesc = "characters should be less than 50";
        setQuestionsError(errorQuestion);
      }
    }

    // console.log(questions_,"questions get")
    if (Object.keys(errorQuestion).length == 0) {
      //  QuestionData=questions_
      setCreateQuestion(true)
      Questionn_.push(questions_);
      classroomHistory["questions"] = Questionn_;
      localStorage.setItem("classHistory", JSON.stringify(classroomHistory));
      socket.emit("popQuestionsToAll",
        {
          question: questions_,
          room: state?.className

        });
      setOpenCreateQuestion(false);
      setStudentAnswers([]);
      setPercentageList([]);
      setOpen(true);
      setChecked(false);
    }
  };

  const handleSwitchChange = (e) => {
    // console.log(e.target.checked," switch cahnge")
    setChecked(e.target.checked);
    setQuestions_({ ...questions_, isMultiSelect: !checked });
    // console.log(questions_," question object")
  };

  const handleAnswers = () => {
    if (answer == "" || answer == undefined) {
      setQuestionsError({ ...QuestionsError, Answers: "required" });
    } else {
      setAnswers_([...answers_, answer]);
      setQuestions_({ ...questions_, answers: [...answers_, answer] });
      setAnswer("");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
  };

  const handleStudentQuestions = () => {
    socket.emit("sendAnswer", {
      questionId: studentQuestionsData.id,
      id: user?.userId,
      type: "Answer",
      name: user?.firstName + " " + user?.lastName,
      leadTeacherId: state.leadTeacherId,
      answer: studentQuestionsData?.isMultiSelect ? checkedValues : value,
      room: state?.className
    });
    setCheckedValues([])
    setOpenQuestion(false);
  };

  const handleShareHistoryStats = (historyId) => {
    debugger;
    console.log(historyId)
    let Hist = JSON.parse(localStorage.getItem("classHistory"))
    let questionHistory = Hist.questions.find((ele) => ele.id == historyId && ele.type == "Question");
    let studentAnswers_ = Hist.questions.filter((ele) => ele.questionId == historyId && ele.type == "Answer")
    setStudentAnswers(studentAnswers_);
    setQuestions_(questionHistory)
    setAnswers_(questionHistory.answers);
    socket.emit("shareStatsToAll", {
      studentAnswers: studentAnswers_,
      answers_: questionHistory.answers,
      question: questionHistory,
      room: state?.className
    });
    setOpenResponse(true);
  }

  const handleShareStatistics = () => {
    socket.emit("shareStatsToAll", {
      studentAnswers: studentAnswers,
      answers_: answers_,
      question: questions_,
      room: state?.className
    });
    setOpenResponse(true);
  };
  const handleCloseShareStatistics = () => {
    socket.emit("closeStatsToAll", {
      room: state?.className,
      data: false
    })
  }
  const handleShareParticipantsAnswers = () => {
    if (typeShare == "history") {
      let Hist = JSON.parse(localStorage.getItem("classHistory"))
      let questionHistory = Hist.questions.find((ele) => ele.id == getQuestionId && ele.type == "Question");
      let studentAnswers_ = Hist.questions.filter((ele) => ele.questionId == getQuestionId && ele.type == "Answer")
      setStudentAnswers(studentAnswers_);
      // setQuestions_(questionHistory)
      // setAnswers_(questionHistory.answers);
      socket.emit("shareAnswers", {
        studentAnswers: studentAnswers_,
        answers_: questionHistory.answers,
        question: questionHistory,
        room: state?.className
      });
      setOpenConfirm(false)
      setAnswerToTeacher(true);
    }
    else {
      socket.emit("shareAnswers", {
        studentAnswers: studentAnswers,
        answers_: answers_,
        question: questions_,
        room: state?.className
      });
      setOpenConfirm(false)
      setAnswerToTeacher(true);
    }

  };

  const handleConfirmPopup = (data) => {
    setOpenConfirm(true)
    setTypeShare(data)
  }
  const handleAnswersCancel = () => {
    setCreateQuestion(false)
    socket.emit("closeAnswers", {
      room: state?.className,
      data: false
    })
    setOpen(false);
    setStudentAnswers([]);
    setPercentageList([]);
    socket.emit("closeQuestionsToAll", {
      room: state?.className,
      data: false
    })
  };

  const defaultLabelStyle = {
    fontSize: "5px",
    fontFamily: "sans-serif",
    color: "white",
  };

  const getQuestion = (value) => {
    const dataPost = {
      id: value.id,
      questionDescription: value.name,
      question: value.details,
      answers: value.answers,
      isMultiSelect: value.isMultiSelect,
      type: "Question"
    };
    Questionn_.push(dataPost);
    classroomHistory["questions"] = Questionn_;
    localStorage.setItem("classHistory", JSON.stringify(classroomHistory));
    socket.emit("popQuestionsToAll", {
      question: dataPost,
      room: state?.className,
    });
    setQuestions_(dataPost);
    setCreateQuestion(true)
    setAnswers_(dataPost.answers);
    setStudentAnswers([]);
    setPercentageList([]);
    setOpen(true);
  };

  const getResources = (value) => {
    value["type"] = "resource";
    resources_.push(value);

    classroomHistory["resources"] = resources_;
    localStorage.setItem("classHistory", JSON.stringify(classroomHistory));
    localStorage.setItem("resourceLink", value.details);
    setSelectedResources(value);
    window.open(
      `/resource`,
      "window",
      "toolbar=no, menubar=no, resizable=yes,width=575px,height=200px"
    );
    setScreenSharing(true)
  };

  const getScratch = (value) => {
    value["type"] = "scratch";
    scratch_.push(value);

    classroomHistory["scratch"] = scratch_;
    localStorage.setItem("classHistory", JSON.stringify(classroomHistory));
    let userIds = {};
    let array = allUsers.filter(function (currentObject) {
      if (currentObject.userId in userIds) {
        return false;
      } else {
        userIds[currentObject.userId] = true;
        return true;
      }
    });

    setAllusers(array);
    setScratchLink(value);
    setScratchStudentSelection(true);

    // socket.emit("sendScratchLink", allUsers)
    // setScratchLink(value.details)
    // setOpenScratch(true)
    // api.executeCommand("toggleShareScreen");
  };

  const getActivity = (value) => {
   
    value["type"] = "activity";
    activities_.push(value);
    awsService.GetSignedUrl(value.name)
    .then((res)=>{
      localStorage.setItem("activityLink", res.data.result);
  
  })
    .catch((err)=>{})
    classroomHistory["activities"] = activities_;
    localStorage.setItem("classHistory", JSON.stringify(classroomHistory));
    setSelectedActivity(value);
    // localStorage.setItem("activityLink", Bucket.presignedUrl(value.name));
    localStorage.setItem("type", value.name.split(".").pop().toLowerCase());
    window.open(
      `/activity`,
      "window",
      "toolbar=no, menubar=no, resizable=yes,width=575px,height=200px"
    );

    setScreenSharing(true)
    // api.executeCommand("toggleShareScreen");

    // setActivityOpen(true)

  }


  const getScratchUsers = (value) => {

    if (value.userId == -1) {
      handleScratchOpenAll()
    }
    else if (!selectedScratchParticipants.some((e) => e.userId == value?.userId)) {
      setSelectedScratchParticipants([...selectedScratchParticipants, value])
      socket.emit("sendScratchLink", {
        link: scratchLink,
        user: value,
        room: state?.className,
      })
    }
  }

  const handleScratchStudentSelectionClose = () => {
    setScratchStudentSelection(false)
  }

  const handleScratchOpenAll = () => {
    debugger;
    const data = allUsers.filter((e) => e.userId !== user?.userId).map((x) => {return {name : x.firstName + " " + x.lastName , userId : x.userId }})
    setSelectedScratchParticipants(data)
    socket.emit("sendScratchLinktoAll", {
      link: scratchLink,
      room: state?.className,
    })
  }

  const handleScratchCloseToAll = () => {
    socket.emit("ScratchCloseToAll", {
      room: state?.className,
      data: false
    });
    setScratchStudentSelection(false)
    setSelectedScratchParticipants([])
    setScratchLink("");
  };

  const deleteScratch = (e) => {
    socket.emit("scratchCloseforUser", {
      room: state?.className,
      userId: e.userId
    });
    setSelectedScratchParticipants(selectedScratchParticipants.filter((x) => e.userId != x.userId))
  }

  const emptyData = () => {
    setListt_([])
  }
  const getDat = () => {

    let History_ = JSON.parse(localStorage.getItem("classHistory"));

    let filterData = []
    for (let key_ in History_) {
      let value = History_[key_];
      filterData = value?.filter((el, ind) => {
        return el.type.toLowerCase() == "scratch" || el.type.toLowerCase() == "resource" || el.type.toLowerCase() == "question" || el.type.toLowerCase() == "activity"
      })

      filterData?.map((ele) => listt_.push(ele))
    }
    ;
    setListt_([...new Map(listt_?.map(item => [item["name"] || item["questionDescription"], item])).values()])

  }

  const getResourcesHistory_ = (value) => {
    localStorage.setItem("resourceLink", value.details);
    setSelectedResources(value);
    window.open(
      `/resource`,
      "window",
      "toolbar=no, menubar=no, resizable=yes,width=575px,height=200px"
    );
    setScreenSharing(true)
  };

  const getScratchHistory_ = (value) => {

    let userIds = {};
    let array = allUsers.filter(function (currentObject) {
      if (currentObject.userId in userIds) {
        return false;
      } else {
        userIds[currentObject.userId] = true;
        return true;
      }
    });

    setAllusers(array);
    setScratchLink(value);
    setScratchStudentSelection(true);

  };
  const getActivityHistory_ = (value) => {
    console.log(value,"get acticvity history value")
    setSelectedActivity(value);
    awsService.GetSignedUrl(value.name)
    .then((res)=>{
      localStorage.setItem("activityLink", res.data.result)
  })
    .catch((err)=>{})
    localStorage.setItem("type", value.name.split(".").pop().toLowerCase());
    window.open(
      `/activity`,
      "window",
      "toolbar=no, menubar=no, resizable=yes,width=575px,height=200px"
    );
    setScreenSharing(true)

    // setActivityOpen(true)
  };





  const handleChangeHistory = (e) => {

    e.target.value.type.toLowerCase() == "activity" && getActivityHistory_(e.target.value)
    e.target.value.type.toLowerCase() == "resource" && getResourcesHistory_(e.target.value)
    e.target.value.type.toLowerCase() == "scratch" && getScratchHistory_(e.target.value)

    if (e.target.value.type.toLowerCase() == "question") {
      let Hist = JSON.parse(localStorage.getItem("classHistory"))
      setGetQuestionId(e.target.value.id)
      let dat = Hist.questions.filter((ele) => ele.questionId == e.target.value.id)
      setHistoryData_(dat)
      setHistoryOpen(true)
    }

  }

  const handleTeacherAnswer = () => {
    socket.emit("closeAnswers", {
      room: state?.className,
      data: false
    });
    setAnswerToTeacher(false);
  };

  const handleStudentAnswers = () => {
    if (!createQuestion) {
      toast.error("No question is open right now",
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        })
    }
    else {
      setOpen(true)
    }
  }
  const handleShowScratchParticipants = () => {

    if (!scratchLink) {
      toast.error("No scratch project is open right now", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: false
      })
    } else {

      setScratchStudentSelection(true)
    }
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {/* <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Logo position="sticky" guestUser={false} />
      </AppBar> */}
      <ToastContainer style={{ width: "500px" }} />
      {/* <Button onClick={()=>startMeet(state.role, targetRef.current.offsetWidth, targetRef.current.offsetHeight)}>test</Button> */}
      {state.role == 1 && (
        <MKBox sx={{ position: "absolute", display: "flex" }}>

          <MKBox display="flex">
            <Paper style={{ display: "flex", padding: 20, flexDirection: "column" }}>
              <MKBox style={{ display: "flex", justifyContent: "flex-start", width: "50%" }}>
                <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
                  <Tooltip title="Attendance">
                    <MKTypography sx={{ color: "red", fontSize: "20px", cursor: "pointer", marginRight: "3px" }} onClick={() => handleAttendance()} >
                      <TrafficIcon />
                    </MKTypography>
                  </Tooltip>
                </MKBox>

                {/* <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
                  <Tooltip title="Settings">
                    <MKTypography sx={{ color: "purple", fontSize: "33px", cursor: "pointer", marginRight: "10px" }} onClick={() => setOpenSetting(true)} >
                      <SettingsIcon />
                    </MKTypography>
                  </Tooltip>
                </MKBox> */}

                <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
                  <Tooltip title="Create New Question">
                    <MKTypography sx={{ color: "purple", fontSize: "20px", cursor: "pointer", marginRight: "3px" }} onClick={() => handleAddQuestions()} >
                      <QuestionAnswerIcon />
                    </MKTypography>
                  </Tooltip>
                </MKBox>
                <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
                  <Tooltip title="Show Question Answer Participants ">
                    <MKTypography sx={{ color: "red", fontSize: "20px", cursor: "pointer", marginRight: "3px" }} onClick={handleStudentAnswers} >
                      <QuizIcon />
                    </MKTypography>
                  </Tooltip>
                </MKBox>

                <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
                  <Tooltip title="Show Scratch Participants">
                    <MKTypography sx={{ color: "blue", fontSize: "20px", cursor: "pointer", marginRight: "3px" }} onClick={() => handleShowScratchParticipants()} >
                      <AssignmentIcon />
                    </MKTypography>
                  </Tooltip>
                </MKBox>

                <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
                  <Tooltip title="Start Thumbs Up/Down ">
                    <MKTypography sx={{ marginRight: "3px" }} onClick={() => handleThumbsUp(true)} >
                      <MKBox display="flex" style={{ fontSize: "20px", cursor: "pointer", backgroundColor: "beige" }}>
                        <ThumbUpIcon style={{ marginRight: "5px", color: "green", fontSize: "200px" }} />
                        <ThumbDownIcon style={{ color: "red" }} />
                      </MKBox>
                    </MKTypography>
                  </Tooltip>
                </MKBox>
                <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
                  <Tooltip title="Show Thumbs Up/Down Participants">
                    <MKTypography sx={{ color: "red", fontSize: "20px", cursor: "pointer", marginRight: "3px" }} onClick={() => handleThumb()} >
                      <ThumbUpIcon style={{ marginRight: "5px", color: "green", fontSize: "200px" }} />
                    </MKTypography>
                  </Tooltip>
                </MKBox>
              </MKBox>
              <MKBox style={{ display: "flex" }}>
                <MKBox ml={{ xs: "auto", lg: 3 }} width="100%">
                  <Autocomplete
                    sx={{ minWidth: "calc(100%)", width: 100  }}
                    disableClearable
                    // value={selectedQuestion}
                    onChange={(e, value) => getQuestion(value)}
                    // disabled={selectedDateTime[params.id] == undefined || selectedDateTime[params.id] == ""}
                    autoWidth
                    label="Questions"
                    // isOptionEqualToValue={(option, value) => option.id === value.id}
                    defaultValue=""
                    options={savedQuestions.map((option) => {
                      return {
                        id: option.questionId,
                        name: option.questionDescription,
                        details: option.question,
                        answers: option.answers,
                        isMultiSelect: option.isMultiSelect,
                      };
                    })}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Questions" placeholder="Search" variant="standard" size="small" />
                    )}
                    renderOption={(props, option) => {
                      const { name, details } = option;
                      return (
                        <div
                          {...props}
                          style={{ flexDirection: "column", justifyContent: "flex-start",fontSize: "0.575rem" }}
                        >
                          <strong style={{fontSize: "0.575rem"}}>{name}</strong>
                          {/* <p
                        style={{
                          fontSize: "0.75rem",
                          textAlign: "left",
                          justifyContent: "flex-start",
                          alignSelf: "flex-start",
                        }}
                      >
          
                      </p> */}
                        </div>
                      );
                    }}
                  />
                </MKBox>
                <MKBox ml={{ xs: "auto", lg: 3 }} width="100%">
                  <Autocomplete
                    sx={{ minWidth: "calc(100%)", width: 100  }}
                    value={selectedActivity}
                    disableClearable
                    className="change-size"
                    onChange={(e, value) => getActivity(value)}
                    // disabled={selectedDateTime[params.id] == undefined || selectedDateTime[params.id] == ""}
                    autoWidth
                    label="Activity"
                    // isOptionEqualToValue={(option, value) => option.id === value.id}
                    defaultValue=""
                    options={savedActivity.map((option) => {
                      return { id: option.attachmentId, name: option.attachmentKey };
                    })}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Activities" placeholder="Search"  variant="standard" size="small"/>
                    )}
                    renderOption={(props, option) => {
                      const { name } = option;
                      return (
                        <div {...props} style={{ flexDirection: "column", justifyContent: "flex-start",fontSize: "0.575rem" }}>
                          <strong style={{fontSize: "0.575rem"}}>{name.split("-")[1]}</strong>
                        </div>
                      );
                    }}
                  />
                </MKBox>
                <MKBox ml={{ xs: "auto", lg: 3 }} width="100%">
                  <Autocomplete
                    disableClearable
                    sx={{ minWidth: "calc(100%)", width: 100 }}
                    value={selectedResources}
                    onChange={(e, value) => getResources(value)}
                    // disabled={selectedDateTime[params.id] == undefined || selectedDateTime[params.id] == ""}
                    autoWidth
                    label="Resources"
                    // isOptionEqualToValue={(option, value) => option.id === value.id}
                    defaultValue=""
                    options={savedResources.map((option) => {
                      return { id: option.metaId, name: option.key, details: option.value };
                    })}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Resources" placeholder="Search" variant="standard" size="small" />
                    )}
                    renderOption={(props, option) => {
                      const { name, details } = option;
                      return (
                        <div
                          {...props}
                          style={{ flexDirection: "column", justifyContent: "flex-start",fontSize: "0.575rem" }}
                        >
                          <strong style={{fontSize: "0.575rem"}}>{name}</strong>
                          {/* <p
                        style={{
                          fontSize: "0.75rem",
                          textAlign: "left",
                          justifyContent: "flex-start",
                          alignSelf: "flex-start",
                        }}
                      >
                        {details}
                      </p> */}
                        </div>
                      );
                    }}
                  />
                </MKBox>
                <MKBox ml={{ xs: "auto", lg: 3 }} width="100%">
                  <Autocomplete
                    disableClearable
                    sx={{ minWidth: "calc(100%)", width: 100 }}
                    // value={selectedQuestion}
                    onChange={(e, value) => getScratch(value)}
                    // disabled={selectedDateTime[params.id] == undefined || selectedDateTime[params.id] == ""}
                    autoWidth
                    label="Scratch Project"
                    // isOptionEqualToValue={(option, value) => option.id === value.id}
                    defaultValue=""
                    options={savedScratch.map((option) => {
                      return { id: option.scracthProjectId, name: option.name, details: option.link };
                    })}
                    getOptionLabel={(option) => option.name || ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Scratch" placeholder="Search" variant="standard" size="small" />
                    )}
                    renderOption={(props, option) => {
                      const { name, details } = option;
                      return (
                        <div
                          {...props}
                          style={{ flexDirection: "column", justifyContent: "flex-start",fontSize: "0.575rem" }}
                        >
                          <strong style={{fontSize: "0.575rem !important"}}>{name}</strong>
                          {/* <p
                        style={{
                          fontSize: "0.75rem",
                          textAlign: "left",
                          justifyContent: "flex-start",
                          alignSelf: "flex-start",
                        }}
                      >
                        {details}
                      </p> */}
                        </div>
                      );
                    }}
                  />
                </MKBox>
                {/* history */}

                <MKBox ml={{ xs: "auto", lg: 3 }} width="100%" >
                  <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">History</InputLabel>
                    <Select
                      sx={{ minWidth: "calc(100%)", width: 100 }}
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth_"
                      onOpen={getDat}
                      onClose={emptyData}
                      onChange={(e) => handleChangeHistory(e)}
                      variant="standard" 
                      size="small"
                      // defaultValue={
                      //   staticProps.find(({ key }) => key === ele)?.value || ""
                      // }
                      // value={selectLang}
                      // onBlur={(e) => {
                      //   e.target.value == ""
                      //     ? setErrorProperties({
                      //         ...errorProperties,
                      //         Language: "Required",
                      //       })
                      //     : setErrorProperties({ ...errorProperties, Language: "" });
                      // }}
                      autoWidth
                      required
                      label="History"
                    >
                      {
                        listt_?.map((ele, i) => {
                          return ele.type.toLowerCase() == "question" ? <MenuItem style={{fontSize: "0.575rem"}} key={i} value={ele}>
                            {ele.questionDescription}
                          </MenuItem> : <MenuItem style={{fontSize: "0.575rem"}} key={i} value={ele}>
                            {ele.name}
                          </MenuItem>
                        })
                      }
                    </Select>
                  </FormControl>
                </MKBox>

                {/*end history */}

              </MKBox>


            </Paper>
          </MKBox>
        </MKBox>
      )}

    <CustomClass 
    audioMutedByTeacher = {audioMutedByTeacher} 
    setAudioMutedByTeacher = {setAudioMutedByTeacher} 
    audioUnmutedByTeacher = {audioUnmutedByTeacher} 
    setAudioUnmutedByTeacher = {setAudioUnmutedByTeacher} 
    audioRequestedByTeacher = {audioRequestedByTeacher} 
    setAudioRequestedByTeacher = {setAudioRequestedByTeacher}  
    videoMutedByTeacher = {videoMutedByTeacher} 
    setVideoMutedByTeacher = {setVideoMutedByTeacher} 
    videoRequestedByTeacher = {videoRequestedByTeacher} 
    setVideoRequestedByTeacher = {setVideoRequestedByTeacher} 
    openShareRequest = {openShareRequest} 
    setOpenShareRequest = {setOpenShareRequest} 
    shareRejectedBy = {shareRejectedBy} 
    setShareRejectedBy = {setShareRejectedBy} 
    setUserDesktopClosed={setUserDesktopClosed} 
    userDesktopClosed={userDesktopClosed} 
    canvasData={canvasData}
    sharedTrack={sharedTrack} 
    stillMuteCamera = {stillMuteCamera} 
    setStillMuteCamera = {setStillMuteCamera} 
    stillMuteMic = {stillMuteMic} 
    setStillMuteMic = {setStillMuteMic} 
    muteData={muteData} 
    data={state} 
    socket={socket} 
    screenSharing={screenSharing} 
    setScreenSharing={setScreenSharing} 
    openBoard={whiteboardOpen} 
    changeWhiteBoard={changeClearWhiteBoard}
    annotate={annotateData}
    checkUser={checkUserExist}
    />


      {attendanceVisible && (
        <Modal
          keepMounted
          open={attendanceVisible}
          onClose={handleAttendenceBoxClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <MKBox sx={style}>
            <MKTypography sx={{ color: "red", fontSize: "33px", cursor: "pointer", position: "absolute", right: 5, top: 0 }} onClick={() => setAttendenceVisible(false)} >
              <CancelIcon />
            </MKTypography>
            <Attendance state={state} />
          </MKBox>
        </Modal>
      )}
      {state.role == 0 && (
        <Modal
          keepMounted
          open={thumbUpDown}
          onClose={handleThumbsUpDown}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <MKBox style={{ maxWidth: "500px" }} sx={style} display="flex" justifyContent="center">
            <MKTypography
              style={{ fontSize: "100px", color: "green", cursor: "pointer", marginRight: "50px" }}
              onClick={() => handleThumbs(true)}
            >
              <ThumbUpIcon />
            </MKTypography>
            <MKTypography
              style={{ fontSize: "100px", color: "red", cursor: "pointer" }}
              onClick={() => handleThumbs(false)}
            >
              <ThumbDownIcon />
            </MKTypography>
          </MKBox>
        </Modal>
      )}
      <Modal
        keepMounted
        open={checkThumb}
        // onClose={handleCloseThumb}
        sx={{ zIndex: 2300 }}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        disableScrollLock
      >
       <MKBox style={{ maxWidth: "500px", }} sx={styleThumbs}>
          <MKBox
            sx={{
              color: "green",
              marginBottom: "20px",
            }}
          >
            <MKBox >
              <ThumbUpIcon style={{ marginRight: "5px", fontSize: "200px" }} />
              <ThumbDownIcon />
            </MKBox>
            <MKBox style={{ position: "absolute", right: "0px", top: "0px", display: "flex" }}>
              <MKTypography sx={{ color: "red", fontSize: "33px", cursor: "pointer", marginRight: "10px" }} onClick={() => handleCloseThumb()} >
                <VisibilityOffIcon />
              </MKTypography>
              <MKTypography sx={{ color: "red", fontSize: "33px", cursor: "pointer" }} onClick={() => handleThumbsClose(false)} >
                <CancelIcon />
              </MKTypography>
            </MKBox>
          </MKBox>
          {participantData?.map((ele) => {
            return (
              <Grid display="flex" mt={1}>
                <Avatar src={ele?.image} variant="circle" alt="Avatar" size="lg"></Avatar>
                <MKTypography style={{ marginLeft: "8px", marginRight: "8px" }}>
                  {ele?.name}
                </MKTypography>
                <MKBox style={{ marginTop: "5px" }}>
                  {ele?.thumb ? <ThumbUpIcon /> : <ThumbDownIcon />}
                </MKBox>
              </Grid>
            );
          })}
        </MKBox>
      </Modal>
      <Dialog
        open={openCreateQuestion}
        // onClose={handleCloseCreateQuestion}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        hideBackdrop // Disable the backdrop color/image
        disableEnforceFocus // Let the user focus on elements outside the dialog
        style={{ position: "absolute" }} // This was the key point, reset the position of the dialog, so the user can interact with other elements
        disableBackdropClick
        disableScrollLock // Remove the backdrop click (just to be sure)
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <MKTypography variant="h4">Question</MKTypography>
        </DialogTitle>
        <DialogContent style={{ width: 500 }}>
          <DialogContentText>
            <MKBox sx={{ padding: "20px" }}>
              <Grid item xs={12} md={4}>
                <MKInput
                  sx={{ mt: 2 }}
                  // variant="standard"
                  value={questions_.questionDescription}
                  label="Question Description"
                  // InputLabelProps={{ shrink: true }}
                  fullWidth
                  // value={property.key}
                  onChange={(e) => {
                    setQuestions_({ ...questions_, questionDescription: e.target.value });
                    setQuestionsError({ ...QuestionsError, QuestionsDesc: "" });
                  }}
                />
                {"QuestionsDesc" in QuestionsError ? (
                  <MKTypography
                    fontSize="0.75rem"
                    color="error"
                    style={{ display: "block" }}
                    textGradient
                  >
                    {QuestionsError["QuestionsDesc"]}
                  </MKTypography>
                ) : null}
                <MKInput
                  sx={{ mt: 2 }}
                  // variant="standard"
                  value={questions_.question}
                  label="Question"
                  // InputLabelProps={{ shrink: true }}
                  fullWidth
                  // value={property.key}
                  onChange={(e) => {
                    setQuestions_({ ...questions_, question: e.target.value });
                    setQuestionsError({ ...QuestionsError, Questions: "" });
                  }}
                />
                {"Questions" in QuestionsError ? (
                  <MKTypography
                    fontSize="0.75rem"
                    color="error"
                    style={{ display: "block" }}
                    textGradient
                  >
                    {QuestionsError["Questions"]}
                  </MKTypography>
                ) : null}
                <MKTypography variant="h6" mt={2}>
                  Answers
                </MKTypography>
                {answers_?.map((ele, index) => {
                  return <li>{ele}</li>;
                })}
                {"Answers" in QuestionsError ? (
                  <MKTypography
                    fontSize="0.75rem"
                    color="error"
                    style={{ display: "block" }}
                    textGradient
                  >
                    {QuestionsError["Answers"]}
                  </MKTypography>
                ) : null}
                <MKInput
                  sx={{ mb: 2, mt: 1 }}
                  // variant="standard"
                  // value={property["caption"]}
                  value={answer}
                  label="Enter Answer"
                  // InputLabelProps={{ shrink: true }}
                  fullWidth
                  // value={property.key}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setQuestionsError({ ...QuestionsError, Answers: "" });
                  }}
                />
                <MKButton variant="gradient" color="info" onClick={handleAnswers}>
                  Add answer
                </MKButton>
                <Grid display="flex">
                  <MKTypography sx={{ mt: 1 }} variant="h6" fullWidth>
                    Single Select/Multiple Select
                  </MKTypography>
                  <Switch
                    checked={checked}
                    onChange={handleSwitchChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Grid>
              </Grid>
            </MKBox>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MKButton variant="gradient" color="success" onClick={handleCreateQuestionClose}>
            Submit
          </MKButton>
          <MKButton variant="gradient" color="error" onClick={handleCloseCreateQuestion}>
            Close
          </MKButton>
        </DialogActions>
      </Dialog>
      {openQuestion && studentQuestionsData && (
        <Dialog
          open={openQuestion}
          sx={{
            backgroundColor: `rgba(0, 0, 0, 0)`,
          }}
          onClose={handleCloseQuestion}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            <MKTypography variant="h4"> {studentQuestionsData?.question}</MKTypography>
          </DialogTitle>
          <DialogContent style={{ width: 500 }}>
            <DialogContentText>
              <Grid display="flex">
                {studentQuestionsData?.isMultiSelect ? (
                  <FormGroup>
                    {studentQuestionsData?.answers.map((e, index) => (
                      <FormControlLabel
                        key={index}
                        control={<Checkbox onChange={(event) => handleChange(event, e, 1)} />}
                        label={e}
                      />
                    ))}
                  </FormGroup>
                ) : (
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    // value={value}
                    onChange={handleChange}
                  >
                    {studentQuestionsData?.answers.map((e, index) => (
                      <FormControlLabel key={index} value={e} control={<Radio />} label={e} />
                    ))}
                  </RadioGroup>
                )}
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <MKButton variant="gradient" color="success" onClick={handleStudentQuestions}>
              Submit
            </MKButton>
          </DialogActions>
        </Dialog>
      )}

      {open && (
        <Dialog
          open={open}
          style={{overflowY:"auto",height:"600px"}}
          sx={{
            backgroundColor: `rgba(0, 0, 0, 0)`,
          }}
          onClose={handleClickClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          {/* <MKBox sx={stylee} id="asktoJoin"> */}
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            <MKTypography variant="h4">{questions_?.question}</MKTypography>
            {state.role == 1 && <MKBox style={{ float: "right" }}>
              <IconButton onClick={() => setOpen(false)}>
                <VisibilityOffIcon />
              </IconButton>
            </MKBox>}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Grid display="flex" justifyContent={"space-between"}>
                <Grid items md={5}>
                  {studentAnswers.map((e) => (
                    <Grid display="flex">
                      <Avatar src={""} variant="circle" alt="Avatar" size="lg"></Avatar>
                      <Typography sx={{ marginLeft: 2 }}>{e.name}</Typography>
                      <MKBox sx={{ marginLeft: 2 }}>
                        {Array.isArray(e.answer) ? (
                          e.answer.map((_e) => <Typography>{_e} ,</Typography>)
                        ) : (
                          <Typography>{e.answer}</Typography>
                        )}
                      </MKBox>
                    </Grid>
                  ))}
                </Grid>

                {studentAnswers.length > 0 && (
                  <Grid items md={3} lg={3}>
                    <PieChart
                      data={percentageList}
                      style={{ height: "150px" }}
                      label={({ dataEntry }) => dataEntry.title}
                      labelStyle={{
                        ...defaultLabelStyle,
                      }}
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            {state.role == 1 && (
              <>
                <MKButton variant="gradient" color="success" onClick={handleShareStatistics}>
                  Share Statistics
                </MKButton>
                <MKButton variant="gradient" color="info" onClick={() => handleConfirmPopup("current")}>
                  Share Participants Answers
                </MKButton>
                <MKButton variant="gradient" color="error" onClick={handleAnswersCancel}>
                  Close
                </MKButton>
              </>
            )}

          </DialogActions>

          {/* </MKBox> */}
        </Dialog>
      )}

      {openResponse && (
        <Dialog
          open={openResponse}
          sx={{
            backgroundColor: `rgba(0, 0, 0, 0)`,
          }}
          onClose={handleResponseClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
            <MKTypography variant="h4"> Responses</MKTypography>
          </DialogTitle>
          <DialogContent style={{ width: 500 }}>
            <DialogContentText>
              <Grid display="flex" justifyContent="space-between">
                <Grid>
                  {result.map((e) => (
                    <Grid display="flex">
                      <Typography>
                        Answer :<strong>{e.key}</strong>
                      </Typography>
                      <Typography sx={{ marginLeft: 2 }}>{e.count} participants</Typography>
                    </Grid>
                  ))}
                </Grid>
                <Grid items md={3} lg={3}>
                  {result.length > 0 && (
                    <PieChart
                      data={percentageList}
                      style={{ height: "150px" }}
                      label={({ dataEntry }) => dataEntry.title}
                      labelStyle={{
                        ...defaultLabelStyle,
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </DialogContentText>
            {
              state.role == 1 && <MKButton variant="gradient" color="error" onClick={handleResponseClose}>
                Close
              </MKButton>
            }
          </DialogContent>
        </Dialog>
      )}

      {state.role == 1 && (
        <Modal
          keepMounted
          open={scratchStudentSelection}

          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <MKBox sx={styleScratch}>
            <MKBox style={{ position: "absolute", right: "0px", top: "0px", display: "flex" }}>
              <MKTypography sx={{ color: "red", fontSize: "33px", cursor: "pointer", marginRight: "10px" }} onClick={handleScratchStudentSelectionClose} >
                <VisibilityOffIcon />
              </MKTypography>
              <MKTypography sx={{ color: "red", fontSize: "33px", cursor: "pointer" }} onClick={handleScratchCloseToAll} >
                <CancelIcon />
              </MKTypography>
            </MKBox>
            <MKBox display="flex" justifyContent="center">
              <MKTypography variant="h4">
                Scratch User Selection
              </MKTypography>

            </MKBox>

            <MKBox ml={{ xs: "auto", lg: 2 }} width="100%" sx={{ marginTop: "10px" }}>
              <Autocomplete
                // sx={{ minWidth: "calc(100%)", maxwidth: 150 }}
                // value={selectedQuestion}
                onChange={(e, value) => getScratchUsers(value)}
                // disabled={selectedDateTime[params.id] == undefined || selectedDateTime[params.id] == ""}
                autoWidth
                label="Select Users"
                // isOptionEqualToValue={(option, value) => option.id === value.id}
                defaultValue=""
                options={[...allUsers.filter((e) => e.userId !== user?.userId).map((option) => {
                  return { userId: option.userId, name: option.firstName + " " + option.lastName };
                }), { userId: -1, name: "select All" }]}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Select Users" placeholder="Search" />
                )}
                renderOption={(props, option) => {
                  const { name, userId } = option;
                  return (
                    <div
                      {...props}
                      style={{ flexDirection: "column", justifyContent: "flex-start" }}
                    >
                      {allUsers.length > 1 && userId == -1 ?
                        <strong style={{ color: "blue", textDecoration: "underline" }}>{name}</strong>
                        : userId != -1 ?
                          <strong >{name}</strong> : null
                      }
                    </div>
                  );
                }}
              />
            </MKBox>
            <MKBox>
              <ul>
                {selectedScratchParticipants.map((e, index) => <li key={index}><MKBox> {e?.name} <span onClick={() => deleteScratch(e)}><DeleteIcon /></span> </MKBox></li>)}
              </ul>
            </MKBox>
          </MKBox>
        </Modal>
      )}
      {
        state.role == 0 && (
          <Dialog
            fullWidth={true}
            maxWidth={"xxl"}
            open={openScratch}
            sx={{
              backgroundColor: `rgba(0, 0, 0, 0)`,
            }}
            onClose={handleScratchClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
              <MKTypography variant="h4"> Scratch Project </MKTypography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Grid display="flex" sx={{ justifyContent: "center" }}>
                  <iframe src={`${scratchLink.details}/embed`} allowtransparency="true" width="1280" height="728" frameborder="0" scrolling="no" allowfullscreen></iframe>
                </Grid>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <MKButton variant="gradient" color="success" onClick={handleScratchShare}>
                Share My Screen
              </MKButton>
            </DialogActions>
          </Dialog>
        )
      }

      <Modal
        keepMounted
        open={openSetting}
        // onClose={handleAttendenceBoxClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style}>
          <MKTypography sx={{ color: "red", fontSize: "33px", cursor: "pointer", width: "50px", position: "absolute", right: 5, top: 0 }} onClick={() => setOpenSetting(false)} >
            <CancelIcon />
          </MKTypography>
          <MKBox sx={{ height: 400, minWidth: '100%', marginTop: 3 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </MKBox>
        </MKBox>
      </Modal>

      <Modal
        keepMounted
        open={openMouseOverSetting}
        // onClose={handleAttendenceBoxClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style}>
          <MKBox sx={{ height: 150, minWidth: '100%', marginTop: 3 }}>
            <DataGrid
              rows={rows_}
              columns={columns_}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </MKBox>
        </MKBox>
      </Modal>

      <Dialog
        open={openConfirm}
        sx={{
          backgroundColor: `rgba(0, 0, 0, 0)`,
        }}
        // onClose={handleConfirmClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <MKTypography>Are you sure you want to share? This will allow all participants to see the responses with the names. </MKTypography>
        </DialogTitle>
        <DialogContent style={{ width: 500 }}>
          <Grid display="flex" justifyContent="center">
            <MKButton variant="gradient" color="success" sx={{ marginRight: 5 }} onClick={handleShareParticipantsAnswers}>
              Yes, share
            </MKButton>
            <MKButton variant="gradient" color="error" onClick={() => setOpenConfirm(false)}>
              No, do not share
            </MKButton>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={historyOpen}
        style={{height:"600px", overflowY:"auto"}}
        sx={{
          backgroundColor: `rgba(0, 0, 0, 0)`,
        }}
        // onClose={handleConfirmClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <MKTypography>
            {" "}
          </MKTypography>
        </DialogTitle>
        <DialogContent style={{ width: 500 }}>
          <Grid >
            {
              historyData_?.map((ele, i) => {
                return (
                  <Grid display="flex" >
                    <MKTypography variant="h6" key={i}>{ele?.name}</MKTypography>
                    {
                      Array.isArray(ele.answer) ? ele.answer.map((ele) => {
                        return (
                          <><MKTypography style={{ marginLeft: "50px", marginBottom: "15px" }}>{ele},</MKTypography><br /> {"\n"}</>)
                      }) :
                        <MKTypography style={{ marginLeft: "50px", marginBottom: "15px" }}>{ele.answer}</MKTypography>
                    }


                  </Grid>
                )

              })
            }

          </Grid>

        </DialogContent>

        <DialogActions>
          {state.role == 1 && (
            <>
              <MKButton variant="gradient" color="success" onClick={() => handleShareHistoryStats(getQuestionId)}>
                Share Statistics
              </MKButton>
              <MKButton variant="gradient" color="info" onClick={() => handleConfirmPopup("history")}>
                Share Participants Answers
              </MKButton>
              <MKButton variant="gradient" color="error" onClick={() => setHistoryOpen(false)}>
                Close
              </MKButton>
            </>
          )}

        </DialogActions>
      </Dialog>

      {/* ************************************ */}
      <Dialog
        open={answerToTeacher}
        sx={{
          backgroundColor: `rgba(0, 0, 0, 0)`,
        }}
        // onClose={handleCloseQuestion}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <MKTypography variant="h4"> {studentQuestionsData?.question}</MKTypography>
        </DialogTitle>
        <DialogContent style={{ width: 500 }}>
          <DialogContentText>
            <Grid display="flex">
              <Grid items md={5}>
                {studentAnswers.map((e) => (
                  <Grid display="flex">
                    <Avatar src={""} variant="circle" alt="Avatar" size="lg"></Avatar>
                    <Typography sx={{ marginLeft: 2 }}>{e.name}</Typography>
                    <MKBox sx={{ marginLeft: 2 }}>
                      {Array.isArray(e.answer) ? (
                        e.answer.map((_e) => <Typography>{_e} ,</Typography>)
                      ) : (
                        <Typography>{e.answer}</Typography>
                      )}
                    </MKBox>
                  </Grid>
                ))}
              </Grid>

              {studentAnswers.length > 0 && (
                <Grid items md={3} lg={3}>
                  <PieChart
                    data={percentageList}
                    style={{ height: "150px" }}
                    label={({ dataEntry }) => dataEntry.title}
                    labelStyle={{
                      ...defaultLabelStyle,
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MKButton variant="gradient" color="error" onClick={handleTeacherAnswer}>
            Close
          </MKButton>
        </DialogActions>
      </Dialog>

      {/*  *************************  */}

      {/* ***************************** */}

      {/* <ReactModal
        initWidth={1280}
        initHeight={728}
        // onFocus={() => console.log("Modal is clicked")}
        onRequestClose={handleScratchClose}
        isOpen={openScratch}>
        <MKBox>
        <Grid  display="flex">
        <MKTypography variant="h4"> Scratch Project </MKTypography>
          <MKButton variant="gradient" style = {{float: "right"}} color="success" onClick={handleScratchShare}>
            Share My Screen
          </MKButton>
          </Grid>
          <Grid display="flex" sx={{ justifyContent: "center" }} className = "iframe-container">
            <iframe src={`${scratchLink.details}/embed`} className = "responsive-iframe"></iframe>
          </Grid>
         
        </MKBox>
      </ReactModal> */}

      {/* **************************** */}

    </Box>
  );
};

export default JitsiComponent;
