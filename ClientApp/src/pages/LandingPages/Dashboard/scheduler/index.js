import React, { useEffect, useState, useSyncExternalStore } from "react";
import Toolbar from "@mui/material/Toolbar";
import MKBox from "components/MKBox";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { toast, ToastContainer } from "react-toastify";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import MKButton from "components/MKButton";
import ResetPass from "../../../../components/ResetPass";
import MKAvatar from "components/MKAvatar";
import "./index.css";
import coursetypeService from "../../../../services/coursetype.service";
import usermanagementService from "../../../../services/usermanagement.service";
import locationService from "../../../../services/location.service";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import courseScheduleService from "../../../../services/courseSchedule.service";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import AddLocation from "../../../../components/AddLocation";
import Modal from "@mui/material/Modal";
import Autocomplete from "@mui/material/Autocomplete";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import auth from "../../../../services/auth.service";
import short from "short-uuid";
const drawerWidth = 72;

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
  // overflowWrap:"scrollY"
};

const sorting = (a, b) => {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
};

const Schedular = () => {
  const orgName = localStorage.getItem("orgName")
    ? JSON.parse(localStorage.getItem("orgName"))
    : null;
  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const permissions = localStorage.getItem("permissions")
    ? JSON.parse(localStorage.getItem("permissions"))
    : [];
  const [resetPass, setResetPass] = useState(false);

  const [selectedTeamList, setSelectedTeamList] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({});
  const [selectedParticipantList, setSelectedParticipantList] = useState({});
  const [selectedDateTime, setSelectedDateTime] = useState({});
  const [notification, setNotification] = useState({});
  const [maxPart, setMaxPart] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [participantList, setParticipantList] = useState([]);
  const [description, setDescription] = useState([]);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [ParticipantModal, setParticipantModal] = useState(false);
  const closeDescription = () => setDescriptionModal(false);
  const closeTeam = () => setOpenTeam(false);
  const closeStudent = () => setOpenStudent(false);
  const closeList = () => setParticipantModal(false);
  const [loader_, setLoader_] = useState(true);
  const [members, setMembers] = useState({
    Teacher: 0,
    Participant: [],
    Team: [],
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open_ = Boolean(anchorEl);
  const [open, setOpen] = useState({});
  const handleClose = () => setModalVisible(false);
  const handleClose_ = () => {
    setAnchorEl(null);
    setModalVisible(false)
  };
  const getLocation = (value, params) => {
    // if (e.target.value != -1) {
    if (value?.id != -1) {
      setSelectedLocation({
        ...selectedLocation,
        [params.id]: value,
        // [params.id]: e.target.value,
      });
      setErrors({
        ...errors,
        [params.id]: {
          ...errors[params.id],
          Location: "",
        },
      });
    } else {
      const listIds = LessonRows.map((e) => e.id);
      const id = listIds[params.row.rowId - 1];
      const data = selectedLocation[id];
      setSelectedLocation({
        ...selectedLocation,
        [params.id]: data,
      });
    }
  };
  const getTeacher = (value, params) => {
    if (value?.id != -1) {
      if (
        selectedTeamList[params.id]?.length > 0 ||
        selectedParticipantList[params.id]?.length > 0
      ) {
        if (
          selectedTeamList[params.id]?.some((e) => e.id == value?.id) ||
          selectedParticipantList[params.id]?.some((e) => e.id == value?.id)
        ) {
          setErrors({
            ...errors,
            [params.id]: {
              ...errors[params.id],
              Teacher: "Already selected",
            },
          });
        } else {
          // console.log("  should through error")
          setMembers({ ...members, Teacher: value });
          setSelectedTeacher({
            ...selectedTeacher,
            [params.id]: value,
          });
          setErrors({
            ...errors,
            [params.id]: {
              ...errors[params.id],
              Teacher: "",
            },
          });
        }
      } else {
        setMembers({ ...members, Teacher: value });
        setSelectedTeacher({
          ...selectedTeacher,
          [params.id]: value,
        });
        setErrors({
          ...errors,
          [params.id]: {
            ...errors[params.id],
            Teacher: "",
          },
        });
      }
    } else {
      if (
        selectedTeamList[params.id]?.length > 0 ||
        selectedParticipantList[params.id]?.length > 0
      ) {
        const listIds = LessonRows.map((e) => e.id);
        const id = listIds[params.row.rowId - 1];
        const data = selectedTeacher[id];

        if (selectedTeamList[params.id]?.some((e) => e.id == data?.id)) {
          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                Already Selected in Additional Participants!
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          );
        }
        if (selectedParticipantList[params.id]?.some((e) => e.id == data?.id)) {
          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                Already Selected in Participants!
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          );
        }

        if (
          selectedTeamList[params.id]?.some((e) => e.id == data?.id) ||
          selectedParticipantList[params.id]?.some((e) => e.id == data?.id)
        ) {
          setSelectedTeacher({
            ...selectedTeacher,
            [params.id]: {},
          });
        } else {
          const listIds = LessonRows.map((e) => e.id);
          const id = listIds[params.row.rowId - 1];
          const data = selectedTeacher[id];
          setSelectedTeacher({
            ...selectedTeacher,
            [params.id]: data,
          });
        }
      } else {
        const listIds = LessonRows.map((e) => e.id);
        const id = listIds[params.row.rowId - 1];
        const data = selectedTeacher[id];
        setSelectedTeacher({
          ...selectedTeacher,
          [params.id]: data,
        });
      }
    }
  };
  const getTeams = (value, params) => {
    if (!value.some((e) => e.id == -1)) {
      if (
        selectedTeacher[params.id] != undefined ||
        selectedParticipantList[params.id]?.length > 0
      ) {
        if (
          value.some((e) => e.id == selectedTeacher[params.id]?.id) ||
          selectedParticipantList[params.id]?.some((e) => e.id == value[value.length - 1]?.id)
        ) {
          setErrors({
            ...errors,
            [params.id]: {
              ...errors[params.id],
              Teams: "Already Selected",
            },
          });
        } else {
          setSelectedTeamList({
            ...selectedTeamList,
            [params.id]: value,
          });
          setErrors({
            ...errors,
            [params.id]: {
              ...errors[params.id],
              Teams: "",
            },
          });
        }
      } else {
        setSelectedTeamList({
          ...selectedTeamList,
          [params.id]: value,
        });
      }
    } else {
      if (
        selectedTeacher[params.id] != undefined ||
        selectedParticipantList[params.id]?.length > 0
      ) {
        const listIds = LessonRows.map((e) => e.id);
        const id = listIds[params.row.rowId - 1];
        const data = selectedTeamList[id];
        var difference = [];

        let filterData = data.filter(
          (ele) => !selectedParticipantList[params.id]?.some((e) => e.id == ele.id)
        );

        difference = data.filter((ele) =>
          selectedParticipantList[params.id]?.some((e) => e.id == ele.id)
        );
        if (difference.length > 0) {
          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                {`Already Selected in Participants! Removed:${difference.map(
                  (e) => e.name + " "
                )} from the list`}
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          );
        }

        if (selectedTeacher[params.id]) {
          difference = filterData.filter((e) => e.id == selectedTeacher[params.id]?.id);
          if (difference.length > 0) {
            toast.error(
              <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                <MKTypography variant="contained" color="secondary">
                  {`Already Selected in Lead Teacher! Removed:${difference.map(
                    (e) => e.name + " "
                  )} from the list`}
                </MKTypography>
              </MKBox>,
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
              }
            );
          }
          filterData = filterData.filter((e) => e.id != selectedTeacher[params.id]?.id);
          //  console.log(filterData,"new filterData")
        }
        if (
          data?.some((e) => e.id == selectedTeacher[params.id]?.id) ||
          data?.filter((ele) => selectedParticipantList[params.id]?.some((e) => e.id == ele.id))
            .length > 0
        ) {
          setSelectedTeamList({
            ...selectedTeamList,
            [params.id]: filterData,
          });
        } else {
          const listIds = LessonRows.map((e) => e.id);
          const id = listIds[params.row.rowId - 1];
          const data = selectedTeamList[id];
          setSelectedTeamList({
            ...selectedTeamList,
            [params.id]: data,
          });
        }
      } else {
        const listIds = LessonRows.map((e) => e.id);
        const id = listIds[params.row.rowId - 1];
        const data = selectedTeamList[id];
        setSelectedTeamList({
          ...selectedTeamList,
          [params.id]: data,
        });
      }
    }
  };
  const getParticipants = (value, params) => {
    if (!value.some((e) => e.id == -1)) {
      if (selectedTeacher[params.id] != undefined || selectedTeamList[params.id]?.length > 0) {
        if (
          value.some((e) => e.id == selectedTeacher[params.id]?.id) ||
          selectedTeamList[params.id]?.some((e) => e.id == value[value.length - 1]?.id)
        ) {
          setErrors({
            ...errors,
            [params.id]: {
              ...errors[params.id],
              Participants: "Already Selected",
            },
          });
        } else if (value.length > parseInt(maxPart[params.id])) {
          setErrors({
            ...errors,
            [params.id]: {
              ...errors[params.id],
              Participants: "Max Participant reached",
            },
          });
        } else {
          // console.log(maxPart, "check max participant");

          setMembers({ ...members, Participant: value });
          setSelectedParticipantList({
            ...selectedParticipantList,
            [params.id]: value,
          });
          setErrors({
            ...errors,
            [params.id]: {
              ...errors[params.id],
              Participants: "",
            },
          });
        }
      } else if (value.length > parseInt(maxPart[params.id])) {
        // console.log(maxPart[params.id], " in error block max count");
        setErrors({
          ...errors,
          [params.id]: {
            ...errors[params.id],
            Participants: "Max Participant reached",
          },
        });
      } else {
        setSelectedParticipantList({
          ...selectedParticipantList,
          [params.id]: value,
        });
        setErrors({
          ...errors,
          [params.id]: {
            ...errors[params.id],
            Participants: "",
          },
        });
      }
    } else {
      if (selectedTeacher[params.id] != undefined || selectedTeamList[params.id]?.length > 0) {
        const listIds = LessonRows.map((e) => e.id);
        const id = listIds[params.row.rowId - 1];
        const data = selectedParticipantList[id].slice();
        var difference = [];

        let filterData = data.filter(
          (ele) => !selectedTeamList[params.id]?.some((e) => e.id == ele.id)
        );

        difference = data.filter((ele) => selectedTeamList[params.id]?.some((e) => e.id == ele.id));
        if (difference.length > 0) {
          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                {`Already Selected in Additional Participants! Removed:${difference.map(
                  (e) => e.name + " "
                )} from the list`}
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          );
        }
        if (selectedTeacher[params.id]) {
          difference = filterData.filter((e) => e.id == selectedTeacher[params.id]?.id);
          if (difference.length > 0) {
            toast.error(
              <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                <MKTypography variant="contained" color="secondary">
                  {`Already Selected in Lead Teacher! Removed:${difference.map(
                    (e) => e.name + " "
                  )} from the list`}
                </MKTypography>
              </MKBox>,
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
              }
            );
          }
          filterData = filterData.filter((e) => e.id != selectedTeacher[params.id]?.id);
        }
        if (
          data?.some((e) => e.id == selectedTeacher[params.id]?.id) ||
          data?.filter((ele) => selectedTeamList[params.id]?.some((e) => e.id == ele.id)).length > 0
        ) {
          if (maxPart[params.id] < filterData.length) {
            var splicedData = filterData.splice(maxPart[params.id] - filterData.length);

            toast.error(
              <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                <MKTypography variant="contained" color="secondary">
                  {`Max Number Reached! Removed:${splicedData.map(
                    (e) => e.name + " "
                  )} from the list`}
                </MKTypography>
              </MKBox>,
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
              }
            );
          }

          setSelectedParticipantList({
            ...selectedParticipantList,
            [params.id]: filterData,
          });
        } else {
          const listIds = LessonRows.map((e) => e.id);
          const id = listIds[params.row.rowId - 1];
          let data = selectedParticipantList[id].slice();

          if (maxPart[params.id] < data.length) {
            var splicedData = data.splice(maxPart[params.id] - data.length);

            toast.error(
              <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                <MKTypography variant="contained" color="secondary">
                  {`Max Number Reached! Removed:${splicedData.map(
                    (e) => e.name + " "
                  )} from the list`}
                </MKTypography>
              </MKBox>,
              {
                position: toast.POSITION.TOP_CENTER,
                autoClose: false,
              }
            );
          }

          setSelectedParticipantList({
            ...selectedParticipantList,
            [params.id]: data,
          });
        }
      } else {
        const listIds = LessonRows.map((e) => e.id);
        const id = listIds[params.row.rowId - 1];
        let data = selectedParticipantList[id].slice();

        if (maxPart[params.id] < data.length) {
          var splicedData = data.splice(maxPart[params.id] - data.length);

          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                {`Max Number Reached! Removed:${splicedData.map(
                  (e) => e.name + " "
                )} from the list`}
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          );
        }

        setSelectedParticipantList({
          ...selectedParticipantList,
          [params.id]: data,
        });
      }
      // const listIds = LessonRows.map((e) => e.id);
      // const id = listIds[params.row.rowId - 1];
      // const data = selectedParticipantList[id];
      // setSelectedParticipantList({
      //   ...selectedParticipantList,
      //   [params.id]: data,
      // });
    }
  };
  const getNotification = (e, params) => {
    if (e.target.value < 1 && e.target.value != "") {
      setNotification({
        ...notification,
        [params.id]: 1,
      });
    } else {
      setNotification({
        ...notification,
        [params.id]: e.target.value,
      });
    }
    setErrors({
      ...errors,
      [params.id]: {
        ...errors[params.id],
        notification: "",
      },
    });
  };
  const getMaxParticipants = (e, params) => {
    if (selectedParticipantList[params.id] && selectedParticipantList[params.id]?.length > 0) {
      if (e.target.value < selectedParticipantList[params.id].length && e.target.value != "") {
        setMaxPart({
          ...maxPart,
          [params.id]: selectedParticipantList[params.id].length,
        });
      } else {
        setMaxPart({
          ...maxPart,
          [params.id]: e.target.value,
        });
      }
    } else {
      if (e.target.value < 1 && e.target.value != "") {
        setMaxPart({
          ...maxPart,
          [params.id]: 1,
        });
      } else {
        setMaxPart({
          ...maxPart,
          [params.id]: e.target.value,
        });
      }
    }
    setErrors({
      ...errors,
      [params.id]: {
        ...errors[params.id],
        MaxParticipants: "",
      },
    });
  };
  const getDateTime = (val, params) => {
    setSelectedDateTime({
      // ...selectedDateTime, [params.id]: val?.utc()?.format('llll')
      ...selectedDateTime,
      [params.id]: val?.utc(),
    });
    setErrors({
      ...errors,
      [params.id]: {
        ...errors[params.id],
        DateTime: "",
      },
    });
  };
  const handlePartcipants = (list) => {
    setModalVisible(true);
    setParticipantList(list);
  };

  const handleDescriptionData = (id) => {
    // console.log(id, "organization id")
    // console.log(locations, " locations")
    let data = locations.filter((ele) => ele.courseLocationId == id);
    setDescription(data);
    setDescriptionModal(true);
  };
  const Pop = props => {
    const { className, anchorEl, style, ...rest } = props
    const bound = anchorEl.getBoundingClientRect()
    return <div {...rest} style={{
      position: 'absolute',
      zIndex: 9,
      width: bound.width,
      height:"0px",
      boxShadow:" 0 0 3px #ccc",
      backgroundColor:"rgb(226,223,223)"
    }} />
  }
  const columns = [
    // { field: 'id', headerName: 'ID', flex: 1 },

    {
      field: "name",
      headerName: "Lessons",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "duration",
      headerName: "Lesson Duration in minutes",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "age",
      headerName: "Age",
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
      field: "maintopic",
      headerName: "Main Topic",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "date",
      headerName: "Date & Start Time",
      flex: 1,
      minWidth: 350,
      renderCell: (params) => {
        return params.row.courseScheduleId == 0 ? (
          <MKBox>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                renderInput={(props) => (
                  <TextField
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => setOpen({ ...open, [params.id]: true })}
                    {...props}
                  />
                )}
                label="DateTimePicker"
                open={open[params.id] == undefined ? false : open[params.id]}
                onOpen={() => setOpen({ ...open, [params.id]: true })}
                onClose={() => setOpen({ ...open, [params.id]: false })}
                value={selectedDateTime[params.id] ?? new Date()}
                onChange={(newValue) => {
                  getDateTime(newValue, params);
                }}
              />
            </LocalizationProvider>
            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors[params.id]?.DateTime}
            </MKTypography>
          </MKBox>
        ) : (
          <span>{moment(params.row.dateTime).format("LLLL")}</span>
        );
      },
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        return params.row.courseScheduleId == 0 ? (
          <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
            <Autocomplete
              // sx={{ minWidth: "calc(100%)", maxWidth: 200 }}
              value={selectedLocation[params.id] ?? null}
              onChange={(e, value) => getLocation(value, params)}
              // disabled={selectedDateTime[params.id] == undefined || selectedDateTime[params.id] == ""}
              autoWidth
              label="Location"
              isOptionEqualToValue={(option, value) => option.id === value.id}
              defaultValue=""
              options={
                locations.length > 0
                  ? [
                      ...locations
                        .map((option) => {
                          return {
                            id: option.courseLocationId,
                            name: option.location,
                            details: option.details,
                          };
                        })
                        .sort((a, b) => sorting(a, b)),
                      { id: -1, name: "Copy from Above" },
                      { id: -2, name: "Add Location" },
                    ]
                  : [{ id: -2, name: "Add Location" }]
              }
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Location *" placeholder="Search" />
              )}
              renderOption={(props, option) => {
                const { name, id, details } = option;
                return (
                  <>
                    {id == -2 && (
                      <span
                        {...props}
                        style={{ color: "blue", textDecoration: "underline" }}
                        onClick={addLocation}
                      >
                        {name}
                      </span>
                    )}

                    {LessonRows.length > 1 && params.row.rowId != 0 && id == -1 ? (
                      <span {...props} style={{ color: "blue", textDecoration: "underline" }}>
                        {name}
                      </span>
                    ) : id != -1 ? (
                      <div
                        {...props}
                        style={{ flexDirection: "column", justifyContent: "flex-start" }}
                      >
                        <p
                          style={{
                            fontSize: "0.75rem",
                            textAlign: "left",
                            justifyContent: "flex-start",
                            alignSelf: "flex-start",
                          }}
                        >
                          {details}
                        </p>
                        {id !== -2 && <strong>Address: {name}</strong>}
                      </div>
                    ) : null}
                  </>
                );
              }}
              // <MenuItem value="">None</MenuItem>
              // {locations.map(ele => <MenuItem value={ele.courseLocationId}>{ele.location}</MenuItem>)}
              // {LessonRows.length > 1 ? (params.row.rowId != 0 ? <MenuItem value={-1} style={{ textDecoration: "underline", color: "blue" }}>Copy from above</MenuItem> : null) : null}
            />

            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors[params.id]?.Location}
            </MKTypography>
          </MKBox>
        ) : (
          <span onClick={() => handleDescriptionData(params.row.location.id)}>
            {params.row.location?.name}
          </span>
        );
      },
    },
    {
      field: "leadTeacher",
      headerName: "Lead Teacher",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        // console.log("parassmms lesson ",params)
        return params.row.courseScheduleId == 0 ? (
          <MKBox ml={{ xs: "auto", lg: 2 }} width="100%">
            <Autocomplete
              value={selectedTeacher[params.id] ?? null}
              // disabled={selectedDateTime[params.id] == undefined || selectedDateTime[params.id] == ""}
              onChange={(e, value) => getTeacher(value, params)}
              autoWidth
              required
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Lead Teacher"
              options={
                teachers[params.row.id]?.length > 0
                  ? [
                      ...teachers[params?.row?.id]
                        ?.map((option) => {
                          return {
                            id: option.userId,
                            name: option.firstname + " " + option.lastname,
                          };
                        })
                        .sort((a, b) => sorting(a, b)),
                      { id: -1, name: "Copy from Above" },
                    ]
                  : []
              }
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Lead Teacher *" placeholder="Search" />
              )}
              renderOption={(props, option) => {
                const { name, id } = option;
                return LessonRows.length > 1 && params.row.rowId != 0 && id == -1 ? (
                  <span {...props} style={{ color: "blue", textDecoration: "underline" }}>
                    {name}
                  </span>
                ) : id != -1 ? (
                  <span {...props}>{name}</span>
                ) : null;
              }}
            />

            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors[params.id]?.Teacher}
            </MKTypography>
          </MKBox>
        ) : (
          <span>{params.row.teacher?.name}</span>
        );
      },
    },
    {
      field: "team",
      headerName: "Participants-Additional",
      flex: 1,
      minWidth: 350,
      renderCell: (params) => {
        return params.row.courseScheduleId == 0 ? (
          <MKBox ml={{ xs: "auto", lg: 2 }} width="100%" style={{zIndex:2}}>
            {/* <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 200 }}>
                                <InputLabel id="demo-simple-select-autowidth-label">Additional Team</InputLabel> */}
            <Autocomplete
              multiple
              id="multiple-limit-tags"
              limitTags={1}
              onChange={(e, value) => getTeams(value, params)}
              autoWidth
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Additional Participants"
              value={Array.isArray(selectedTeamList[params.id]) ? selectedTeamList[params.id] : []}
              disableCloseOnSelect
              options={
                team.length > 0
                  ? [
                      ...team
                        .map((option) => {
                          return {
                            id: option.userId,
                            name: option.firstname + " " + option.lastname,
                          };
                        })
                        .sort((a, b) => sorting(a, b)),
                      { id: -1, name: "Copy from Above" },
                      // { id: -2, name: "Add Additional Participants" },
                    ]
                  : [
                    // { id: -2, name: "Add Additional Participants" }
                  ]
              }
              getOptionLabel={(option) => option.name || ""}
              noOptionsText=""
              sx={{ maxHeight:"80px", overflow: 'auto'}}
              PopperComponent={Pop}
              renderInput={(params) => (
                <TextField {...params} label="Participants" placeholder="Search" />
              )}
              // renderTags={() => null}
              renderOption={(props, option) => {
                const { name, id } = option;
                return (
                  <>
                    {/* {id == -2 && (
                      <span
                        {...props}
                        style={{ color: "blue", textDecoration: "underline" }}
                        onClick={() => addParticipantsList("team")}
                      >
                        {name}
                      </span>
                    )} */}

                    {LessonRows.length > 1 && params.row.rowId != 0 && id == -1 ? (
                      <span {...props} style={{ color: "blue", textDecoration: "underline" }}>
                        {name}
                      </span>
                    ) : id != -1 ? (
                      id !== -2 && <span {...props}>{name}</span>
                    ) : null}
                  </>
                );
              }}
              // {team.map(ele => <MenuItem value={ele.userId}>{ele.firstname} {ele.lastname}</MenuItem>)}
              // {LessonRows.length > 1 ? (params.row.rowId != 0 ? <MenuItem value={-1} style={{ textDecoration: "underline", color: "blue" }}>Copy from above</MenuItem> : null) : null}
            />
            {/* </FormControl> */}
            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors[params.id]?.Teams}
            </MKTypography>
          </MKBox>
        ) : (
          <span id="team" onClick={() => handlePartcipants(params.row.team)}>
            {params.row.team.length > 2
              ? params.row.team
                  .slice(0, 2)
                  .map((x, index) => (
                    <span key={index}>{params.row.team.length > 1 ? x.name + "," : x.name}</span>
                  ))
              : params.row.team.map((x, index) => (
                  <span key={index}>{params.row.team.length > 1 ? x.name + "," : x.name}</span>
                ))}
            {params.row.team.length > 2 ? "..." : null}
          </span>
        );
      },
    },
    {
      field: "maxpart",
      headerName: "Max Participants",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        return params.row.courseScheduleId == 0 ? (
          <MKBox>
            <MKInput
              label="Max Participants"
              fullWidth
              type="number"
              InputProps={
                members.Participant.length > 0
                  ? { inputProps: { min: members.Participant.length, autoComplete: "nope" } }
                  : { inputProps: { min: 1, autoComplete: "nope" } }
              }
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()
              }
              required
              InputLabelProps={{ shrink: true }}
              value={maxPart[params.id]}
              onChange={(e) => getMaxParticipants(e, params)}
            />
            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors[params.id]?.MaxParticipants}
            </MKTypography>
          </MKBox>
        ) : (
          <span>{params.row.maxParticipantsCount}</span>
        );
      },
    },
    {
      field: "participants",
      headerName: "Participants-Students",
      flex: 1,
      minWidth: 350,
      renderCell: (params) => {
        return params.row.courseScheduleId == 0 ? (
          <MKBox ml={{ xs: "auto", lg: 2 }}   width="100%" sx={{zIndex:1}}>
            <Autocomplete
              multiple
              limitTags={1}
              disabled={maxPart[params.id] == undefined || maxPart[params.id] == 0}
              onChange={(e, value) => getParticipants(value, params)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText=""
              sx={{ maxHeight:"80px", overflow: 'auto'}}
              PopperComponent={Pop}
          
              // disablePortal={true}
              //  sx={{ maxHeight: "100px"}}
              // noOptionsText="hello"
              // ListboxProps={
              //   {
              //     style:{
              //         position:"absolute",
              //         border: '1px solid red'
              //     }
              //   }
              // }
              autoWidth
            //  ListboxProps={{bg:"green"}}
              disableCloseOnSelect
              filterSelectedOptions
             
              label="Participants"
              value={
                Array.isArray(selectedParticipantList[params.id])
                  ? selectedParticipantList[params.id]
                  : []
              }
              //participants
              options={
                participants.length > 0
                  ? [
                      ...participants
                        .map((option) => {
                          return {
                            id: option.userId,
                            name: option.firstname + " " + option.lastname,
                          };
                        })
                        .sort((a, b) => sorting(a, b)),
                      { id: -1, name: "Copy from Above" },
                      // { id: -2, name: "Add Students" },
                    ]
                  : [
                    // {id:-3, name:"No Options"}
                    // { id: -2, name: "Add Students" }
                  ]
              }//size="lg"   style={{overflowY:"auto",maxHeight:100}}
              // getOptionDisabled={() => {
              //   if (options.some((day) => day.name == "No Options")) {
              //     return true;
              //   }
              //   return false;
              // }}
              getOptionLabel={(option) => option.name || ""}
              // listStyle={{ maxHeight: 200, overflowY: 'auto' }}
              renderInput={(params) => (
                <TextField {...params}   label="Participants *" placeholder="Search" />
              )}
              renderOption={(props, option) => {
                const { name, id } = option;
                return (
                  <>
                  {id==-3 &&(<span {...props} >
                        {name}
                  </span>)}
                    {/* {id == -2 && (
                      <span   {...props}
                        style={{ color: "blue", textDecoration: "underline" }}
                        onClick={() => addParticipantsList("student")}
                      >
                        {name}
                      </span>
                    )} */}
                    {LessonRows.length > 1 && params.row.rowId != 0 && id == -1 ? (
                      <span {...props} style={{ color: "blue", textDecoration: "underline" }}>
                       {name}
                      </span>
                    ) : id != -1 && id != -2 &&id!==-3? (
                      <span {...props} >{name}</span>
                    ) : null}
                  </>
                );
              }}
            />
            {/* {participants.map(ele => <MenuItem value={ele.userId}>{ele.firstname} {ele.lastname}</MenuItem>)}
                                    {LessonRows.length > 1 ? (params.row.rowId != 0 ? <MenuItem value={-1} style={{ textDecoration: "underline", color: "blue" }}>Copy from above</MenuItem> : null) : null} */}

            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors[params.id]?.Participants}
            </MKTypography>
          </MKBox>
        ) : (
          <span id="participants" onClick={() => handlePartcipants(params.row.participants)}>
            {params.row.participants.length > 2
              ? params.row.participants
                  .slice(0, 2)
                  .map((x, index) => (
                    <span key={index}>
                      {params.row.participants.length > 1 ? x.name + " , " : x.name}
                    </span>
                  ))
              : params.row.participants.map((x, index) => (
                  <span key={index}>
                    {params.row.participants.length > 1 ? x.name + "," : x.name}{" "}
                  </span>
                ))}
            {}
            {params.row.participants.length > 2 ? "..." : null}
          </span>
        );
      },
    },
    {
      field: "partNotify",
      headerName: "Participants Notification",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => {
        return params.row.courseScheduleId == 0 ? (
          <MKBox>
            <MKInput
              label="Participants Notifications"
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()
              }
              required
              InputLabelProps={{ shrink: true }}
              value={notification[params.id]}
              // error={courseName != "" || !clickCreate ? false : true}
              onChange={(e) => getNotification(e, params)}
            />
            <MKTypography
              fontSize="0.75rem"
              color="error"
              style={{ display: "block" }}
              textGradient
            >
              {errors[params.id]?.notification}
            </MKTypography>
          </MKBox>
        ) : (
          <span>{params.row.participantNotificationThreshold}</span>
        );
      },
    },
  ];

  const [errors, setErrors] = useState({});
  const [courseTypeList, setCourseTypeList] = useState([]);

  const [participants, setParticipants] = useState([]);
  const [team, setTeam] = useState([]);
  const [teachers, setTeachers] = useState({});
  let teacherss = {};
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [editMode, setEditMode] = useState({});
  const [selectedCourseScheduleId, setSelectedCourseScheduleId] = useState(0);
  const [laoding, setLoading] = useState(false);
  const [LessonRows, setLessonRows] = useState([]);
  const [LessonDisplay, setLessonDisplay] = useState({});
  const [locations, setLocations] = useState([]);
  const [schedularList, setSchedularList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [locationModal, setLocationModal] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const [listTeam, setListTeam] = useState([]);
  const [listName, setListName] = useState();
  const [teamListData, setTeamListData] = useState([]);
  const [studentListData, setStudentListData] = useState([]);
  const [teamError, setTeamError] = useState({});
  const [studentError, setStudentError] = useState({});
  const limit = 20;

  const [hasMore, setHasMore] = React.useState(true);

  const fetchMoreData = () => {
    getSchedularData(offset, limit);
    setOffset(limit + offset);
    // console.log(LessonDisplay)
  };

  const handleChange = (event) => {
    setSelectedCourseType(event.target.value);
    setTeachers({});
    // console.log(" object  empty")
    // setSelectedCourse(courseTypeList.filter(x => x.courseId == parseInt(event.target.value)))
    courseTypeList
      .filter((x) => x.courseId == parseInt(event.target.value))
      .map((ele) => {
        //   console.log(ele,"element of courses")

        let lessonsList = [];
        ele.lessons.map((ele_, index) => {
          let row = {
            id: ele_.contentId,
            rowId: index,
            courseId: ele.courseId,
            courseScheduleId: 0,
            courseScheduleCourseDetailsId: 0,
            name: ele_.name,
            duration: ele_.properties.find((x) => x.key === "Duration in minutes")?.value,
            age:
              ele_.properties.find((x) => x.key === "Target Audience Minimal Age")?.value +
              `-` +
              ele_.properties.find((x) => x.key === "Target Audience Maximal Age")?.value,
            language: ele_.properties.find((x) => x.key === "Language")?.value,
            maintopic: ele_.properties.find((x) => x.key === "Main Topic")?.value,
          };
          lessonsList.push(row);

          // for(let i=0;i<ele.lessons.length;i++){
          // console.log(` ${index} times loop  run`)
          auth.GetLeadTeachers(orgId, ele_.contentId).then((res) => {
            teacherss[ele_.contentId] = res?.data?.result;
            // console.log(teacherss," teachers in apisssss ist")
            setTeachers({ ...teachers, [ele_.contentId]: res.data.result });
          });
          // }
        });
        // debugger;
        // setTeachers(teacherss)
        // console.log(teachers," teachers in apisssss")
        setLessonRows(lessonsList);
      });
  };
  // useEffect(()=>{
  //     console.log(teachers,"teachers dropdownssss")
  //     console.log(teacherss,"teachers dropdownqqqqqqq")
  // })
  const getSchedularData = (offset, limit) => {
    if (offset == 0) {
      setSchedularList([]);
      setLessonDisplay({});
    }
    courseScheduleService
      .GetCourseSchedules(0, offset, limit, orgId)
      .then((res) => {
        if (res?.data?.result.length == 0) {
          setHasMore(false);
        } else {
          setSchedularList(
            offset != 0 ? schedularList.concat(res?.data?.result) : res?.data?.result
          );
          let rows = {};

          res.data.result.forEach((ele) => {
            let lessonsList = [];
            ele.courseScheduleDeatilList.map((ele_, index) => {
              let row = {
                id: ele_.userContent.contentId,
                name: ele_.userContent.name,
                courseId: ele.courseId,
                courseScheduleId: ele.courseScheduleId,
                courseScheduleCourseDetailsId: ele_.courseScheduleCourseDetailsId,
                duration: ele_.userContent.properties.find((x) => x.key === "Duration in minutes")
                  ?.value,
                age:
                  ele_.userContent.properties.find((x) => x.key === "Target Audience Minimal Age")
                    ?.value +
                  `-` +
                  ele_.userContent.properties.find((x) => x.key === "Target Audience Maximal Age")
                    ?.value,
                language: ele_.userContent.properties.find((x) => x.key === "Language")?.value,
                maintopic: ele_.userContent.properties.find((x) => x.key === "Main Topic")?.value,
                dateTime: ele_.dateTime,
                location: ele_.location,
                maxParticipantsCount: ele_.maxParticipantsCount,
                participantNotificationThreshold: ele_.participantNotificationThreshold,
                teacher: ele_.teacher,
                team: ele_.team,
                participants: ele_.participants,
              };
              lessonsList.push(row);
            });
            rows[ele.courseScheduleId] = lessonsList;
          });
          setLessonDisplay(offset != 0 ? { ...LessonDisplay, ...rows } : rows);
        }
      })
      .catch(() => setHasMore(false));
  };

  useEffect(() => {
    coursetypeService.getCourses(0, 0, 1000, orgId).then((res) => {
      setLoader_(false);

      setCourseTypeList(res?.data?.result);
    });
    // auth.GetLeadTeachers(orgId).then((res) => {
    //     setTeachers(res?.data?.result)
    // })
    ////////////////////////////////////////////////////////////
    auth.GetParticipents(orgId).then((res) => {
      //    console.log(res, "response from")
      setParticipants(res.data.result);
    });
    auth.GetAdditonalParticipants(orgId).then((res) => {
      setTeam(res.data.result);
    });

    /////////////////////////////////////
    // usermanagementService.GetUsersWithRolesByOrganization(orgId, 0, 1000, true).then(res => {

    //     let team = []
    //     let participant = []
    //     res?.data?.result?.filter((ele) => ele.isActive == true).map(ele => {

    //         if (ele.roles.some(x => (x.name !== "Student"&&x.name !=="UsernameLoginStudent"))) {
    //             team.push(ele.user)
    //         }
    //         if (ele.roles.some(x =>( x.name == "Student"||x.name =="UsernameLoginStudent"))) {

    //             participant.push(ele.user)
    //         }

    //     })
    //     // setTeachers(teacher)
    //     setTeam(team)
    //     setParticipants(participant)

    // })
    getSchedularData(0, limit);
    setOffset(limit);
  }, []);
  // useEffect(()=>{
  //  auth.GetLeadTeachers(orgId).then((res)=>{
  //     // console.log(res, "lead teacher response")
  //     setTeachers(res?.data?.result)
  //  })
  // },[])
  useEffect(() => {
    locationService.getLocations(orgId).then((res) => {
      setLocations(res.data.result);
    });
  }, [locationModal]);

  const createSchedule = () => {
    let lessonScheduleList = [];
    let postSchedule = {};
    let errors_ = {};
    postSchedule["courseScheduleId"] = selectedCourseScheduleId;
    postSchedule["courseId"] = selectedCourseType;
    postSchedule["organizationId"] = orgId;
    postSchedule["createdBy"] = user?.userId;
    LessonRows.map((res) => {
      let lessonSchedule = {};
      lessonSchedule["userContentId"] = res.id;
      lessonSchedule["courseScheduleCourseDetailsId"] = res.courseScheduleCourseDetailsId;
      lessonSchedule["lessonName"] = res.name;

      if (selectedLocation[res.id] == undefined) {
        errors_[res.id] = { ...errors_[res.id], Location: "Required" };
      } else {
        lessonSchedule["locationId"] = selectedLocation[res.id]?.id;
      }
      if (selectedDateTime[res.id] == undefined) {
        // errors_[res.id] = { ...errors_[res.id], "DateTime": "Required" }
        lessonSchedule["dateTime"] = new Date();
      } else {
        lessonSchedule["dateTime"] = selectedDateTime[res.id];
      }
      if (selectedTeacher[res.id] == undefined) {
        errors_[res.id] = { ...errors_[res.id], Teacher: "Required" };
      } else if (selectedTeacher[res.id] == 0) {
        errors_[res.id] = { ...errors_[res.id], Teacher: "User Already leading on same time" };
      } else {
        lessonSchedule["teacherId"] = selectedTeacher[res.id]?.id;
      }
      if (maxPart[res.id] == null || maxPart[res.id] == "") {
        errors_[res.id] = { ...errors_[res.id], MaxParticipants: "Required" };
      }
      lessonSchedule["maxParticipantsCount"] = parseInt(maxPart[res.id]);
      if (notification[res.id] == null || notification[res.id] == "") {
        errors_[res.id] = { ...errors_[res.id], notification: "Required" };
      }
      lessonSchedule["participantNotificationThreshold"] = parseInt(notification[res.id]);
      if (selectedTeamList[res.id] != undefined) {
        lessonSchedule["teamIds"] = [...new Set(selectedTeamList[res.id].map((e) => e?.id) ?? [])];
      }
      if (
        selectedParticipantList[res.id]?.length < 1 ||
        selectedParticipantList[res.id] == undefined
      ) {
        errors_[res.id] = { ...errors_[res.id], Participants: "Required" };
      } else {
        lessonSchedule["participantIds"] = [
          ...new Set(selectedParticipantList[res.id].map((e) => e?.id)),
        ];
      }
      lessonScheduleList.push(lessonSchedule);
    });
    if (Object.keys(errors_).length === 0) {
      setLoading(true);
      postSchedule["courseScheduleDetails"] = lessonScheduleList;
      courseScheduleService
        .AddSchedule(postSchedule)
        .then((res) => {
          setLoading(false);
          getSchedularData(0, limit);
          setOffset(limit);
          setSelectedCourseType(0);
          setSelectedCourseScheduleId(0);
          setSelectedLocation({});
          setSelectedDateTime({});
          setSelectedTeacher({});
          setMaxPart({});
          setNotification({});
          setLessonRows({});
          setSelectedParticipantList({});
          setSelectedTeamList({});
          if (selectedCourseScheduleId != 0) {
            setEditMode({
              ...editMode,
              [selectedCourseScheduleId]: false,
            });
          }

          toast.success(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                {res.data.message}
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          );

          setHasMore(true);
          getSchedularData(0, limit);
          setOffset(limit);
        })
        .catch((e) => {
          toast.error(
            <MKBox sx={{ display: "flex", justifyContent: "center" }}>
              <MKTypography variant="contained" color="secondary">
                {e?.response?.data?.message}
              </MKTypography>
            </MKBox>,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: false,
            }
          );

          setLoading(false);
        });
    }
    setErrors(errors_);
  };

  const handleEdit = (scheduleEle) => {
    // console.log(selectedTeacher)
    setSelectedCourseType(scheduleEle.courseId);
    setSelectedCourseScheduleId(scheduleEle.courseScheduleId);
    // setSelectedCourse(courseTypeList.filter(x => x.courseId == ele.courseId))
    courseTypeList
      .filter((x) => x.courseId == parseInt(scheduleEle.courseId))
      .map((ele) => {
        let lessonsList = [];
        let selectedLoc = {};
        let selectedDate = {};
        let selectedTeacher = {};
        let maxpart = {};
        let notify = {};
        let participant = {};
        let team = {};
        ele.lessons.map((ele_, index) => {
          let row = {
            id: ele_.contentId,
            rowId: index,
            courseId: ele.courseId,
            courseScheduleId: 0,
            courseScheduleCourseDetailsId: scheduleEle.courseScheduleDeatilList.find(
              (x) => x.userContent.contentId == ele_.contentId
            )?.courseScheduleCourseDetailsId,
            name: ele_.name,
            duration: ele_.properties.find((x) => x.key === "Duration in minutes")?.value,
            age:
              ele_.properties.find((x) => x.key === "Target Audience Minimal Age")?.value +
              `-` +
              ele_.properties.find((x) => x.key === "Target Audience Maximal Age")?.value,
            language: ele_.properties.find((x) => x.key === "Language")?.value,
            maintopic: ele_.properties.find((x) => x.key === "Main Topic")?.value,
          };
          lessonsList.push(row);

          let lesson = scheduleEle.courseScheduleDeatilList.find(
            (x) => x.userContent.contentId == ele_.contentId
          );
          selectedLoc[ele_.contentId] = lesson?.location;
          selectedDate[ele_.contentId] = lesson?.dateTime;
          selectedTeacher[ele_.contentId] = lesson?.teacher;
          maxpart[ele_.contentId] = lesson?.maxParticipantsCount;
          notify[ele_.contentId] = lesson?.participantNotificationThreshold;
          participant[ele_.contentId] = lesson?.participants;
          team[ele_.contentId] = lesson?.team;
          // participant[ele_.contentId] = lesson?.participants
          // if (loc.length > 0){
          //     selectedLoc[ele_.contentId] = lesson.map(x => x.location.id)
          // }
        });
        setSelectedLocation(selectedLoc);
        setSelectedDateTime(selectedDate);
        setSelectedTeacher(selectedTeacher);
        setMaxPart(maxpart);
        setNotification(notify);
        setLessonRows(lessonsList);
        setSelectedParticipantList(participant);
        setSelectedTeamList(team);
        setEditMode({ [scheduleEle.courseScheduleId]: true });
      });
  };

  const addLocation = () => {
    setLocationModal(true);
    setAnchorEl(null);
  };

  const addParticipantsList = (type) => {
    type == "team" ? setOpenTeam(true) : setOpenStudent(true);
  };

  const handleParticipantList = () => {
    setParticipantModal(true);
    setAnchorEl(null);
  };

  const handleList = (e, ele) => {
    console.log(e.target.checked, ele.userId, ele);
  };

  const getTeamList = (event, value) => {
    // console.log(event,value,"team list")
    setListTeam(value);
  };
  const getListName = (e) => {
    setListName(e.target.value);
  };

  const saveList = (type) => {
    let error = {};
    if (listName == "" || listName == undefined) {
      error.name = "required";
    }
    if (listTeam.length < 1) {
      error.list = "minimum 1 participant required";
    }
    if(type == "team") { 
        setTeamError(error) 
        setOpenTeam(false)
     }
    else{ 
        setStudentError(error) 
        setOpenStudent(false)
    }
    // if(listTeam.length==0){

    // } 
    if (Object.keys(error).length < 1) {
      let data = {
        id: short.generate(),
        name: listName,
        values: listTeam,
      };

      type == "team"
        ? setTeamListData([...teamListData, data])
        : setStudentListData([...studentListData, data]);

      setListName("");
    }

    console.log(teamListData,"team save data")
    console.log(studentListData,"student list data")
  };


  useEffect(()=>{
  localStorage.setItem("teamList",JSON.stringify( teamListData))
  },[teamListData])

  useEffect(()=>{
    localStorage.setItem("studentList",studentListData)
  },[studentListData])
  // let aa=[]
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
      {/* <Toolbar /> */}
      {/* <ToastContainer /> */}

      <Grid container>
        <Grid item xs={12}>
          <Paper
            elevation={2}
            className="paper"
            style={{
              padding: 10,
            }}
          >
            <Grid display="flex" justifyContent={"space-between"}>
              <MKTypography variant="h4" mb={2}>
                Schedule a new course:
              </MKTypography>
              <MKBox ml={{ xs: "auto", lg: 2 }} width="40%" >
                <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 400 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Select Course Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={selectedCourseType}
                    disabled={selectedCourseScheduleId !== 0 ? true : false}
                    onChange={handleChange}
                    autoWidth
                    label="Select Course Type"
                  >
                    {loader_ ? (
                      <CircularProgress color="inherit" size="20px" />
                    ) : courseTypeList.length > 0 ? (
                      courseTypeList.map((ele) => (
                        <MenuItem value={ele.courseId}>{ele.courseName}</MenuItem>
                      ))
                    ) : (
                      <MenuItem>No Data</MenuItem>
                    )}
                    {/* {courseTypeList.map(ele => <MenuItem value={ele.courseId}>{ele.courseName}</MenuItem>)} */}
                  </Select>
                </FormControl>
              </MKBox>
              <MKButton
                variant="contained"
                color="info"
                onClick={addLocation}
                sx={{ marginBottom: "5px" }}
              >
                Add Location
              </MKButton>

              {/* < TuneRoundedIcon onClick={(event) => setAnchorEl(event.currentTarget)} style={{ cursor: "pointer", minHeight: "35px", minWidth: "40px" }} />






                            <Menu
                                id="basic-menu1"
                                anchorEl={anchorEl}
                                open={open_}
                                onClose={handleClose_}
                                value={""}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button1',
                                }}
                            >

                                <MenuItem onClick={addLocation}>Add Location</MenuItem>
                                {/* <MenuItem onClick={handleParticipantList}>Add List</MenuItem> */}
              {/* </Menu> */}

              {/* <MKBox sx={{ float: "right" }}>
                                <MKButton variant="gradient" color="info" onClick={addLocation} >Add Location</MKButton>
                            </MKBox>
                            <MKBox sx={{ float: "right" }}>
                                <MKButton variant="gradient" color="info" onClick={handleParticipantList} >Add List</MKButton>
                            </MKBox> */}
              {/* <MKBox sx={{ float: "right" }}>
                                <MKButton variant="gradient" color="info" onClick={addLocation} >Add Team</MKButton>
                            </MKBox> */}
            </Grid>
            <MKBox sx={{ height: 450, width: "100%",zIndex:1 }}>
              <DataGrid
                rows={LessonRows}
                columns={columns}
                rowHeight={100}
                autoPageSize
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
              />
            </MKBox>
            <Grid mt={5} sx={{ float: "right" }}>
              <MKButton variant="gradient" color="info" onClick={createSchedule}>
                {laoding ? (
                  <CircularProgress color="inherit" size="20px" />
                ) : selectedCourseScheduleId !== 0 ? (
                  "Update the Schedule"
                ) : (
                  "Schedule the Course"
                )}
              </MKButton>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid container mt={5}>
        <Divider style={{ height: "3px" }} />
        <MKTypography variant="h4">{orgName} courses Types List:</MKTypography>

        <Divider style={{ height: "3px" }} />
        <InfiniteScroll
          dataLength={schedularList.length}
          next={fetchMoreData}
          hasMore={hasMore}
          style={{ width: "100%" }}
          loader={
            <Grid item xs={12} textAlign="center">
              <CircularProgress color="inherit" />
            </Grid>
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {schedularList.map((ele) => (
            <Grid container mb={5}>
              <Grid container alignItems={"center"}>
                <Grid item xs={3}>
                  <strong> Course Name :</strong> {ele?.courseName}
                </Grid>

                <Grid item xs={3}>
                  {!editMode[ele.courseScheduleId] && (
                    <MKButton variant="gradient" color="info" onClick={() => handleEdit(ele)}>
                      Edit Course Type
                    </MKButton>
                  )}
                </Grid>
                <Grid item xs={3}>
                  <MKAvatar className="logo_2" variant="square" alt="Avatar" size="lg" />
                </Grid>
              </Grid>

              <MKBox sx={{ height: 350, width: "100%" }}>
                <DataGrid
                  rows={LessonDisplay[ele.courseScheduleId] ?? []}
                  columns={columns}
                  autoPageSize
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </MKBox>
            </Grid>
          ))}
        </InfiniteScroll>
      </Grid>
      {resetPass && <ResetPass visible={resetPass} setVisible={setResetPass} />}
      {locationModal && (
        <AddLocation
          visible={locationModal}
          setVisible={setLocationModal}
          userId={user?.userId}
          orgId={orgId}
        />
      )}
      <Modal
        keepMounted
        open={modalVisible}
        onClose={handleClose_}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox width="100%" style={{ overflowWrap: "break-word" }} autoComplete="off" sx={style}>
          {participantList.map((ele, ind) => ele.name + " , ")}
        </MKBox>
      </Modal>

      {/* add participants list modal */}
      <Modal
        keepMounted
        open={openTeam}
        onClose={closeTeam}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <div>
        <MKBox width="100%" autoComplete="off" sx={style}>
          <MKInput
            label="Enter List Name"
            fullWidth
            type="text"
            value={listName}
            required
            onChange={(e) => getListName(e)}
          />
          {"name" in teamError ? (
            <MKTypography fontSize="0.7rem" color="error" style={{ display: "block" }} textGradient>
              {teamError["name"]}
            </MKTypography>
          ) : null}
          <MKBox mt={3}>
           
          <Autocomplete
            multiple
            id="multiple-limit-tags"
            mt={3}
            limitTags={1}
            onChange={(e, value) => getTeamList(e.target, value)}
            // onChange={(e, value) => getTeams(value, params)}
            autoWidth
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.id === value.id}
            label="Additional Participants"
            // value={Array.isArray(selectedTeamList[params.id]) ? selectedTeamList[params.id] : []}
            disableCloseOnSelect
            options={
              team.length > 0
                ? [
                    ...team
                      .map((option) => {
                        return {
                          id: option.userId,
                          name: option.firstname + " " + option.lastname,
                        };
                      })
                      .sort((a, b) => sorting(a, b)),
                  ]
                : []
            }
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField {...params} label="Participants" placeholder="Search" />
            )}
            // renderTags={() => null}
            renderOption={(props, option) => {
              const { name, id } = option;
              return <span {...props}> {name} </span>;
            }}
            // {team.map(ele => <MenuItem value={ele.userId}>{ele.firstname} {ele.lastname}</MenuItem>)}
            // {LessonRows.length > 1 ? (params.row.rowId != 0 ? <MenuItem value={-1} style={{ textDecoration: "underline", color: "blue" }}>Copy from above</MenuItem> : null) : null}
          />
 </MKBox>
          {"list" in teamError ? (
            <MKTypography fontSize="0.7rem" color="error" style={{ display: "block" }} textGradient>
              {teamError["list"]}
            </MKTypography>
          ) : null}
          <MKButton
            sx={{ position: "absolute", bottom: "10px", right: "18px", marginTop: "3px" }}
            variant="contained"
            color="info"
            onClick={() => saveList("team")}
          >
            Save
          </MKButton>
        </MKBox>
        </div>
      </Modal>

      {/* student list modal*/}

      <Modal
        keepMounted
        open={openStudent}
        onClose={closeStudent}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <div>        <MKBox width="100%" autoComplete="off" sx={style}>
          <MKInput
            label="Enter List Name"
            fullWidth
            type="text"
            value={listName}
            required
            onChange={(e) => getListName(e)}
          />
          {"name" in studentError ? (
            <MKTypography fontSize="0.7rem" color="error" style={{ display: "block" }} textGradient>
              {studentError["name"]}
            </MKTypography>
          ) : null}
          <MKBox mt={3}>
            <Autocomplete
              multiple
              id="multiple-limit-tags"
              limitTags={1}
              onChange={(e, value) => getTeamList(e.target, value)}
              // onChange={(e, value) => getTeams(value, params)}
              autoWidth
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option.id === value.id}
              label="Additional Participants"
              // value={Array.isArray(selectedTeamList[params.id]) ? selectedTeamList[params.id] : []}
              disableCloseOnSelect
              options={
                team.length > 0
                  ? [
                      ...participants
                        .map((option) => {
                          return {
                            id: option.userId,
                            name: option.firstname + " " + option.lastname,
                          };
                        })
                        .sort((a, b) => sorting(a, b)),
                    ]
                  : []
              }
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField {...params} variant="standard" size="small"  label="Participants" placeholder="Search" />
              )}
              // renderTags={() => null}
              renderOption={(props, option) => {
                const { name, id } = option;
                return <span {...props}> {name} </span>;
              }}
              // {team.map(ele => <MenuItem value={ele.userId}>{ele.firstname} {ele.lastname}</MenuItem>)}
              // {LessonRows.length > 1 ? (params.row.rowId != 0 ? <MenuItem value={-1} style={{ textDecoration: "underline", color: "blue" }}>Copy from above</MenuItem> : null) : null}
            />
          </MKBox>
          {"list" in studentError ? (
            <MKTypography fontSize="0.7rem" color="error" style={{ display: "block" }} textGradient>
              {studentError["list"]}
            </MKTypography>
          ) : null}
          <MKButton
            sx={{ position: "absolute", bottom: "10px", right: "18px", marginTop: "3px" }}
            variant="contained"
            color="info"
            onClick={() => saveList("student")}
          >
            Save
          </MKButton>
        </MKBox>{" "}
        </div>

      </Modal>

      {/* //location Modal */}
      <Modal
        keepMounted
        open={descriptionModal}
        onClose={closeDescription}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        
                    <MKBox width="100%" style={{ overflowWrap: "break-word" }} autoComplete="off" sx={style}>
          {description.map((ele) => {
            return (
              <>
                <MKTypography variant="h6">Location: </MKTypography>
                <MKTypography>{ele.location}</MKTypography>
                <MKTypography variant="h6">Descripton: </MKTypography>
                <MKTypography>{ele.details}</MKTypography>
              </>
            );
          })}
        </MKBox>
      </Modal>

      <Modal
        keepMounted
        open={ParticipantModal}
        onClose={closeList}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox width="100%" style={{ overflowWrap: "break-word" }} autoComplete="off" sx={style}>
          Handle Participant
        </MKBox>
        
      </Modal>
    </MKBox>
  );
};

export default Schedular;
