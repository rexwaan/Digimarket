import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import "./ClassRoom.css";
import PanToolIcon from "@mui/icons-material/PanTool";
import MicOffIcon from "@mui/icons-material/MicOff";
import Tooltip from '@mui/material/Tooltip';
import MicIcon from "@mui/icons-material/Mic";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import qs from "qs";
import SettingsIcon from "@mui/icons-material/Settings";
import { Modal } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import MKTypography from "components/MKTypography";
import MKBox from "components/MKBox";
import MessageIcon from "@mui/icons-material/Message";
import MKButton from "components/MKButton";
import classService from "../../../services/class.service";
import MKInput from "components/MKInput";
import Divider from "@mui/material/Divider";
import { toast } from "react-toastify";
import ModeIcon from '@mui/icons-material/Mode';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { BsEraserFill } from "react-icons/bs";
import { BsPencilFill } from "react-icons/bs";
import Switch from "@mui/material/Switch";
import Board from "./Board"
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';

const Seat = ({ setHeight, setWidth, myTrack, hand, handRaised, name, track, mutedVideoByTeacher }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        border: "1px solid black",
      }}

      id={`seat_${track?.ownerEndpointId ? track?.ownerEndpointId : localStorage.getItem("myId")}`}
    >
      {/* {((handRaised?.raisedHand && track?.ownerEndpointId == handRaised.id) ||
        (myTrack && hand)) && (
          <img
            style={{ position: "absolute", right: 0, top: "10px", width: "50px" }}
            src={"https://cdn-icons-png.flaticon.com/512/7127/7127833.png"}
          />
        )} */}
      <p
        style={{
          position: "absolute",
          left: 2,
          color: "blue",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        {name}-{mutedVideoByTeacher}
      </p>
      <video
        height={`${setHeight}`}
        width={`${setWidth}`}
        style={{ flexShrink: 0 }}
        autoPlay="1"
        key={`track_${track.getId()}`}
        ref={(ref) => ref && track.attach(ref)}
        id={`video_${track?.ownerEndpointId ? track?.ownerEndpointId : localStorage.getItem("myId")}`}
      />
      <div
        // height={`${setHeight}`}
        // width={`${setWidth}`}
        style={{ display: "none", flexShrink: 0, background: "black", width: `${setWidth}`, height: `${setHeight}` }}
        id={`mutedVideo_${track?.ownerEndpointId ? track?.ownerEndpointId : localStorage.getItem("myId")}`}
      ></div>
    </div>
  );
};

const Audio = ({ track, index }) => {
  if (track && track.isLocal()) return null;
  return <audio autoPlay="1" ref={(ref) => ref && track.attach(ref)} />;
};

function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getSize, isClient]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

const connect = async ({ domain, room, config }) => {
  const connectionConfig = Object.assign({}, config);
  let serviceUrl = connectionConfig.websocket || connectionConfig.bosh;

  serviceUrl += `?room=${room}`;
  if (serviceUrl.indexOf("//") === 0) {
    serviceUrl = `https:${serviceUrl}`;
  }
  connectionConfig.serviceUrl = connectionConfig.bosh = serviceUrl;
  return new Promise((resolve, reject) => {
    const connection = new JitsiMeetJS.JitsiConnection(null, undefined, connectionConfig);
    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, () =>
      resolve(connection)
    );
    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, reject);
    connection.connect();
  });
};

const join = async ({ connection, room }) => {
  const conference = connection.initJitsiConference(room, {
    p2p: {
      enabled: false,
    }
  });

  return new Promise((resolve) => {
    conference.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, () => resolve(conference));
    conference.join();
  });
};

const connectandJoin = async ({ domain, room, config, data }) => {
  const connection = await connect({ domain, room, config });
  const localTracks = await JitsiMeetJS.createLocalTracks(
    { devices: ["video", "audio"], facingMode: "user" },
    true
  );

  const conference = await join({ connection, room });
  const localTrack = localTracks.find((track) => track.getType() === "video");
  conference.setDisplayName(data?.user?.firstName);
  conference.setLocalParticipantProperty("userRole", data?.role === 1 ? true : false);
  conference.setLocalParticipantProperty("userId", data?.user?.userId);
  conference.addTrack(localTrack);
  const localAudioTrack = localTracks.find((track) => track.getType() === "audio");
  localAudioTrack.mute()
  conference.addTrack(localAudioTrack);

  return { connection, conference, localTrack };
};

const loadAndConnect = ({ domain, room, data }) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.onload = () => {
      JitsiMeetJS.init();

      const configScript = document.createElement("script");
      configScript.src = `https://${domain}/config.js`;
      document.querySelector("head").appendChild(configScript);
      configScript.onload = () => {
        connectandJoin({ domain, room, config, data }).then(resolve);
      };
    };

    script.src = `https://${domain}/libs/lib-jitsi-meet.min.js`;
    document.querySelector("head").appendChild(script);
  });
};

const useTracks = () => {
  const [tracks, setTracks] = useState([]);

  const addTrack = useCallback(
    (track) => {
      setTracks((tracks) => {
        const hasTrack = tracks.find((_track) => track.getId() === _track.getId());

        if (hasTrack) return tracks;

        return [...tracks, track];
      });
    },
    [setTracks]
  );

  const removeTrack = useCallback(
    (track) => {
      setTracks((tracks) => tracks.filter((_track) => track.getId() !== _track.getId()));
      // track.dispose()
    },
    [setTracks]
  );

  return [tracks, addTrack, removeTrack];
};

const getDefaultParamsValue = () => {
  const params =
    document.location.search.length > 1 ? qs.parse(document.location.search.slice(1)) : {};

  return {
    room: params.room ?? "daily_standup1111111",
    domain: params.domain ?? "meet.jit.si",
    autoJoin: params.autojoin ?? false,
  };
};

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
const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const style3 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const style4 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  height: "85%",
  p: 3,
};

