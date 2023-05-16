import React, { useEffect, useRef, useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import MKBox from "components/MKBox";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { toast, ToastContainer } from "react-toastify";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import MKButton from "components/MKButton";
import ResetPass from "../../../../components/ResetPass";
import MKAvatar from "components/MKAvatar";
import "./index.css";
import coursetypeService from "../../../../services/coursetype.service";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@mui/material/CircularProgress";
import { NavLink } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import TextEditor from "components/TextEditor";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";




const drawerWidth = 72;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const CourseType = () => {
    const [loader_,setLoader_]=useState(true)
    const orgName = localStorage.getItem("orgName")
        ? JSON.parse(localStorage.getItem("orgName"))
        : null;
    const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    const theme = useTheme();

    const [resetPass, setResetPass] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [readMore, setReadMore] = React.useState(true);
    const [longDescription, setLongDescription] = React.useState(() => EditorState.createEmpty());

    const fetchMoreData = () => {
        getCoursesType(offset, limit);
        setOffset(limit + offset);
    };

    const handleRemove = (params) => {
        let course = courseTypeList.find((ele) => ele.courseId === params.row.courseId);

        let postParams = {
            courseId: params.row.courseId,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            lessonIds: course.lessons.filter((x) => x.contentId != params.row.id).map((y) => y.contentId),
            organizatoinId: orgId,
            userId: user?.userId,
        };
        coursetypeService.AddCourse(postParams).then(() => {
            setCourseName("");
            setLongDescription(EditorState.createEmpty());
            setSelectedLessonsList([]);
            setEditMode({ ...editMode, [params.row.courseId]: false });
            setHasMore(true)
            getCoursesType(0, limit);
            setOffset(limit);
            setCourseId(0);
        }).catch((err) => {
           


            toast.error(
                <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                  <MKTypography variant="contained" color="secondary">
                  {err?.response?.data?.message}
                  </MKTypography>
                </MKBox>,
                {
                  position: toast.POSITION.TOP_CENTER,
                  autoClose: false,
                }
              )

            setLoading(false)
        });
    };

    const columns = [
        // { field: 'id', headerName: 'ID', flex: 1 },

        {
            field: "name",
            headerName: "Lessons",
            flex: 1,
        },
        {
            field: "duration",
            headerName: "Lesson Duration in minutes",
            flex: 1,
        },
        {
            field: "age",
            headerName: "Age",
            flex: 1,
        },
        {
            field: "language",
            headerName: "Language",
            flex: 1,
        },
        {
            field: "maintopic",
            headerName: "Main Topic",
            flex: 1,
        },
        {
            field: "resetPass",
            headerName: "",
            flex: 1,
            renderCell: (params) => {
                return (
                    editMode[params.row.courseId] &&
                    params.row.lessonlength > 1 && (
                        <MKButton color="info" onClick={() => handleRemove(params)}>
                            Remove Lessons
                        </MKButton>
                    )
                );
            },
        },
    ];


    function getStyles(name, personName, theme) {
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }


    const [courseName, setCourseName] = useState("");
    const [desc, setDesc] = useState({});
    const [errors, setErrors] = useState({});
    const [courseTypeList, setCourseTypeList] = useState([]);
    const [clickCreate, setClickCreate] = useState(false);
    const [lessonsList, setLessonList] = useState([]);
    const [laoding, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const limit = 20;
    const [rows, setRows] = useState({});
    const [selectedLessonList, setSelectedLessonsList] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [courseId, setCourseId] = useState(0);


    const getCourseName = (e) => {
        setCourseName(e.target.value);
        setErrors((prev) => ({ ...prev, courseName: "" }));
    };
    // const getDescription = (e) => {
    //     setDesc(e.target.value);
    //     setErrors((prev) => ({ ...prev, desc: "" }));
    // };

    const handleChange = (event) => {
        setErrors((prev) => ({ ...prev, LessonList: "" }));
        setSelectedLessonsList(event.target.value);
    };

    const getCoursesType = (offset, limit) => {
        coursetypeService
            .getCourses(0, offset, limit, orgId)
            .then((res) => {
                if (res?.data?.result.length == 0) {
                    setHasMore(false);
                } else {
                    setCourseTypeList(
                        offset != 0 ? courseTypeList.concat(res?.data?.result) : res?.data?.result
                    );
                    let _rows = {};
                    let _desc = {};
                    res?.data?.result.map((ele) => {
                        let lessonsList = [];
                        try {
                            _desc = { ..._desc, [ele.courseId]: EditorState.createWithContent(convertFromRaw(JSON.parse(ele.courseDescription))) }
                        }
                        catch (e) {
                            _desc = { ..._desc, [ele.courseId]: EditorState.createEmpty() }
                        }
                        ele.lessons.map((ele_, index) => {
                            let row = {
                                id: ele_.contentId,
                                courseId: ele.courseId,
                                name: ele_.name,
                                lessonlength: ele.lessons?.length,
                                duration: ele_.properties.find((x) => x.key === "Duration in minutes")?.value,
                                age:
                                    ele_.properties.find((x) => x.key === "Target Audience Minimal Age")?.value ===
                                        ele_.properties.find((x) => x.key === "Target Audience Maximal Age")?.value
                                        ? ele_.properties.find((x) => x.key === "Target Audience Minimal Age")?.value
                                        : ele_.properties.find((x) => x.key === "Target Audience Minimal Age")?.value +
                                        `-` +
                                        ele_.properties.find((x) => x.key === "Target Audience Maximal Age")?.value,
                                language: ele_.properties.find((x) => x.key === "Language")?.value,
                                maintopic: ele_.properties.find((x) => x.key === "Main Topic")?.value,
                            };
                            lessonsList.push(row);
                        });
                        _rows[ele.courseId] = lessonsList;
                    });
                    setDesc({ ...desc, ..._desc })
                    setRows({ ...rows, ..._rows });
                }
            })
            .catch(() => setHasMore(false));
    };

    useEffect(() => {
        coursetypeService.getLessons(orgId).then((res) => {
            setLoader_(false)
            setLessonList(res?.data?.result ? res?.data?.result : []);
        }).catch((err)=>{
            setLoader_(false)
        })
        getCoursesType(offset, limit);
        setOffset(limit + offset);
    }, []);

    const createCourseType = () => {
        const errors_ = {};
        const lodec = convertToRaw(longDescription.getCurrentContent());
        const longVal = lodec.blocks.some((e) => {
            return e.text.trim() !== "";
        });

        if (courseName == "") {
            errors_.courseName = "Required";
        } else if (!courseName.match(/^[0-9a-zA-Z\s]+$/)) {
            errors_.courseName = "Course Name should be alphanumeric";
        }
        if (!longVal) {
            errors_.desc = " Required";
        }
        if (selectedLessonList.length < 1) {
            errors_.LessonList = "Required";
        }

        if (Object.keys(errors_).length === 0) {
            setLoading(true);
            coursetypeService
                .AddCourse({
                    courseId: courseId,
                    courseName: courseName,
                    courseDescription: JSON.stringify(
                        convertToRaw(longDescription.getCurrentContent())
                    ),
                    lessonIds: selectedLessonList,
                    organizatoinId: orgId,
                    userId: user?.userId,
                })
                .then(() => {
                    setCourseName("");
                    setLongDescription(EditorState.createEmpty());
                    setSelectedLessonsList([]);
                    setCourseId(0);
                    setLoading(false);
                    setHasMore(true)
                    getCoursesType(0, limit);
                    setOffset(limit);
                    if (courseId != 0) {
                        setEditMode({ ...editMode, [courseId]: false });
                    }
                })
                .catch((err) => {
                   


                    toast.error(
                        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                          <MKTypography variant="contained" color="secondary">
                          {err?.response?.data?.message}
                          </MKTypography>
                        </MKBox>,
                        {
                          position: toast.POSITION.TOP_CENTER,
                          autoClose: false,
                        }
                      )

                    setLoading(false)
                });
        }
        setErrors(errors_);
    };

    const handleEdit = (ele) => {
        setEditMode({ [ele?.courseId]: true });
        setCourseName(ele?.courseName);
        let convertedStateLongDescription = {}
        try {
            debugger;
            const convertJson = JSON.parse(ele?.courseDescription)
            convertedStateLongDescription = convertFromRaw(convertJson);
            setLongDescription(() => EditorState.createWithContent(convertedStateLongDescription));
        } catch (e) {
            console.log(e)
            setLongDescription(EditorState.createEmpty());
        }
        // setLongDescription(EditorState.createWithContent(convertedStateLongDescription));
        setSelectedLessonsList(rows[ele?.courseId].map((x) => x.id));
        setCourseId(ele?.courseId);
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
            {/* <Toolbar /> */}
            {/* <ToastContainer /> */}

            <Grid container>
                <Grid item xs={12}>
                    <Paper
                        elevation={2}
                        className="paper"
                        style={{
                            padding: 10,
                            position: "fixed",
                            zIndex: 1000,
                            marginRight: 25,
                        }}
                    >
                        <MKTypography variant="h4" mb={2}>
                            Create a new course type:
                        </MKTypography>
                        <MKBox component="form" method="post" autoComplete="off">
                            <Grid container>
                                <Grid item xs={12} md={5}>
                                    <MKBox mb={2}>
                                        <MKInput
                                            label="Course Name"
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            value={courseName}
                                            error={courseName != "" || !clickCreate ? false : true}
                                            onChange={getCourseName}
                                        />
                                        {"courseName" in errors ? (
                                            <MKTypography
                                                fontSize="0.75rem"
                                                color="error"
                                                style={{ display: "block" }}
                                                textGradient
                                            >
                                                {errors["courseName"]}
                                            </MKTypography>
                                        ) : null}
                                    </MKBox>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <MKBox ml={{ xs: "auto", lg: 2 }}>
                                        <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 400 }} required>
                                            <InputLabel id="demo-simple-select-autowidth-label">
                                                Related Lessons
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-autowidth-label"
                                                id="demo-simple-select-autowidth"
                                                value={selectedLessonList}
                                                onChange={handleChange}
                                                multiple={true}
                                                autoWidth
                                                required
                                                label="Related Lessons"
                                                // defaultValue=""
                                                MenuProps={MenuProps}
                                            >
                                                {loader_?<CircularProgress color="inherit" size="20px" />:(lessonsList.length>0?lessonsList.map((ele, index) => (
                                                    <MenuItem key={index} value={ele.contentId} style={getStyles(ele.contentId, selectedLessonList, theme)} >{ele.name}</MenuItem>
                                                )):<MenuItem>No data</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        {"LessonList" in errors ? (
                                            <MKTypography
                                                fontSize="0.75rem"
                                                color="error"
                                                style={{ display: "block" }}
                                                textGradient
                                            >
                                                {errors["LessonList"]}
                                            </MKTypography>
                                        ) : null}
                                    </MKBox>
                                </Grid>

                                <Grid item xs={12} md={10}>
                                    <MKBox style={{ border: "0.5px solid #d2d6da", height: "100px", overflow: "auto", borderRadius: "0.375rem" }}>
                                    
                                        <TextEditor
                                            editorState={longDescription}
                                            setEditorState={setLongDescription}
                                            readOnly={false}
                                            required={true}
                                            fromCourseType={true}
                                        />
                                    </MKBox>
                                    {"desc" in errors ? (
                                        <MKTypography
                                            fontSize="0.75rem"
                                            color="error"
                                            style={{ display: "block" }}
                                            textGradient
                                        >
                                            {errors["desc"]}
                                        </MKTypography>
                                    ) : null}
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    md={2}
                                    display="flex"
                                    justifyContent={"center"}
                                    alignItems="center"
                                >
                                    <MKButton variant="gradient" color="info" onClick={createCourseType}>
                                        {laoding ? (
                                            <CircularProgress color="inherit" size="20px" />
                                        ) : courseId !== 0 ? (
                                            "update"
                                        ) : (
                                            "create"
                                        )}
                                    </MKButton>
                                </Grid>
                            </Grid>
                        </MKBox>
                    </Paper>
                </Grid>
            </Grid>

            <Grid container mt={35}>
                <Divider style={{ height: "3px" }} />
                <MKTypography variant="h4">{orgName} courses Types List:</MKTypography>

                <Divider style={{ height: "3px" }} />
                <InfiniteScroll
                    dataLength={courseTypeList.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    style={{ width: "100%" }}
                    loader={
                        <Grid item xs={12} textAlign="center">
                            <CircularProgress color="inherit" />
                        </Grid>
                    }
                >
                    {courseTypeList.map((ele,index) => (
                        <Grid container mb={5} key={index}>
                            <Grid container alignItems={"center"} mb={5}>
                                <Grid item xs={3}>
                                    <strong> Course Name :</strong> {ele?.courseName}
                                </Grid>
                                <Grid item xs={5}>
                                    <strong> Number of Lessons :</strong> {ele?.lessons?.length}
                                </Grid>
                                <Grid item xs={3}>
                                    {!editMode[ele.courseId] && (
                                        <MKButton variant="gradient" color="info" onClick={() => handleEdit(ele)}>
                                            Edit Course Type
                                        </MKButton>
                                    )}
                                </Grid>
                                {/* <Grid item xs={3}>
                                    <MKAvatar className="logo_2" variant="square" alt="Avatar" size="lg" />
                                </Grid> */}
                                <Grid item xs={12} sx={{ wordBreak: "break-all" }}>
                                    <strong> Description :</strong>
                                    {/* {ele?.courseDescription.length > 100
                                        ? (readMore ? ele?.courseDescription.substring(0, 50).concat("...") : ele?.courseDescription
                                        ) : ele?.courseDescription}
                                    {ele?.courseDescription.length > 100 ? <NavLink to="" onClick={() => setReadMore(!readMore)} >
                                        {readMore ? "(Read More)" : "(Show Less)"}
                                    </NavLink> : null} */}
                                    <TextEditor
                                        editorState={desc[ele.courseId]}
                                        setEditorState={setLongDescription}
                                        readOnly={true}
                                        fromCourseType={true}
                                    />
                                </Grid>
                            </Grid>

                            <MKBox sx={{ height: 350, width: "100%" }}>
                                <DataGrid
                                    rows={rows[ele.courseId] ? rows[ele.courseId] : []}
                                    columns={columns}
                                    pageSize={5}
                                    rowsPerPageOptions={[5]}
                                    disableSelectionOnClick
                                />
                            </MKBox>
                            {/* {editMode[ele.courseId] &&
                                <MKButton variant="gradient" color="info" onClick={() => handleAddLesson(ele)}>
                                    Add Lesson
                                </MKButton>
                            } */}
                        </Grid>
                    ))}
                </InfiniteScroll>
            </Grid>
            {resetPass && <ResetPass visible={resetPass} setVisible={setResetPass} />}
        </MKBox>
    );
};

export default CourseType;