function App({ audioUnmutedByTeacher, setAudioUnmutedByTeacher, audioMutedByTeacher, setAudioMutedByTeacher, audioRequestedByTeacher, setAudioRequestedByTeacher, videoMutedByTeacher, setVideoMutedByTeacher, videoRequestedByTeacher, setVideoRequestedByTeacher, openShareRequest, setOpenShareRequest, shareRejectedBy, setShareRejectedBy, setUserDesktopClosed, userDesktopClosed, canvasData, sharedTrack, stillMuteCamera, setStillMuteCamera, stillMuteMic, setStillMuteMic, muteData, data, socket, screenSharing, setScreenSharing, openBoard, changeWhiteBoard, annotate,checkUser }) {
  useWindowSize();
  const defaultParams = useMemo(getDefaultParamsValue, []);
  const [mainState, setMainState] = useState("init");
  const [domain, setDomain] = useState("jitsi.panacealogics.com");
  const [room, setRoom] = useState(data?.className);
  const [conference, setConference] = useState(null);
  const [connection, setConnection] = useState(null);
  const [screenTracks, setScreenTracks] = useState([]);

  const [videoTracks, addVideoTrack, removeVideoTrack] = useTracks();
  const [mutedVideoTracks, addMutedVideoTracks, removeMutedVideoTracks] = useTracks();

  const [audioTracks, addAudioTrack, removeAudioTrack] = useTracks();
  const [mutedAudioTracks, addMutedAudioTracks, removeMutedAudioTracks] = useTracks();
  const [mutedAudioTracksByTeacher, addMutedAudioTracksByTeacher, removeMutedAudioTracksByTeacher] = useTracks();

  const [sharingTracks, addSharingTrack, removeSharingTrack] = useTracks();
  const [participants, setParticipants] = useState([]);
  const [hand, setHand] = useState(false);
  const [muteVideo, setMuteVideo] = useState(false);
  const [muteAudio, setMuteAudio] = useState(true);
  const [screenShared, setScreenShared] = useState(false);
  const [speakerTrack, setSpeakerTrack] = useState();
  const [openSetting, setOpenSetting] = useState(false);
  const [participantSettings, setPartSettings] = useState([]);
  const [openPermissions, setOpenPermissions] = useState(false);
  const [openPermissionsMic, setOpenPermissionsMic] = useState(false)
  const [device, setDevice] = useState();
  const [muteButton, setMuteButton] = useState({});
  const [muteAudioButton, setMuteAudioButton] = useState({});
  const [checkMute, setCheckMute] = useState(0);
  const [typeFeature, setTypeFeature] = useState("");
  const [openMessenger, setOpenMessenger] = useState(false);
  const [message, setMessage] = useState("");
  const [whiteBoard, setWhiteBoard] = useState(false)
  const [color, setColor] = useState("black")
  const [size, setSize] = useState("5")
  const [allMessages, setAllMessages] = useState([]);
  const [openScreenSharing, setOpenScreenSharing] = useState(false);
  const [clearWhiteBoard, setClearWhiteBoard] = useState(true)

  const [screenRequestedUsers, setScreenRequestedUsers] = useState([]);
  const [cameraRequestedUsers, setCameraRequestedUsers] = useState([]);
  const [micRequestedUsers, setMicRequestedUsers] = useState([]);

  const [screenSharingUserId, setScreenSharingUserId] = useState("");
  // const [mutedVideoTracks, setMutedVideoTracks] = useState([]);
  const [mutedVideoTracksByTeacher, setMutedVideoTracksByTeacher] = useState([]);

  // const [mutedAudioTracks, setMutedAudioTracks] = useState([]);
  // const [mutedAudioTracksByTeacher, setMutedAudioTracksByTeacher] = useState([]);

  // const [extraidth,setExtraWidth]=useState()
  const [muteWhiteboard, setMuteWhiteboard] = useState({})

  let addNewArray = [];
  let rightsideUser = [];
  let leftsideUser = [];
  let bottomLeftArray = [];
  let totalWidth = window.innerWidth;
  let totalHeight = window.innerHeight;


  let getWidth = totalWidth - 275;
  let leftWidth = data.role == 1 ? getWidth / 2 + 275 : getWidth / 2;
  let rightWidth = getWidth / 2;
  let leftRightUser = totalHeight - 170 * 2;

  const ctx_ = useRef(null);
  const canvasRef = useRef(null)

  const [raisedHand, setraisedHand] = useState({
    id: "",
    raisedHand: false,
  });
  const handleSize = (e) => {
    // console.log(e.target.value,"size")
    setSize(e.target.value)
  }
  const handleColor = (e) => {
    // console.log(e.target.value,"color")
    setColor(e.target.value)
  }

  useEffect(() => {
    setWhiteBoard(openBoard)
  }, [openBoard])
  const addTrack = useCallback(
    async (track) => {
      setTimeout(() => {
        if (track.getType() === "video" && track?.videoType !== "desktop") addVideoTrack(track);
        if (track.getType() === "video" && track?.videoType === "desktop") addSharingTrack(track);
        if (track.getType() === "audio") {
          addAudioTrack(track);
          addMutedAudioTracks(track)
        }
      }, 2000);
    },
    [addVideoTrack, addAudioTrack, addSharingTrack]
  );

  const removeTrack = useCallback(
    (track) => {
      if (track.getType() === "video" && track?.videoType !== "desktop") removeVideoTrack(track);
      if (track.getType() === "video" && track?.videoType === "desktop") removeSharingTrack(track);
      if (track.getType() === "audio") removeAudioTrack(track);
    },
    [removeAudioTrack, removeVideoTrack, removeSharingTrack]
  );

  useEffect(() => {
    if (videoMutedByTeacher) {
      handleMuteVideo()
      setVideoMutedByTeacher(false)
    }
  }, [videoMutedByTeacher])

  useEffect(() => {
    if (audioMutedByTeacher) {
      if (localStorage.getItem("myId") !== audioMutedByTeacher) {
        addMutedAudioTracksByTeacher(audioTracks.filter((e) => e?.ownerEndpointId === audioMutedByTeacher)[0])
        if (localStorage.getItem("mutedAudio") != null) {
          let arr = [...JSON.parse(localStorage.getItem("mutedAudio"))]
          arr.push(audioMutedByTeacher)

          localStorage.setItem("mutedAudio", JSON.stringify(arr))
        }
        else {
          let arr = [audioMutedByTeacher]
          localStorage.setItem("mutedAudio", JSON.stringify(arr))
        }
      }
      setAudioMutedByTeacher("")
    }
  }, [audioMutedByTeacher])

  useEffect(() => {

    if (audioUnmutedByTeacher) {
      if (localStorage.getItem("myId") !== audioUnmutedByTeacher) {
        removeMutedAudioTracksByTeacher(mutedAudioTracksByTeacher.filter((e) => e?.ownerEndpointId === audioUnmutedByTeacher)[0])
        if (localStorage.getItem("mutedAudio") != null) {
          let arr = [...JSON.parse(localStorage.getItem("mutedAudio"))]
          localStorage.setItem("mutedAudio", JSON.stringify(arr.filter(e => e !== audioUnmutedByTeacher)))
        }
      }
      setAudioUnmutedByTeacher("")
    }
  }, [audioUnmutedByTeacher])

  const connect = useCallback(
    async (e) => {
      e && e.preventDefault();
      setMainState("loading");
      const { connection, conference, localTrack } = await loadAndConnect({ domain, room, data });

      setMainState("started");
      setConnection(connection);
      setConference(conference);
      addTrack(localTrack);
    },
    [addTrack, domain, room]
  );
  const handleWhiteBoardChange = (e, row) => {
    // console.log(row," whiteboard data in params")
    // setWhiteboardOn(e.target.checked)
    let newObj = { ...muteWhiteboard }
    newObj[row.id] = e.target.checked
    socket.emit("allow-annotate", {
      id: row.id,
      room: data?.className,
      status: e.target.checked,
      muteObj: newObj
    })
    setMuteWhiteboard({ ...muteWhiteboard, [row.id]: e.target.checked })
  }
  const handleShowScreenShared = (params) => {
    setScreenSharingUserId(params.id)
    setOpenScreenSharing(true)
  }

  useEffect(() => {
    setScreenRequestedUsers(screenRequestedUsers.filter(e => e !== shareRejectedBy))
    setShareRejectedBy("")
  }, [shareRejectedBy])

  useEffect(() => {
    setCameraRequestedUsers(cameraRequestedUsers.filter(e => e !== stillMuteCamera))
    setStillMuteCamera("")

  }, [stillMuteCamera]);

  useEffect(() => {
    setMicRequestedUsers(micRequestedUsers.filter(e => e !== stillMuteMic))
    setStillMuteMic("")

  }, [stillMuteMic]);


  const handleRequestTeacherForVideo = (params) => {
    setCameraRequestedUsers(prev => [...prev, params.id])
    socket.emit("requestCameraTurnOn", {
      id: conference.getParticipants().filter(e => e._id === params.id)[0]?._properties?.userId,
      room: data?.className
    })
  }

  const handleRequestTeacherForAudio = (params) => {
    setMicRequestedUsers(prev => [...prev, params.id])
    socket.emit("requestMicTurnOn", {
      id: conference.getParticipants().filter(e => e._id === params.id)[0]?._properties?.userId,
      room: data?.className
    })
  }

  const handleMuteVideoByTeacher = (params) => {
    if (!mutedVideoTracksByTeacher.some(e => e === params.id)) {
      setMutedVideoTracksByTeacher(e => [...e, params.id])
      socket.emit("muteVideo", {
        id: conference.getParticipants().filter(e => e._id === params.id)[0]?._properties?.userId,
        room: data?.className
      })
    }
  }

  const handleMuteAudioByTeacher = (params) => {

    if (!mutedAudioTracksByTeacher.some(e => e.ownerEndpointId === params.id)) {
      addMutedAudioTracksByTeacher(audioTracks.filter((e) => e.ownerEndpointId === params.id)[0])

      if (localStorage.getItem("mutedAudio") != null) {
        let arr = [...JSON.parse(localStorage.getItem("mutedAudio"))]
        arr.push(params.id)
        localStorage.setItem("mutedAudio", JSON.stringify(arr))
      }
      else {
        let arr = [params.id]
        localStorage.setItem("mutedAudio", JSON.stringify(arr))
      }
      socket.emit("muteAudio", {
        id: params.id,
        room: data?.className
      })

    }
    else {
      removeMutedAudioTracksByTeacher(mutedAudioTracksByTeacher.filter(e => e.ownerEndpointId === params.id)[0])
      if (localStorage.getItem("mutedAudio") != null) {
        let arr = [...JSON.parse(localStorage.getItem("mutedAudio"))]
        localStorage.setItem("mutedAudio", JSON.stringify(arr.filter(e => e !== params.id)))
      }
      socket.emit("unmuteAudio", {
        id: params.id,
        room: data?.className
      })
    }
  }

  const columns = [
    {
      field: "image",
      headerName: "",
      // flex: 1,
      width: 80,
      // renderCell: (params) => <Avatar alt="Remy Sharp" src={params.row.image} />,
    },

    {
      field: "name",
      headerName: "Name",
      flex: 1,
      width: 200,
    },
    {
      field: "camera",
      headerName: "Camera",
      flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          <MKBox display="flex" justifyContent="center">
            {
              !mutedVideoTracks.some(track => track.ownerEndpointId === params.row.id) ?
                <>
                  <MKButton>
                    <VideocamIcon style={{ height: "35px", width: "35px", color: "green" }} />
                  </MKButton>
                  <Switch
                    checked={!mutedVideoTracksByTeacher.some(e => e === params.row.id)}
                    onClick={() => handleMuteVideoByTeacher(params.row)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </>
                :
                <>
                  <MKButton disabled>
                    <VideocamOffIcon style={{ height: "35px", width: "35px", color: "red" }} />
                  </MKButton>
                  {/* <MKButton onClick={() => }>Please Open</MKButton>  */}
                  {cameraRequestedUsers.some(e => e === params.id) ?
                    <MKButton style={{ color: "green" }}>Requested</MKButton> :
                    <MKButton onClick={() => handleRequestTeacherForVideo(params.row)}>Please Open</MKButton>
                  }

                </>
            }

          </MKBox>
        );
      },
    },

    {
      field: "microphone",
      headerName: "Microphone",
      // type: "number",
      flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          // <MKButton
          //   variant="contained"
          //   color="secondary"
          //   onClick={() => handleSwitchChange(params.row, 1)}
          // >
          //   {muteAudioButton[params.row.id] ? "Request to UnMute" : "Mute"}
          // </MKButton>
          <MKBox display="flex" justifyContent="center">
            {
              !mutedAudioTracks.some(track => track.ownerEndpointId === params.row.id) ?
                <>
                  <MKButton>
                    <MicIcon style={{ height: "35px", width: "35px", color: "green" }} />
                  </MKButton>
                  <Switch
                    checked={!mutedAudioTracksByTeacher.some(e => e.ownerEndpointId === params.row.id)}
                    onClick={() => handleMuteAudioByTeacher(params.row)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </>
                :
                <>
                  <MKButton disabled>
                    <MicOffIcon style={{ height: "35px", width: "35px", color: "red" }} />
                  </MKButton>
                  {/* <MKButton onClick={() => }>Please Open</MKButton>  */}
                  {micRequestedUsers.some(e => e === params.id) ?
                    <MKButton style={{ color: "green" }}>Requested</MKButton> :
                    <MKButton onClick={() => handleRequestTeacherForAudio(params.row)}>Please Open</MKButton>
                  }

                </>
            }

          </MKBox>
        );
      },
    },
    {
      field: "screen",
      headerName: "Screen",
      // type: "number",
      flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          <MKBox display="flex" justifyContent="center">
            {
              sharingTracks.some(track => track.ownerEndpointId === params.row.id) ?
                <>
                  <MKButton onClick={() => handleShowScreenShared(params.row)}>
                    <ScreenShareIcon style={{ height: "35px", width: "35px", color: "green" }} />
                  </MKButton>
                  <Switch
                    checked={sharedTrack?.trackId === params.row.id}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </>
                :
                <>

                  <MKButton disabled>

                    <ScreenShareIcon style={{ height: "35px", width: "35px", color: "red" }} />
                  </MKButton>
                  {screenRequestedUsers.some(e => e === params.id) ?
                    <MKButton style={{ color: "green" }}>Requested</MKButton> :
                    <MKButton onClick={() => handleSharingRequest(params.row)}>Please Open</MKButton>
                  }

                </>
            }

          </MKBox>
        )
      }
    },
    {
      field: "whiteboard",
      headerName: "WhiteBoard",
      // type: "number",
      flex: 1,
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <MKButton>
              {muteWhiteboard[params.row.id] ? <PanToolIcon style={{ height: "22px", width: "22px" }} /> : <DoNotTouchIcon style={{ height: "22px", width: "22px" }} />}
            </MKButton>
            {/* <MKButton
            variant="contained"
            color="secondary"
            onClick={() => handleWhiteBoardChange(params.row)}
          > */}
            <Switch
              checked={muteWhiteboard[params.row.id]}
              onChange={(e) => handleWhiteBoardChange(e, params.row)}
              inputProps={{ "aria-label": "controlled" }}
            />
            {/* {muteWhiteboard[params.row.id] ? "stop" : "start"} */}
            {/* </MKButton> */}
          </>
        );
      },
    },
    // {
    //     field: "all",
    //     headerName: "All",
    //     flex: 1,
    //     width: 100,
    //     renderCell: (params) => {
    //         return (
    //             <MKButton variant="contained" color="secondary">Please Open</MKButton>
    //         )
    //     }
    // },
    // {
    //     field: "action",
    //     headerName: "Action",
    //     // flex: 1,
    //     width: 100,
    //     renderCell: (params) => {
    //         return (
    //             <Switch
    //                 // checked={checked}
    //                 // onChange={handleSwitchChange}
    //                 inputProps={{ "aria-label": "controlled" }}
    //             />
    //         )
    //     }

    // },
  ];

  async function handleScreenShare() {
    if ((!screenShared || screenSharing) && screenTracks.length < 1) {
      try {
        var newScreenshareTrack = await JitsiMeetJS.createLocalTracks({
          devices: ["desktop"],
          desktopSharingSources: ['screen', 'window']
        });
        const screenTrack = newScreenshareTrack;

        setScreenTracks(newScreenshareTrack);
        conference.addTrack(screenTrack[0]);
      } catch (error) {
        data?.role == 0 && stillMuteDevice("screen");
        setScreenSharing(false)
        console.log("error starting screenshare: " + error);
      }
    } else if (screenTracks.length > 0) {
      try {
        setScreenShared(false);
        setScreenSharing(false);
        screenTracks[0].dispose();
        await conference.removeTrack(screenTracks[0]);
        removeTrack(screenTracks[0]);
        setScreenTracks([]);
      } catch (error) {
        setScreenTracks([]);
        console.log("error in stopping screenshare: " + error);
      }
    }
  }

  useEffect(() => {
    if (screenTracks.length > 0) {
      setScreenShared(true);
      toast.success(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKButton variant="contained" color="secondary" onClick={() => handleScreenShare()}>
            Stop Sharing
          </MKButton>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      );
    } else {
      setScreenShared(false);
    }
  }, [screenTracks]);

  const handleSwitchChange = (_data, type) => {
    if (type == 1) {
      socket.emit("mute", {
        track: "audio",
        id: _data.id,
        state: _data?.audio,
        type_: "audio",
        room: data?.className,
      });
      setMuteAudioButton({ ...muteAudioButton, [_data.id]: !_data?.audio });
    } else {
      socket.emit("mute", {
        track: "video",
        id: _data.id,
        state: _data?.camera,
        type_: "video",
        room: data?.className,
      });
      setMuteButton({ ...muteButton, [_data.id]: !_data?.camera });
    }
    setOpenSetting(false);
  };

  const handleSharingRequest = (params) => {


    setScreenRequestedUsers(prev => [...prev, params.id])
    socket.emit("requestShare", {
      id: conference.getParticipants().filter(e => e._id === params.id)[0]?._properties?.userId,
      room: data?.className,
    })
  }


  const screenSharingEvent = async (track) => {
    !track.muted && track.videoType === "desktop" && addTrack(track);
    track.muted && track.videoType === "desktop" && removeTrack(track);
    track.muted && track.videoType === "desktop" && setScreenRequestedUsers(screenRequestedUsers.filter(e => e !== track.ownerEndpointId));
    if (track.muted && track.getType() !== "audio" && track.videoType !== "desktop") {
      addMutedVideoTracks(track);
    }
    if (!track.muted && track.getType() !== "audio" && track.videoType !== "desktop") {
      removeMutedVideoTracks(track);
      setMutedVideoTracksByTeacher(mutedVideoTracksByTeacher.filter(e => e !== track.ownerEndpointId));
      setCameraRequestedUsers(cameraRequestedUsers.filter(e => e !== track.ownerEndpointId))
    }
    track.muted && track.getType() === "audio" && addMutedAudioTracks(track);
    if (!track.muted && track.getType() === "audio") {
      removeMutedAudioTracks(track);
      // setMutedAudioTracksByTeacher(mutedAudioTracksByTeacher.filter(e => e !== track.ownerEndpointId));
      setMicRequestedUsers(micRequestedUsers.filter(e => e !== track.ownerEndpointId))
    }
  };

  const getSpeaker = (data, level) => {
    if (level > 0.25) {
      let tempArr = localStorage.getItem("mutedAudio") ? JSON.parse(localStorage.getItem("mutedAudio")) : []
      !tempArr.includes(data) && setSpeakerTrack(data);
    }
  };

  useEffect(() => {
    if (Object.keys(muteData).length > 0) {
      setCheckMute(muteData.id);
      setTypeFeature(muteData.type_);

      if (conference.myUserId() === muteData.id) {
        if (muteData.state) {
          setDevice(muteData.track);
          muteData.track == "audio" ? setOpenPermissionsMic(true) : setOpenPermissions(true);
        } else {
          muteData.track === "audio" ? handleMuteAudio() : handleMuteVideo();
        }
      }
    }
  }, [muteData]);



  useEffect(() => {
    try {
      let tempArr = [];
      mutedVideoTracks.forEach(element => {
        document.getElementById(`video_${element.ownerEndpointId}`).style.display = 'none';
        document.getElementById(`mutedVideo_${element.ownerEndpointId}`).style.display = 'block';
        tempArr.push(element.ownerEndpointId)
      });
      const unmutedTracks = participants.filter((e) => !tempArr.includes(e._id))
      if (unmutedTracks.length > 0) {

        unmutedTracks.map(ele => {

          document.getElementById(`video_${ele?._id}`).style.display = 'block';
          document.getElementById(`mutedVideo_${ele?._id}`).style.display = 'none';
        })
      }

    } catch (error) {

    }


  }, [mutedVideoTracks])



  useEffect(() => {
    if (!conference) return;

    conference.on(JitsiMeetJS.events.conference.TRACK_ADDED, addTrack);
    conference.on(JitsiMeetJS.events.conference.TRACK_REMOVED, removeTrack);
    conference.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, screenSharingEvent);
    conference.on(JitsiMeetJS.events.conference.USER_JOINED, getParticipants);
    conference.on(JitsiMeetJS.events.conference.PARTICIPANT_PROPERTY_CHANGED, getProperties);
    conference.on(JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED, getSpeaker);
    conference.on(JitsiMeetJS.events.conference.MESSAGE_RECEIVED, getMessages);
    getParticipants();

    return () => {
      conference.off(JitsiMeetJS.events.conference.TRACK_ADDED);
      conference.off(JitsiMeetJS.events.conference.TRACK_REMOVED);
      conference.off(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED);
      conference.off(JitsiMeetJS.events.conference.USER_JOINED);
      conference.off(JitsiMeetJS.events.conference.PARTICIPANT_PROPERTY_CHANGED);
      conference.off(JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED);
      conference.off(JitsiMeetJS.events.conference.MESSAGE_RECEIVED);
    };
  }, [addTrack, conference, removeTrack]);
  useEffect(() => {
    connect();
    localStorage.removeItem("mutedAudio");
  }, []);

  useEffect(() => {
    handleScreenShare();
  }, [screenSharing]);

  const getParticipants = async (data) => {
    // ;
    let value = await conference.getParticipants();
    setParticipants(value);
  };

  const handleMuteVideo = () => {
    !muteVideo ? conference.getLocalVideoTrack().mute() : conference.getLocalVideoTrack().unmute();
    setMuteVideo(!muteVideo);
  };

  const handleMuteAudio = useCallback(() => {
    !muteAudio ? conference.getLocalAudioTrack().mute() : conference.getLocalAudioTrack().unmute();
    setMuteAudio(prev => !prev);
  });

  useEffect(() => {
    try {
      if (hand) {
        var img = document.createElement('img');
        img.src = "https://cdn-icons-png.flaticon.com/512/7127/7127833.png"
        img.id = `handraised_${localStorage.getItem("myId")}`
        img.setAttribute("style", "position:absolute;right: 0; top:10px; width:50px")
        document.getElementById(`seat_${localStorage.getItem("myId")}`).append(img)
      }
      else {
        const ele = document.getElementById(`handraised_${localStorage.getItem("myId")}`);
        ele.remove();
      }
    } catch (error) {
    }
  }, [hand])


  const raiseHand = async () => {

    await conference.setLocalParticipantProperty("raiseHand", !hand);
    setHand(!hand);
  };

  const getProperties = (data) => {
    try {
      if (data._properties?.raiseHand === "true") {
        var img = document.createElement('img');
        img.src = "https://cdn-icons-png.flaticon.com/512/7127/7127833.png"
        img.id = `handraised_${data?._id}`
        img.setAttribute("style", "position:absolute;right: 0; top:10px; width:50px")
        document.getElementById(`seat_${data?._id}`).append(img)
      }
      else {
        const ele = document.getElementById(`handraised_${data?._id}`);
        ele.remove();
      }
    }
    catch (e) {

    }
  };


  // useEffect(() => {
  //   window.addEventListener('popstate', function (event) {
  //     classService.DeleteUserClassStatus(data?.ongoingClassId).then(() => {
  //       socket.emit("ended", {
  //         room: data?.className,
  //         user: data?.user?.userId
  //       })
  //       window.location.replace("/dashboard");
  //     })
  //     alert("You are leaving the class")
  //   })
  // }, [])

  const handleEndCall = async () => {
    videoTracks.map(async (track) => {
      await track.mute();
      track.detach();
      await track.dispose();
      removeTrack(track);
    });
    audioTracks.map(async (track) => {
      await track.mute();
      track.detach();
      await track.dispose();
      removeTrack(track);
    });
    conference.leave();
    connection.disconnect();
    deleteAllCookies();

    socket.emit("ended", {
      room: data?.className,
      user: data?.user?.userId
    })

    localStorage.removeItem("jitsiMeetId");
    localStorage.removeItem("callStatsUserName");

    // data.role === 1
    //   ? classService.UpdateLessonGuid(data?.contentId).then(() => {
    //     window.location.replace("/dashboard");
    //   })
    //   : window.location.replace("/dashboard");
    // classService.DeleteUserClassStatus(data?.ongoingClassId).then(() => {
    //   window.location.replace("/dashboard");
    // })
    setTimeout(() => {
      window.location.replace("/dashboard");
    }, 2000);
    localStorage.removeItem("classHistory");
  };
  useEffect(()=>{
    if(checkUser){
     
      handleEndCall()
    }
      },[checkUser])
  const handleSettings = () => {
    // let a={};
    // ;
    // console.log(conference.getParticipants(),videoTracks);
    let data = conference.getParticipants()?.map((e) => {
      // ;
      let a = {
        id: e._id,
        name: e._displayName,
        Videotrack: videoTracks.filter((x) => x.ownerEndpointId === e._id),
        Audiotrack: audioTracks.filter((x) => x.ownerEndpointId === e._id),
        camera: videoTracks.filter((x) => x.ownerEndpointId === e._id)[0].muted,
        audio: audioTracks.filter((x) => x.ownerEndpointId === e._id)[0].muted,
      }
      // console.log(a," new object")
      setMuteAudioButton({ ...muteAudioButton, [e._id]: a.audio })
      setMuteButton({ ...muteButton, [e._id]: a.camera })
      return a;
    });
    setPartSettings(data);
    setOpenSetting(true);
  };

  function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }

  const unmuteDevice = (device) => {
    device === "audio" ? handleMuteAudio() : handleMuteVideo();
    device === "audio" ? setOpenPermissionsMic(false) : setOpenPermissions(false);
  };

  const sendMessage = () => {
    if (message != "") {
      const data_ = {
        name: data?.user?.firstName,
        message: message,
      };

      conference.sendTextMessage(JSON.stringify(data_));
      setAllMessages((prev) => [...prev, { id: 0, message: message, name: "me" }]);
      setMessage("");
    }
  };

  const getMessages = (id, text) => {
    if (conference.myUserId() !== id) {
      const messageData = JSON.parse(text);
      setAllMessages((prev) => [
        ...prev,
        { id: id, message: messageData?.message, name: messageData?.name },
      ]);
      setOpenMessenger(true);
    }
  };

  const stillMuteDevice = (feature) => {
    // ;
    if (feature != "screen") {
      feature == "mic" ? setOpenPermissionsMic(false) : setOpenPermissions(false);
      socket.emit("stillMuteCamera", {
        id: localStorage.getItem("myId"),
        room: data?.className,
      });
      socket.emit("stillMuteMic", {
        id: localStorage.getItem("myId"),
        room: data?.className,
      });
    }
    else {
      setOpenShareRequest(false)
      socket.emit("requestRejected", {
        id: localStorage.getItem("myId"),
        room: data?.className,
      })
    }
  };
  const handleWhiteboardOpen = () => {
    setWhiteBoard(true)
    socket.emit("open-whiteboard", {
      data: true,
      room: data?.className,
    });
  }


  const shareTrack = (track) => {
    socket.emit("shareTrack", {
      room: data?.className,
      trackId: track?.ownerEndpointId,
      _sourceName: track._sourceName,
    })
  }
  const stopSharingTrack = () => {
    setOpenScreenSharing(false)
    socket.emit("shareTrack", {
      room: data?.className,
      trackId: "",
      _sourceName: "",
    })
  }


  useEffect(() => {
    if (videoRequestedByTeacher) {
      setOpenPermissions(true);
      setVideoRequestedByTeacher(false)
    }
  }, [videoRequestedByTeacher])

  useEffect(() => {
    if (audioRequestedByTeacher) {
      setOpenPermissionsMic(true);
      setAudioRequestedByTeacher(false)
    }
  }, [audioRequestedByTeacher])

  const RenderAudioTracks = () => {

    console.log("muet", mutedAudioTracksByTeacher)

    return (
      audioTracks.map((track, index) => (
        !mutedAudioTracksByTeacher.some(e => e.ownerEndpointId === track?.ownerEndpointId) && (
          <Audio track={track} index={index} key={track.getId()} />
        )
      ))
    )
  }

  const renderVideos = useMemo(() => (
    <React.Fragment>
      <div
        style={{
          position: "fixed",
          bottom: "2px",
          color: "black",
          width: "275px",
          height: "170px"
        }}
      >
        {
          data?.role == 0
            ? videoTracks.map(
              (track, index) =>
                !track.hasOwnProperty("ownerEndpointId") &&
                track?.videoType === "camera" && (
                  <Seat
                    setHeight={"170px"}
                    setWidth={"270px"}
                    hand={hand}
                    handRaised={raisedHand}
                    name={data?.user?.firstName}
                    myTrack={true}
                    track={track}
                    index={index}
                    length={videoTracks.length}
                    key={track.getId()}

                  />
                )
            )
            : videoTracks
              .filter(
                (track) =>
                  track.hasOwnProperty("ownerEndpointId") && track?.videoType === "camera"
              )
              .map((track, index) => {
                <Seat
                  setHeight={"170px"}
                  setWidth={"270px"}
                  myTrack={false}
                  handRaised={raisedHand}
                  name={
                    participants?.filter((e) => e._id === track.ownerEndpointId)[0]?._displayName
                  }
                  track={track}
                  index={index}
                  length={videoTracks.length}
                  hand={hand}
                  key={track.getId()}

                />;
              })}
      </div>
      {mainState === "started" && (
        <div>
          {videoTracks
            .filter(
              (track) =>
                track.hasOwnProperty("ownerEndpointId") &&
                track?.ownerEndpointId !==
                participants?.filter((x) => x._properties.userRole === "true")[0]?._id &&
                track?.videoType === "camera"
            )
            .map((track, index) => {
              if ((leftWidth - bottomLeftArray.length * 270) > 271) {
                bottomLeftArray.push(track);
              }
              else {
                if ((rightWidth - addNewArray.length * 270) > 271) addNewArray.push(track);

                else {
                  if (leftsideUser.length == rightsideUser.length || leftsideUser.length > rightsideUser.length) rightsideUser.push(track);
                  else {
                    leftsideUser.push(track);
                  }
                }

              }
            })}
        </div>
      )}
      <div style={{ width: leftWidth }} className={"otherUser"}>
        {bottomLeftArray?.map((track, index) => (
          <Seat
            myTrack={false}
            handRaised={raisedHand}
            name={participants?.filter((e) => e._id === track.ownerEndpointId)[0]?._displayName}
            setWidth={"270px"}
            setHeight={"auto"}
            track={track}
            index={index}
            length={videoTracks.length}
            key={track.getId()}
          />
        ))}
      </div>
      <div className="teacherFrame">
        {data?.role == 1
          ? videoTracks.map(
            (track, index) =>
              !track.hasOwnProperty("ownerEndpointId") &&
              track?.videoType === "camera" && (
                <Seat
                  setWidth={"280px"}
                  setHeight={"170px"}
                  hand={hand}
                  handRaised={raisedHand}
                  name={data?.user?.firstName}
                  myTrack={true}
                  track={track}
                  index={index}
                  length={videoTracks.length}
                  key={track.getId()}
                />
              )
          )
          : videoTracks.map(
            (track, index) =>
              track?.ownerEndpointId ===
              participants?.filter((x) => x._properties.userRole === "true")[0]?._id &&
              track?.videoType === "camera" && (
                <Seat
                  setHeight={"170px"}
                  setWidth={"280px"}
                  handRaised={raisedHand}
                  name={
                    participants?.filter((e) => e._id === track.ownerEndpointId)[0]
                      ?._displayName
                  }
                  myTrack={true}
                  track={track}
                  index={index}
                  length={videoTracks.length}
                  key={track.getId()}
                />
              )
          )}
      </div>

      <div id="anotherUser" style={{ width: rightWidth }}>
        {addNewArray?.map((track, index) => (
          <Seat
            myTrack={false}
            handRaised={raisedHand}
            name={participants?.filter((e) => e._id === track.ownerEndpointId)[0]?._displayName}
            setWidth={"270px"}
            setHeight={"170px"}
            track={track}
            index={index}
            length={videoTracks.length}
            key={track.getId()}
          />
        ))}
      </div>
      <div className="anothersideUser" style={{ height: leftRightUser }}>
        {leftsideUser?.map((track, index) => (
          <div style={{ marginTop: "2px" }}>
            {" "}
            <Seat
              myTrack={false}
              handRaised={raisedHand}
              name={participants?.filter((e) => e._id === track.ownerEndpointId)[0]?._displayName}
              setWidth={"266px"}
              setHeight={"170px"}
              track={track}
              index={index}
              hand={hand}
              length={videoTracks.length}
              key={track.getId()}
            />{" "}
          </div>
        ))}
      </div>
      <div className="sideUser" style={{ height: leftRightUser }}>
        {" "}
        {rightsideUser?.map((track, index) => (
          <div style={{ marginTop: "2px" }}>
            {" "}
            <Seat
              myTrack={false}
              handRaised={raisedHand}
              name={participants?.filter((e) => e._id === track.ownerEndpointId)[0]?._displayName}
              setWidth={"266px"}
              setHeight={"170px"}
              track={track}
              hand={hand}
              index={index}
              length={videoTracks.length}
              key={track.getId()}
            />{" "}
          </div>
        ))}
      </div>
    </React.Fragment>
  ), [videoTracks,raisedHand,hand])

  const renderMainScreenSharing = useMemo(() => (
    <React.Fragment>
      <div className="mainComponent">
        {
          data?.role === 0 ?
            sharingTracks.map(
              (track, index) =>
                track?.ownerEndpointId ===
                participants?.filter((x) => x._properties.userRole === "true")[0]?._id && (
                  <Seat
                    setHeight="20%"
                    setWidth={"45%"}
                    hand={hand}
                    handRaised={raisedHand}
                    myTrack={true}
                    track={track}
                    index={index}
                    length={sharingTracks.length}
                    key={track.getId()}
                  />
                )
            ) :
            sharingTracks.map(
              (track, index) =>
                !track.hasOwnProperty("ownerEndpointId") &&
                (
                  <Seat
                    setHeight="20%"
                    setWidth={"45%"}
                    hand={hand}
                    handRaised={raisedHand}
                    myTrack={true}
                    track={track}
                    index={index}
                    length={sharingTracks.length}
                    key={track.getId()}
                  />
                )
            )
        }
      </div>
    </React.Fragment>

  ), [sharingTracks])


  const RenderCenter = () => {
    return (
      <React.Fragment>
        <div className="mainComponent">

          {
            sharingTracks.map(
              (track, index) =>
                track?.videoType == "desktop" &&
                  (track?.ownerEndpointId === sharedTrack?.trackId) ? (
                  <Seat
                    setHeight="20%"
                    setWidth={"45%"}
                    hand={hand}
                    handRaised={raisedHand}
                    myTrack={true}
                    track={track}
                    index={index}
                    length={sharingTracks.length}
                    key={track.getId()}
                  />
                )
                  :
                  (track?._sourceName === sharedTrack?._sourceName && !track.hasOwnProperty("ownerEndpointId")) && (
                    (
                      <Seat
                        setHeight="20%"
                        setWidth={"45%"}
                        hand={hand}
                        handRaised={raisedHand}
                        myTrack={true}
                        track={track}
                        index={index}
                        length={sharingTracks.length}
                        key={track.getId()}
                      />
                    )
                  )
            )

          }
        </div>
      </React.Fragment>)
  }


  const renderSpeaker = useMemo(() => (
    <div className="studentFrame">
      {
        videoTracks.map(
          (track, index) =>
            speakerTrack !== undefined &&
            track?.ownerEndpointId === speakerTrack &&
            track?.ownerEndpointId !==
            participants?.filter((x) => x._properties.userRole === "true")[0]?._id && (
              <Seat
                setHeight={"170px"}
                setWidth={"280px"}
                handRaised={raisedHand}
                name={
                  participants?.filter((e) => e._id === track.ownerEndpointId)[0]?._displayName
                }
                myTrack={true}
                track={track}
                index={index}
                length={videoTracks.length}
                key={track.getId()}
              />
            )
        )}
    </div>
  ), [speakerTrack])



  const renderScreenSharing = useMemo(() => (
    <>
      <div style={{ textAlign: "center" }}>
        Shared Screen
      </div>
      <div>
        {sharingTracks.map(
          (track, index) =>
            track.hasOwnProperty("ownerEndpointId") &&
            track?.ownerEndpointId === screenSharingUserId &&
            track?.videoType === "desktop" && (

              // <div style={{ display: "flex", justifyContent: "center"}}>
              <div>
                {/* <div>
                  {participants?.filter((e) => e._id === track.ownerEndpointId)[0]?._displayName}
                </div> */}

                <Seat
                  setWidth={"100%"}
                  setHeight={"400px"}
                  myTrack={true}
                  track={track}
                  index={index}
                  length={videoTracks.length}
                  key={track.getId()}
                />

                <MKButton variant="contained" color="secondary" style={{ marginTop: 5, float: "right" }} onClick={() => shareTrack(track)}>
                  Share
                </MKButton>

              </div>
            )
        )
        }
      </div>

    </>

  ), [sharingTracks, screenSharingUserId])




  useEffect(() => {
    if (conference) {
      localStorage.setItem("myId", conference.myUserId())
    }
  }, [conference])

  // useEffect(()=>{
  //   window.addEventListener("storage", function (e) {
  //    if (e.storageArea["activityLink"] == ""){
  //     socket.emit("screenClosed", {
  //       room: data?.className,
  //       userId : localStorage.getItem("myId") 
  //     })
  //     setScreenSharing(false)
  //    }
  // }, false);
  // },[])

  function clearCanvasData() {
    setClearWhiteBoard(!clearWhiteBoard)
    socket.emit("clear", {
      data: !clearWhiteBoard,
      room: data?.className,

    })
    // clearCanvas();
  }
  const handleWhiteBoard = () => {
    socket.emit("open-whiteboard", {
      data: false,
      room: data?.className,
    });
    setWhiteBoard(false);
    // drawOnCanvas();
  }

  return (
    <div className="App-class">
      <header className="App-header-class">
        {
          renderVideos
        }

        {
          renderMainScreenSharing
        }

        {
          sharedTrack["trackId"] && sharedTrack["trackId"] !== "" &&
          <RenderCenter />
        }
        <div
          style={{
            position: "fixed",
            top: 40,
            left: data?.role === 1 ? "63%" : "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            style={{ color: "black", fontSize: data.role === 1 ? "22px" : "35px", cursor: "pointer", color: "blue" }}
            onClick={() => handleScreenShare()}
          >
            {" "}
            {screenShared ? (
              <ScreenShareIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />
            ) : (
              
              <StopScreenShareIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />
            )}{" "}
          </span>
          <span
            style={{ color: "black", fontSize: data.role === 1 ? "22px" : "35px", cursor: "pointer" }}
            onClick={() => handleMuteVideo()}
          >
            {" "}
            {muteVideo ? (
              <VideocamOffIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />
            ) : (
              <VideocamIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />
            )}{" "}
          </span>
          <span
            style={{ color: "black", fontSize: data.role === 1 ? "22px" : "35px", cursor: "pointer" }}
            onClick={() => handleMuteAudio()}
          >
            {" "}
            {muteAudio ? (
              <MicOffIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />
            ) : (
              <MicIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />
            )}{" "}
          </span>
          {data.role != 1 &&
          <span
            style={{
              color: "black",
              fontSize: data.role === 1 ? "22px" : "35px",
              cursor: "pointer",
              height: "200px",
              width: "200px",
            }}
          >
            {" "}
            <PanToolIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} onClick={() => raiseHand()} />
          </span>
}
          <span
            style={{ color: "gray", fontSize: data.role === 1 ? "22px" : "35px", cursor: "pointer" }}
            onClick={() => setOpenMessenger(true)}
          >
            {" "}
            <MessageIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />{" "}
          </span>

          {data.role === 1 && (
            <>

              <span
                style={{ color: "purple", fontSize: data.role === 1 ? "22px" : "35px", cursor: "pointer" }}
                onClick={handleWhiteboardOpen}
              >
                {" "}
                <ModeIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />{" "}
              </span>
              <span
                style={{ color: "red", fontSize: data.role === 1 ? "22px" : "35px", cursor: "pointer" }}
                onClick={() => handleSettings()}
              >
                {" "}
                <SettingsIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />{" "}
              </span>

            </>
          )}
          <span
            style={{ color: "red", fontSize: data.role === 1 ? "22px" : "35px", cursor: "pointer" }}
            onClick={() => handleEndCall()}
          >
            {" "}
            <RemoveCircleOutlineIcon style={{ height: data.role === 1 ? "22px" : "35px", width: data.role === 1 ? "22px" : "35px" }} />{" "}
          </span>
        </div>
        {
          renderSpeaker
        }
        <RenderAudioTracks />


      </header>



      <Modal
        keepMounted
        open={whiteBoard}
        // onClose={handleAttendenceBoxClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style4}>
          {data?.role === 1 &&
            <MKTypography
              sx={{
                color: "red",
                fontSize: "33px",
                cursor: "pointer",
                width: "50px",
                position: "absolute",
                right: 5,
                top: 0,
              }}
              onClick={handleWhiteBoard}
            >
              <CancelIcon />
            </MKTypography>
          }
          <MKBox sx={{ height: 650, minWidth: "100%", marginTop: 1 }}>
            <div className="container">
              <div className="tools-section" >
                <div style={{ display: "flex" }}>
                  <div className="color-picker-container" style={{ color: "rgb(240, 112, 21)" }}>
                    Select Color: &nbsp;
                    <input type="color" value={color} onChange={(e) => handleColor(e)} />
                  </div>


                  <div className="brushsize-container">
                    Select Brush Size: &nbsp;
                    <select value={size} onChange={(e) => handleSize(e)}>
                      <option>5</option>
                      <option>10</option>
                      <option>15</option>
                      <option>20</option>
                      <option>25</option>
                    </select>
                  </div>
                  <div>
                    <Tooltip title="Pencil">
                      <span
                        style={{ marginLeft: "25px", fontSize: data.role === 1 ? "22px" : "35px", color: "orange", cursor: "pointer" }}
                        onClick={() => { setColor("black"); setSize(5) }}
                      >
                        <BsPencilFill />
                      </span>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Eraser">
                      <span
                        style={{ marginLeft: "25px", fontSize: data.role === 1 ? "22px" : "35px", color: "purple", cursor: "pointer" }}
                        onClick={() => { setColor("white"); setSize(20) }}
                      >
                        <BsEraserFill />
                      </span>
                    </Tooltip>
                  </div>
                  {data.role == 1 &&
                    <div style={{ color: "white" }}>
                      <button style={{ padding: "5px", borderRadius: "15px", backgroundColor: "orange", fontSize: "15px", color: " white", marginLeft: "25px" }} onClick={clearCanvasData}>Clear</button>
                    </div>
                  }
                </div>
              </div>
              <div className="board-container">
                {openBoard && <Board
                  ctx_={ctx_}
                  color={color}
                  size={size}
                  socket={socket}
                  data={data}
                  canvasData={canvasData}
                  canvasRef={canvasRef}
                  changeboard={changeWhiteBoard}
                  annotate={annotate}
                ></Board>
                }
              </div>
            </div>
          </MKBox>
        </MKBox>
      </Modal>

      <Modal
        keepMounted
        open={openSetting}
        // onClose={handleAttendenceBoxClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style}>
          <MKTypography
            sx={{
              color: "red",
              fontSize: "33px",
              cursor: "pointer",
              width: "50px",
              position: "absolute",
              right: 5,
              top: 0,
            }}
            onClick={() => setOpenSetting(false)}
          >
            <CancelIcon />
          </MKTypography>
          {/* <MKBox display="flex" justifyContent="flex-start">
            <MKButton variant="contained" color="info" onClick={() => setOpenScreenSharing(true)}>View Shared Screens</MKButton>
          </MKBox> */}
          <MKBox sx={{ height: 400, minWidth: "100%", marginTop: 3 }}>
            <DataGrid
              rows={participantSettings}
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
        open={openShareRequest}
        // onClose={handleAttendenceBoxClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style2}>
          <MKBox>
            <MKTypography>
              Please Select Yes if you want to share the screen!
            </MKTypography>
          </MKBox>
          <MKBox sx={{ display: "flex", justifyContent: "space-between" }}>
            <MKButton variant="contained" color="secondary" onClick={() => { setScreenSharing(true); setOpenShareRequest(false) }}>
              Yes
            </MKButton>
            <MKButton variant="contained" color="secondary" onClick={() => stillMuteDevice("screen")}>
              No
            </MKButton>
          </MKBox>
        </MKBox>
      </Modal>



      <Modal
        keepMounted
        open={openPermissionsMic}
        // onClose={handleAttendenceBoxClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style2}>
          <MKTypography
            sx={{
              color: "red",
              fontSize: "33px",
              cursor: "pointer",
              width: "50px",
              position: "absolute",
              right: 5,
              top: 0,
            }}
            onClick={() => setOpenPermissionsMic(false)}
          >
            <CancelIcon />
          </MKTypography>
          <MKBox>
            <MKTypography>
              Please Select Yes if you want to turn On the mic

            </MKTypography>
          </MKBox>
          <MKBox sx={{ display: "flex", justifyContent: "space-between" }}>
            <MKButton variant="contained" color="secondary" onClick={() => unmuteDevice("audio")}>
              Yes
            </MKButton>
            <MKButton variant="contained" color="secondary" onClick={() => stillMuteDevice("mic")}>
              No
            </MKButton>
          </MKBox>
        </MKBox>
      </Modal>

      <Modal
        keepMounted
        open={openPermissions}
        // onClose={handleAttendenceBoxClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style2}>
          <MKTypography
            sx={{
              color: "red",
              fontSize: "33px",
              cursor: "pointer",
              width: "50px",
              position: "absolute",
              right: 5,
              top: 0,
            }}
            onClick={() => setOpenPermissions(false)}
          >
            <CancelIcon />
          </MKTypography>
          <MKBox>
            <MKTypography>
              Please Select Yes if you want to turn On the camera

            </MKTypography>
          </MKBox>
          <MKBox sx={{ display: "flex", justifyContent: "space-between" }}>
            <MKButton variant="contained" color="secondary" onClick={() => unmuteDevice("camera")}>
              Yes
            </MKButton>
            <MKButton variant="contained" color="secondary" onClick={() => stillMuteDevice("camera")}>
              No
            </MKButton>
          </MKBox>
        </MKBox>
      </Modal>

      {openScreenSharing && screenSharingUserId !== "" &&
        <Modal
          keepMounted
          open={openScreenSharing}
          // onClose={handleAttendenceBoxClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <MKBox sx={style3}>
            <MKBox style={{ position: "absolute", right: "0px", top: "0px", display: "flex" }}>
              <MKTypography sx={{ color: "red", fontSize: "33px", cursor: "pointer", marginRight: "10px" }} onClick={() => setOpenScreenSharing(false)} >
                <VisibilityOffIcon />
              </MKTypography>
              <MKTypography sx={{ color: "red", fontSize: "33px", cursor: "pointer" }} onClick={() => stopSharingTrack()} >
                <CancelIcon />
              </MKTypography>
            </MKBox>
            <MKBox>
              {
                renderScreenSharing
              }
            </MKBox>
          </MKBox>
        </Modal>
      }



      <Modal
        keepMounted
        open={openMessenger}
        // onClose={handleAttendenceBoxClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style3}>
          <MKTypography
            sx={{
              color: "red",
              fontSize: "33px",
              cursor: "pointer",
              width: "50px",
              position: "absolute",
              right: 5,
              top: 0,
            }}
            onClick={() => setOpenMessenger(false)}
          >
            <CancelIcon />
          </MKTypography>
          <MKBox style={{ height: 400 }}>
            {/* <MKTypography>
                            Please Select Yes if you want to unmute the device!
                        </MKTypography> */}
            <MKBox>
              {allMessages.map((e) => {
                return e.id !== 0 ? (
                  <MKBox>
                    <MKTypography style={{ color: "blue" }}>
                      <strong>{e.name}</strong> : {e.message}
                    </MKTypography>
                  </MKBox>
                ) : (
                  <MKBox display="flex" justifyContent="flex-end">
                    <MKTypography style={{ color: "green" }}>
                      {e.message} : <strong>{e.name}</strong>
                    </MKTypography>
                  </MKBox>
                );
              })}
            </MKBox>
          </MKBox>
          <Divider />
          <Divider />
          <MKBox sx={{ display: "flex" }}>
            <MKInput
              // variant="standard"
              label="Message"
              // InputLabelProps={{ shrink: true }}
              fullWidth
              value={message}
              required
              // error={lastName != "" || !clickCreate ? false : true}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={2}
            />
            <MKButton variant="contained" color="secondary" onClick={sendMessage}>
              Send
            </MKButton>
            {/* <MKButton variant="contained" color="secondary" onClick={() => setOpenPermissions(false)}>No</MKButton> */}
          </MKBox>
        </MKBox>
      </Modal>
    </div>
  );
}

export default App;
