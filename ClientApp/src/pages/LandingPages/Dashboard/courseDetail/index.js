import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MKBox from "components/MKBox";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import "../dashboard.css";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import TextEditor from "components/TextEditor";
import MKTypography from "components/MKTypography";
import ListItemButton from "@mui/material/ListItemButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import UploadToS3WithNativeSdk from "components/UploadS3";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import Paper from "@mui/material/Paper";
import usercontentService from "services/usercontent.service";
import MKAvatar from "components/MKAvatar";
import MenuItem from "@mui/material/MenuItem";
import Bucket from "../../../../aws";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { Languages_ } from "../Languages/index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSearchParams } from "react-router-dom";
import Switch from "@mui/material/Switch";
import Modal from "@mui/material/Modal";
const drawerWidth = 72;
const CourseListing = () => {
  const style = {
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
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => {
    setOpenModal(false);
    setAccessEmail("");
    setAccessName("");
    setErrors({});
  };
  const [accessEmail, setAccessEmail] = useState();
  const [accessName, setAccessName] = useState();
  const [errors, setErrors] = useState({});
  const [longDescription, setLongDescription] = React.useState(() => EditorState.createEmpty());
  const [shortDescription, setShortDescription] = React.useState(() => EditorState.createEmpty());
  const { state } = useLocation();
  const [readOnly, setReadOnly] = React.useState(true);
  const [property, setProperty] = React.useState({
    key: "",
    value: "",
  });
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const permissions = localStorage.getItem("permissions")
    ? JSON.parse(localStorage.getItem("permissions"))
    : [];
  const [properties, setProperties] = React.useState([]);
  const [shared, setShared] = React.useState({
    email: "",
    name: "",
  });
  const [resError, setResError] = useState({});
  const [shares, setShares] = React.useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [shareChecks, setShareChecks] = React.useState({});
  const [name, setName] = React.useState(state.create ? "" : state.data.name);
  const [load, setLoad] = useState();
  const [duplicate, setDuplicate] = useState(false);
  const [fileName, setFileName] = useState("");
  const [staticProps, setStaticProps] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState({});
  const [errorProperties, setErrorProperties] = useState({});
  const navigate = useNavigate();
  const [minAge, setMinAge] = useState();
  const [laoding, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);
  const [answer, setAnswer] = useState();
  const [answers_, setAnswers_] = useState([]);
  const [checked, setChecked] = useState(false);
  const [ScratchError, setScratchError] = useState({});
  const [empty, setEmpty] = useState();
  const lessonNameRef = useRef(null);
  const shortDescriptionRef = useRef(null);
  const longDescriptionRef = useRef(null);
  const propertiesRef = useRef(null);
  const [selectLang, setSelectLang] = useState("");
  const [accessContentId, setAccessContentId] = useState()
  const [descError, setDescError] = useState({
    short: "",
    long: "",
  });
  const [questions_, setQuestions_] = useState({});
  const [questions, setQuestions] = useState([]);
  const [scratchProject, setScratchProject] = useState([]);
  const [scratch, setScratch] = useState({
    name: "",
    link: "",
  });
  const [QuestionsError, setQuestionsError] = useState({});
  const _staticProps = [
    "Main Topic",
    "Language",
    "Target Audience Minimal Age",
    "Target Audience Maximal Age",
    "Keywords",
    "Duration in minutes",
  ];
  const lessonProprt = [
    "Main Topic",
    "Language",
    "Target Audience Minimal Age",
    "Target Audience Maximal Age",
    "Keywords",
    "Duration in minutes",
  ];
  let shareChecks_ = {
    isPrivate: true,
    shareAlsoWithStudentsOfAllOgranizations: false,
    shareAlsoWithStudentsOfMyOgranizations: false,
    shareToAll: false,
    shareToAllOgranizations: false,
    shareToMyOgranizations: false,
    sharedWithSpecificPeople: true,
  };

  const [files, setFiles] = useState(
    state.create
      ? []
      : state.data.attachments.map((ele) => {
        return ele.attachmentKey;
      })
  );

  const label = { inputProps: { "aria-label": "Switch demo" } };
  let errorLesson = {};
  let error_ = {};
  let topiic = false;
  let keyw = false;
  let mage = false;
  let miage = false;
  let durat = false;
  const handleName = (e) => {
    if (copy == true) {
      setCopy(false);
    }
    setName(e.target.value);
    e.target.value.trim() !== "" && setError({});
  };

  const handleStaticProps = (element, e) => {
    if (element == "Target Audience Minimal Age") {
      setMinAge(e.target.value);
    }
    let staticProp = { key: element, value: e.target.value, metaType: 1 };
    setStaticProps(staticProps.concat(staticProp));
  };
  const handleChange = (event) => {
    setStaticProps(staticProps.concat({ key: "Language", value: event.target.value, metaType: 1 }));
    setSelectLang(event.target.value);
  };
  const saveData = () => {
    let quest = {};
    const shdec = convertToRaw(shortDescription.getCurrentContent());
    const lodec = convertToRaw(longDescription.getCurrentContent());
    const shortVal = shdec.blocks.some((e) => {
      return e.text.trim() !== "";
    });
    const longVal = lodec.blocks.some((e) => {
      return e.text.trim() !== "";
    });
    if (
      (questions_.questionDescription !== "" && questions_.questionDescription !== undefined) ||
      (questions_.question !== "" && questions_.question !== undefined) ||
      answers_.length > 0 ||
      (answer !== "" && answer !== undefined)
    ) {
      quest.error = `Please click "Save Question" button to finish adding a question`;

      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
            Please click "Save Question" button to finish adding a question
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )




    }
    let dError = {};
    if (!longVal) {
      longDescriptionRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      dError.long = " text required";
    } else {
      dError.long = "";
    }
    if (!shortVal) {
      dError.short = "text required";
      shortDescriptionRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    } else {
      dError.short = "";
    }
    setDescError(dError);
    if (shortVal == true && longVal == true) {
      dError = {};
      setDescError(dError);
    }
    const propertiesData = staticProps.filter(
      (v, i, a) => a.findLastIndex((v2) => v2.key === v.key) === i
    );
    const datt = propertiesData.map((ele, ind) => ele.key);
    let sec = lessonProprt.filter((x) => !datt.includes(x));
    if (sec.length === 0) {
      setEmpty(true);
      errorLesson = {};
      setErrorProperties(errorLesson);
    } else {
      setEmpty(false);
      sec.map((ele, ind) => {
        propertiesRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        // console.log(ele, " erroor");
        errorLesson[ele] = "required";
        setErrorProperties(errorLesson);
      });
    }
    propertiesData.map((ele, ind) => {
      if (ele.key == "Main Topic") {
        if (ele.key.trim() == "") {
          // console.log("errorsss")
          errorLesson[ele.key] = "Required";
          propertiesRef.current.scrollIntoView();
        } else {
          errorLesson[ele.key] = "";
          topiic = true;
        }
        setErrorProperties(errorLesson);
      } else if (ele.key == "Keywords") {
        if (ele.key.trim() == "") {
          // propertiesRef.current.scrollIntoView()
          errorLesson[ele.key] = "Required";
        } else {
          errorLesson[ele.key] = "";
          keyw = true;
        }
        setErrorProperties(errorLesson);
      } else if (ele.key == "Target Audience Maximal Age") {
        if (ele.value == "") {
          // propertiesRef.current.scrollIntoView()
          errorLesson[ele.key] = "required";
          mage = false;
        } else if (parseInt(ele.value) < parseInt(minAge)) {
          propertiesRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
          errorLesson[ele.key] = "maximum age must be greater than minimum age";
          mage = false;
        } else {
          errorLesson[ele.key] = "";
          mage = true;
        }
        setErrorProperties(errorLesson);
      } else if (ele.key == "Target Audience Minimal Age") {
        if (ele.value == "") {
          // propertiesRef.current.scrollIntoView()
          errorLesson[ele.key] = "required";
          miage = false;
        } else {
          errorLesson[ele.key] = "";
          miage = true;
        }
        setErrorProperties(errorLesson);
      } else if (ele.key == "Duration in minutes") {
        if (ele.value == "") {
          // propertiesRef.current.scrollIntoView()
          errorLesson[ele.key] = "required";
          durat = false;
        } else {
          errorLesson[ele.key] = "";
          durat = true;
        }
        setErrorProperties(errorLesson);
      }
    });
    if (
      sec.length == 0 &&
      mage == true &&
      keyw == true &&
      topiic == true &&
      miage == true &&
      durat == true
    ) {
      errorLesson = {};
      setErrorProperties(errorLesson);
    }
    if (permissions.includes(9)) {
      if (Object.keys(shareChecks).length < 1 || !Object.entries(shareChecks).some(([k, v]) => v)) {
        error_.shareChecks = "Please check atleast one condition!";
      }
    }

    if (name.trim() == "") {
      error_.name = "Required";
      lessonNameRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    } else if (name.length > 50) {
      error_.name = "Name must be less then 50 characters";
    }

    if (shareChecks["sharedWithSpecificPeople"] && shares.length < 1) {
      error_.sharedWithSpecificPeople = "Please add atleast one email and invitee name!";
    }
    debugger;
    // console.log(shareChecks, "shares checks here")
    // console.log(shares,"share in last");
    let check = shares.some((ele) => ele.isDeleted == false)
    //  console.log(check," check true or not")
    if (shareChecks["sharedWithSpecificPeople"] && !check ) {
      error_.sharedWithSpecificPeople = "Please add atleast one email and invitee name!";
    }
    if (
      Object.keys(quest).length == 0 &&
      Object.keys(error_).length == 0 &&
      sec.length == 0 &&
      Object.keys(errorLesson).length == 0 &&
      Object.keys(dError).length == 0
    ) {
      setLoading(true);
      let postData = {};
      postData["contentId"] = state.create || duplicate ? 0 : state?.data.contentId;
      postData["parentContentId"] = duplicate ? state?.data.contentId : 0;
      postData["name"] = name;
      postData["userId"] = state.user?.userId;
      postData["organizationId"] = state.orgId;
      postData["isDuplicate"] = duplicate;
      postData["createdBy"] = state.create ? state.user?.userId : state.data?.createdBy;
      postData["shortDescription"] = JSON.stringify(
        convertToRaw(shortDescription.getCurrentContent())
      );
      postData["properties"] = properties.concat(
        staticProps.filter((v, i, a) => a.findLastIndex((v2) => v2.key === v.key) === i)
      );
      postData["attachments"] = files.map((ele) => {
        return { attachmentKey: ele };
      });
      postData["Questions"] = questions;
      postData["ScratchProject"] = scratchProject;
      postData["fullDescription"] = JSON.stringify(
        convertToRaw(longDescription.getCurrentContent())
      );
      postData["manageSharing"] = permissions.includes(9) ? [shareChecks] : [shareChecks_];
 
      postData["sharingAddresses"] = shareChecks["sharedWithSpecificPeople"] ? shares : shares
      usercontentService
        .CreateUpdateUserContent(postData)
        .then((res) => {
          setLoading(false);

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
          )

          navigate("/dashboard/course-listing");
        })
        .catch((err) => {
          setLoading(false);
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

        });
    }
    setError(error_);
    setCopy(false);
  };
  useEffect(() => {
    if (fileName != "" && !load) {
      let _file = files.concat(fileName);
      handleAttachment(_file, false);
      setFiles(_file);
    }
  }, [load]);
  const handleAttachment = (arr, status) => {
    var attachemnts = arr.map((ele) => {
      return Bucket.promisesOfS3Objects(status ? ele.attachmentKey : ele)
        .then((data) => {
          return data;
        })
        .catch(function (err) {
          return ele;
        });
    });
    Promise.all(attachemnts).then((data) => {
      setAttachments(data);
    });
  };
  // useEffect(()=>{
  //   console.log(state, "state data in course detail")
  // },[])
  useEffect(() => {
    if (!state.create) {
      // console.log(state?.data.sharingAddresses," sharing address in state navigate")
      const convertedStateLongDescription = convertFromRaw(JSON.parse(state?.data.longDescription));
      setLongDescription(() => EditorState.createWithContent(convertedStateLongDescription));
      const convertedStateShortDescription = convertFromRaw(
        JSON.parse(state?.data.shortDescription)
      );
      setShortDescription(() => EditorState.createWithContent(convertedStateShortDescription));
      setProperties(state?.data.properties);
      setQuestions(state?.data?.questions);
      setScratchProject(state?.data.scratchProject);
      setShareChecks(state?.data.manageSharing[0]);
      setShares(state?.data.sharingAddresses);
      handleAttachment(state?.data.attachments, true);
    }
  }, []);

  const handleEdit = () => {
    setReadOnly(false);
    let languageSelect = state?.data.properties.filter((ele, ind) => {
      return ele.key == "Language";
    });

    setSelectLang(languageSelect[0].value);

    setStaticProps(state?.data.properties.filter((ele) => _staticProps.indexOf(ele.key) > -1));
    setProperties(state?.data.properties.filter((ele) => !(_staticProps.indexOf(ele.key) > -1)));
    setQuestions(state?.data?.questions);
    setScratchProject(state?.data.scratchProject);
  };

  const getProperty = () => {
    let resourceError = {};
    if (property["value"].trim() == "") {
      resourceError.valuue = "Required";
      setResError(resourceError);
    }
    else {
      try {
        let newLink = new URL(property.value);

        let result = newLink.protocol === "http:" || newLink.protocol === "https:";
        if (!result) {
          // error.link = " only allow http or https protocols";
          resourceError.valuue = " only allow http or https protocols";
          setResError(resourceError);
        }
      } catch (err) {
        resourceError.valuue = " Link not valid";
        setResError(resourceError);
      }
    }
    if (property["key"].trim() == "") {
      resourceError.keyy = "Required";
      setResError(resourceError);
    }
    if (Object.keys(resourceError).length === 0) {
      let _propet = property;
      _propet["metaType"] = 2;
      setProperties(properties.concat(_propet));
      setProperty({
        key: "",
        value: "",
      });
      resourceError = {};
      setResError(resourceError);
    }
  };

  const getShared = () => {
    if (shared["email"] == "") {
      setError({ ...error, email: "required" });
    } else if (!isEmail(shared["email"])) {
      setError({ ...error, email: "Invalid Email" });
    } else if (shared["name"] == "") {
      setError({ ...error, name: "required" });
    } else if (shares.some((data) => data.email == shared["email"])) {
      setError({ ...error, email: "Email Already Exists" });
    } else {

      shared.userContentSpecificUsersPermissionId = 0
      shared.hasAccess = true;
      shared.isDeleted=false;
      let _shared = shares.concat(shared);
      // console.log(_shared," check share in if block during creation")
      setShares(_shared);
    }

  
    // console.log(shares,"check shares array ")
  };
  const handleDuplicate = () => {

    if (state?.data?.hasAccess || (parseInt(state?.data?.userId) == parseInt(state?.user?.userId))) {
      let languageSelect = state?.data.properties.filter((ele, ind) => {
        return ele.key == "Language";
      });

      setSelectLang(languageSelect[0].value);
      setName("copy of ".concat(name));
      setDuplicate(true);
      setReadOnly(false);

      setStaticProps(state?.data.properties.filter((ele) => _staticProps.indexOf(ele.key) > -1));
      setProperties(state?.data.properties.filter((ele) => !(_staticProps.indexOf(ele.key) > -1)));
      setQuestions(state?.data?.questions);
      setScratchProject(state?.data.scratchProject);
      setShareChecks({});
    } else {


      toast.error(
        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
          <MKTypography variant="contained" color="secondary">
            You do not have access to view this full lesson, to duplicate your own copy, you first need to ask the owner for access
          </MKTypography>
        </MKBox>,
        {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
        }
      )



    }


  };
  const handlePrivate = (e) => {
    if (e.target.checked)
      setShareChecks({
        ...shareChecks,
        isPrivate: e.target.checked,
        sharedWithSpecificPeople: false,
      });
    else setShareChecks({ ...shareChecks, isPrivate: e.target.checked });
  };
  const handleShareWithMyOrg = (e) => {
    if (!e.target.checked)
      setShareChecks({
        ...shareChecks,
        shareToMyOgranizations: e.target.checked,
        shareAlsoWithStudentsOfMyOgranizations: false,
      });
    else setShareChecks({ ...shareChecks, shareToMyOgranizations: e.target.checked });
  };
  const handleShareWithAllOrg = (e) => {
    if (!e.target.checked)
      setShareChecks({
        ...shareChecks,
        shareToAllOgranizations: e.target.checked,
        shareAlsoWithStudentsOfAllOgranizations: false,
      });
    else setShareChecks({ ...shareChecks, shareToAllOgranizations: e.target.checked });
  };
  const handleNumberType = (event) => {
    var invalidChars = ["-", "+", "e"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };
  const handleDownload = (index, fileName) => {
    const link = document.createElement("a");
    link.href = attachments[index];
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(attachments[index]);
  };

  const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  const deleteProp = (item) => setProperties(properties.filter((ele) => ele != item));
  const deleteFile = (item) => setFiles(files.filter((ele) => ele != item));
  const deleteShared = (item) => {
    let deleteEmail = shares.filter((ele) => {
      if (ele.email == item.email) {
        if (ele.userContentSpecificUsersPermissionId !== 0) {
          ele.isDeleted = true;
          return  true;
        }else{
          return false
        }
      }
      else {
        // console.log(ele," remove access")
     
          return true
        
      }
    })
    // console.log(deleteEmail)
    setShares(deleteEmail)


  };
  const updateShared = (item) => {
    //  console.log(shares)
    let update = shares.map((ele) => {
      if (ele.email == item.email) {
        ele.hasAccess = !ele.hasAccess;
        return ele
      }
      else {
        return ele
      }

    })
    setShares(update);

  }
  const handleAnswers = () => {
    if (answer == "" || answer == undefined) {
      setQuestionsError({ ...QuestionsError, Answers: "required" });
    } else {
      setAnswers_([...answers_, answer]);
      setQuestions_({ ...questions_, answers: [...answers_, answer] });
      setAnswer("");
    }
  };
  const deleteQuestions = (data) => setQuestions(questions.filter((ele) => ele != data));
  const deleteScratchProject = (data) =>
    setScratchProject(scratchProject.filter((ele) => ele != data));
  const handleQuestions = () => {
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
      }
    }
    if (Object.keys(errorQuestion).length == 0) {
      setQuestions(questions.concat(questions_));
      setQuestions_({
        questionDescription: "",
        question: "",
      });
      setAnswers_([]);
    }
  };
  const handleSwitchChange = (e) => {
    setChecked(e.target.checked);
    setQuestions_({ ...questions_, isMultiSelect: !checked });
  };

  const AddScratchProject = () => {
    let error = {};
    if (scratch.link == "" || scratch.link == undefined) {
      error.link = "required";
      setScratchError(error);
    }
    else {
      try {
        let newLink = new URL(scratch.link);

        let result = newLink.protocol === "http:" || newLink.protocol === "https:";
        if (!result) {
          error.link = " only allow http or https protocols";
          setScratchError(error);
        } else {
          if (!(newLink.hostname === "scratch.mit.edu")) {
            error.link = "host name wrong";
            setScratchError(error);
          }
        }
      } catch (err) {
        error.link = "link not valid";
        setScratchError(error);
      }
    }
    if (scratch.name == "" || scratch.name == undefined) {
      error.name = "required";
      setScratchError(error);
    }



    if (Object.keys(error).length == 0) {
      setScratchProject([...scratchProject, scratch]);
      setScratch({
        name: "",
        link: "",
      });
    }
  };
  const SubmitNameEmail = () => {
    let err_ = {};
    if (accessEmail == "" || accessEmail == undefined) {
      err_.email = "required";
      // setErrors(err_)
    } else if (!isEmail(accessEmail)) {
      err_.email = "provide valid email";
      // setErrors(err_)
    }
    if (accessName == "" || accessName == undefined) {
      err_.name = "required";
      // setErrors(err_)
    }
    setErrors(err_);
    if (Object.keys(err_).length == 0) {
      let request = {
        "name": accessName,
        "email": accessEmail,
        "contentId": accessContentId
      }
      usercontentService.AddRequestToAccessLesson(request).then((res) => {



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
        )

        setAccessEmail("")
        setAccessName("")
        setOpenModal(false)
      }).catch((err) => {
        // console.log(err, "error")


        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
              {err.response.data.message}
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )



        setAccessEmail("")
        setAccessName("")
        setOpenModal(false)
      })
    }
  };
  const handleAccessRequest = (state_) => {

    // console.log(state,"state data in handle  Acess")
    if (user?.userId) {
      let request = {
        "requestedBy": state_?.user?.userId,
        "contentId": state_.data.contentId,
        "organizationId": state_?.orgId,
        "name": "",
        "email": "",
      }
      usercontentService.AddRequestToAccessLesson(request).then((res) => {

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
        )



      }).catch((err) => {



        toast.error(
          <MKBox sx={{ display: "flex", justifyContent: "center" }}>
            <MKTypography variant="contained" color="secondary">
              {err.response.data.message}
            </MKTypography>
          </MKBox>,
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: false,
          }
        )


      })
    }
    else {
      setOpenModal(true)
      setAccessContentId(state_?.data?.contentId)
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
      <ArrowBackIcon
        style={{ cursor: "pointer", color: "#318BEC", height: "50px", width: "50px" }}
        onClick={(e) => navigate("/dashboard/course-listing")}
      />
      <Divider style={{ height: "3px" }} />
      <Grid container spacing={3}>
        <Grid item xs={7}>
          {!readOnly || state.create ? (
            <Grid display="flex" flexDirection={"column"} alignItems={"flex-start"}>
              <MKBox>
                <MKInput
                  defaultValue={name || ""}
                  label="Lesson Name"
                  ref={lessonNameRef}
                  value={name}
                  onChange={handleName}
                  required
                />
                {"name" in error ? (
                  <MKTypography
                    fontSize="0.75rem"
                    color="error"
                    style={{ display: "block" }}
                    textGradient
                  >
                    {error["name"]}
                  </MKTypography>
                ) : null}
              </MKBox>
            </Grid>
          ) : (
            <>
              <ListItem alignItems="flex-start" style={{ height: 100 }}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={name}
                  secondary={
                    <MKTypography component={"span"} className="org-desc">
                      <strong>By:</strong>{" "}
                      {state?.data?.createdByDetails?.firstName +
                        " " +
                        state?.data?.createdByDetails?.lastName}
                    </MKTypography>
                  }
                />
              </ListItem>
              <MKAvatar alt="Remy Sharp" size="lg" src={state?.data.logo} />
            </>
          )}
        </Grid>
        {state?.data?.isDuplicated && (
          <Grid item xs={2} display="flex">
            <Grid container flexDirection="column" justifyContent={"center"}>
              <MKTypography component={"p"} className="org-desc">
                <strong>Duplicated From LessonName:</strong> {state?.data?.duplicatedFromLessonName}
              </MKTypography>
              <MKTypography component={"p"} className="org-desc">
                <strong>Duplicated From:</strong>{" "}
                {state?.data?.duplicatedFrom?.firstName +
                  " " +
                  state?.data?.duplicatedFrom?.lastName}
              </MKTypography>
            </Grid>
          </Grid>
        )}
        {state.create ? null : (
          <Grid item xs={2} display="flex">
            <Grid container flexDirection="column" justifyContent={"center"}>
              {!duplicate && state.user && (
                <MKButton variant="gradient" color="info" onClick={handleDuplicate}>
                  Duplicate
                </MKButton>
              )}
              {readOnly &&
                ((permissions.includes(3) && state.data.organizationId == state.orgId) ||
                  state.user?.isPlatformAdmin ||
                  state?.data?.userId === state?.user?.userId) ? (
                <MKButton
                  variant="gradient"
                  color="info"
                  sx={{ marginTop: "5px" }}
                  onClick={handleEdit}
                >
                  Edit
                </MKButton>
              ) : null}
            </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <Paper elevation={2}>
            <MKBox sx={{ padding: "20px" }} ref={shortDescriptionRef}>
              <MKTypography variant="h6" mb={2}>
                Lesson Short High Level Description
              </MKTypography>
              <TextEditor
                editorState={shortDescription}
                setEditorState={setShortDescription}
                readOnly={state.create ? false : readOnly}
              />
              {"short" in descError ? (
                <MKTypography
                  fontSize="0.75rem"
                  color="error"
                  style={{ display: "block" }}
                  textGradient
                >
                  {descError["short"]}
                </MKTypography>
              ) : null}
            </MKBox>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2}>
            <MKBox sx={{ padding: "20px" }} ref={propertiesRef}>
              <MKTypography variant="h6" mb={2}>
                Lesson Properties
              </MKTypography>
              {!readOnly || state.create ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    {_staticProps.map((ele, index) => {
                      return (
                        <Grid container paddingBottom={2} key={index}>
                          <Grid item xs={6} md={6}>
                            <MKTypography variant="caption">
                              <strong>{ele}:</strong>{" "}
                            </MKTypography>
                          </Grid>
                          <Grid item xs={6} md={6}>
                            {ele == "Language" ? (
                              <FormControl sx={{ minWidth: "calc(100%)", maxWidth: 300 }}>
                                <InputLabel id="demo-simple-select-autowidth-label">
                                  Languages*
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-autowidth-label"
                                  id="demo-simple-select-autowidth"
                                  onChange={handleChange}
                                  defaultValue={
                                    staticProps.find(({ key }) => key === ele)?.value || ""
                                  }
                                  value={selectLang}
                                  onBlur={(e) => {
                                    e.target.value == ""
                                      ? setErrorProperties({
                                        ...errorProperties,
                                        Language: "Required",
                                      })
                                      : setErrorProperties({ ...errorProperties, Language: "" });
                                  }}
                                  autoWidth
                                  required
                                  label="Languages"
                                >
                                  {Languages_.map((ele, i) => {
                                    return (
                                      <MenuItem key={i} value={ele.name} open={open}>
                                        {ele.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            ) : ele == "Target Audience Minimal Age" ||
                              ele == "Target Audience Maximal Age" ||
                              ele == "Duration in minutes" ? (
                              <MKInput
                                defaultValue={
                                  staticProps.find(({ key }) => key === ele)?.value || ""
                                }
                                label={ele}
                                required
                                type="number"
                                InputProps={{ inputProps: { min: 1 } }}
                                onKeyDown={(evt) =>
                                  ["e", "E", "+", "-", "."].includes(evt.key) &&
                                  evt.preventDefault()
                                }
                                fullWidth
                                onChange={(e) => handleStaticProps(ele, e)}
                              />
                            ) : (
                              <MKInput
                                defaultValue={
                                  staticProps.find(({ key }) => key === ele)?.value || ""
                                }
                                label={ele}
                                type="text"
                                required
                                fullWidth
                                onChange={(e) => handleStaticProps(ele, e)}
                              />
                            )}
                            {ele in errorProperties ? (
                              <MKTypography
                                fontSize="0.75rem"
                                color="error"
                                style={{ display: "block", color: "blue" }}
                                textGradient
                              >
                                {errorProperties[ele]}
                              </MKTypography>
                            ) : null}
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <MKTypography variant="h6" mb={2}>
                      Resources
                    </MKTypography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MKInput
                      // variant="standard"
                      // value={property["caption"]}
                      label="Description"
                      // InputLabelProps={{ shrink: true }}
                      fullWidth
                      value={property.key}
                      onChange={(e) => {
                        setProperty({ ...property, key: e.target.value });
                      }}
                    />
                    {"keyy" in resError ? (
                      <MKTypography
                        fontSize="0.75rem"
                        color="error"
                        style={{ display: "block" }}
                        textGradient
                      >
                        {resError.keyy}
                      </MKTypography>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MKInput
                      // variant="standard"
                      // value={property["value"]}
                      label="Link"
                      value={property.value}
                      // InputLabelProps={{ shrink: true }}
                      fullWidth
                      onChange={(e) => setProperty({ ...property, value: e.target.value })}
                    />
                    {"valuue" in resError ? (
                      <MKTypography
                        fontSize="0.75rem"
                        color="error"
                        style={{ display: "block" }}
                        textGradient
                      >
                        {resError.valuue}
                      </MKTypography>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MKButton variant="gradient" color="info" onClick={getProperty}>
                      Add
                    </MKButton>
                  </Grid>
                </Grid>
              ) : null}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <List sx={{ width: "100%", bgcolor: "background.paper" }} aria-label="contacts">
                    {properties.map((data, index) => (
                      <ListItem key={index}>
                        <ListItemButton>
                          <ListItemIcon>
                            <StarIcon />
                          </ListItemIcon>
                          <ListItemText
                            secondary={
                              <span>
                                <strong>{data.key}: </strong>
                                <a href={data.value}>{data.value}</a>
                                {/* {data.value}{" "} */}
                                {(!readOnly || state.create) && (
                                  <DeleteIcon
                                    onClick={() => deleteProp(data)}
                                    sx={{ marginLeft: "10px", cursor: "pointer" }}
                                  />
                                )}
                              </span>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </MKBox>
          </Paper>
        </Grid>

        {(readOnly && !state.create &&
          (!state?.data?.hasAccess && (parseInt(state?.data?.userId) !== parseInt(state?.user?.userId)))) ?
          (
            // &&
            // parseInt(state.user?.userId) != parseInt(state.data?.userId) &&
            // state.user &&
            //  (
            <Grid item xs={12} display="flex" justifyContent={"center"}>
              <MKButton variant="gradient" color="info" onClick={() => handleAccessRequest(state)}>
                Ask the owner for access
              </MKButton>
            </Grid>
          ) : (
            // )
            <>
              <Grid item xs={12}>
                <MKTypography variant="h4" mb={2}>
                  Activities
                </MKTypography>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2}>
                  <MKBox sx={{ padding: "20px" }}>
                    <MKTypography variant="h6" mb={2}>
                      List of Attachments (files)
                    </MKTypography>
                    <Grid container spacing={3}>
                      {!readOnly || state.create ? (
                        <Grid item xs={12} md={4}>
                          <UploadToS3WithNativeSdk
                            setLoad={setLoad}
                            setFileName={setFileName}
                            fileType="document"
                            title="Add Attachment"
                          />
                        </Grid>
                      ) : null}

                      <Grid item xs={12}>
                        <List
                          sx={{ width: "100%", bgcolor: "background.paper" }}
                          aria-label="contacts"
                        >
                          {files.map((data, index) => (
                            <Grid container key={index}>
                              <Grid item xs={12} lg={8}>
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <StarIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    secondary={
                                      <span>
                                        <strong>{data}</strong>
                                        {(!readOnly || state.create) && (
                                          <DeleteIcon
                                            onClick={() => deleteFile(data)}
                                            sx={{ marginLeft: "10px", cursor: "pointer" }}
                                          />
                                        )}
                                      </span>
                                    }
                                  />
                                </ListItem>
                              </Grid>
                              <Grid>
                                {readOnly && (
                                  <MKButton
                                    variant="gradient"
                                    color="info"
                                    sx={{ marginTop: "10px" }}
                                    onClick={() => handleDownload(index, data)}
                                  >
                                    Download
                                  </MKButton>
                                )}
                              </Grid>
                            </Grid>
                          ))}
                        </List>
                      </Grid>
                    </Grid>
                  </MKBox>
                </Paper>
              </Grid>
              {!readOnly || state.create ? (
                <Grid item xs={12}>
                  <Paper elevation={2}>
                    <MKBox sx={{ padding: "20px" }}>
                      <MKTypography variant="h6" mb={2}>
                        Questions
                      </MKTypography>

                      <Grid item xs={12} md={5}>
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
                          // InputLabelProps={{ shrink: true }}s
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
                          return (
                            <Grid display="flex">
                              <li>{ele}</li>
                              {(!readOnly || state.create) && (
                                <DeleteIcon
                                  onClick={() =>
                                    setAnswers_(answers_.filter((element) => element !== ele))
                                  }
                                  sx={{ marginLeft: "10px", marginTop: "5px", cursor: "pointer" }}
                                />
                              )}
                            </Grid>
                          );
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
                      <Grid item xs={12} display="flex" justifyContent={"center"}>
                        <MKButton variant="gradient" color="info" onClick={handleQuestions}>
                          Save Question(s)
                        </MKButton>
                      </Grid>
                    </MKBox>
                    {questions?.map((ele, i) => {
                      return (
                        <Grid key={i} sx={{ padding: "20px" }}>
                          <MKButton
                            variant="gradient"
                            color="error"
                            onClick={() => deleteQuestions(ele)}
                          >
                            Delete
                          </MKButton>
                          <Grid display="flex">
                            <MKTypography>
                              <strong>Question:</strong>&nbsp;&nbsp;
                            </MKTypography>
                            <MKTypography>{ele.question}</MKTypography>
                          </Grid>
                          <Grid display="flex">
                            <MKTypography>
                              <strong>Question Description: </strong> &nbsp;&nbsp;
                            </MKTypography>
                            <MKTypography>{ele.questionDescription}</MKTypography>
                          </Grid>
                          <Grid>
                            <MKTypography>
                              {" "}
                              <strong>Answers: </strong>{" "}
                            </MKTypography>

                            {ele.answers?.map((ele, ind) => {
                              return <li key={ind}>{ele}</li>;
                            })}
                          </Grid>
                          <Grid display="flex">
                            <MKTypography variant="h6">
                              {" "}
                              {ele.isMultiSelect ? "MultiSelect" : "Single Select"}{" "}
                            </MKTypography>
                          </Grid>
                          <Divider style={{ height: "3px" }} />
                        </Grid>
                      );
                    })}
                  </Paper>
                </Grid>
              ) : // {
                //   state?.data?.questions?.length>0?
                // }
                state?.data?.questions?.length > 0 ? (
                  <Grid item xs={12}>
                    <Paper elevation={2}>
                      <MKBox sx={{ padding: "20px" }}>
                        {state?.data?.questions?.map((ele, index) => {
                          return (
                            <>
                              <MKTypography>
                                <strong>Question Description: </strong>&nbsp;&nbsp;
                                {ele.questionDescription}
                              </MKTypography>
                              <MKTypography>
                                <strong>Question: {ele.question} </strong>&nbsp;&nbsp;{ele.question}
                              </MKTypography>
                              <MKTypography>
                                <strong>Answers: </strong>
                              </MKTypography>
                              {ele?.answers?.map((element) => {
                                return <li>{element}</li>;
                              })}
                              <MKTypography>
                                <strong>{ele.isMultiSelect ? "MultiSelect" : "Single Select"} </strong>
                              </MKTypography>
                              <Divider style={{ height: "3px" }} />
                            </>
                          );
                        })}
                      </MKBox>
                    </Paper>
                  </Grid>
                ) : null}

              {!readOnly || state.create ? (
                <Grid item xs={12}>
                  <Paper elevation={2}>
                    <MKBox sx={{ padding: "20px" }}>
                      <MKTypography variant="h6" mb={2}>
                        Scratch Project
                      </MKTypography>
                      <Grid item xs={12} md={8} display="flex" mb={2}>
                        <Grid>
                          <MKInput
                            // variant="standard"
                            value={scratch.name}
                            label="Name of Scratch Project"
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            // value={property.key}
                            onChange={(e) => {
                              setScratch({ ...scratch, name: e.target.value });
                              setScratchError({ ...ScratchError, name: "" });
                            }}
                          />
                          {"name" in ScratchError ? (
                            <MKTypography
                              fontSize="0.75rem"
                              color="error"
                              style={{ display: "block" }}
                              textGradient
                            >
                              {ScratchError.name}
                            </MKTypography>
                          ) : null}
                        </Grid>
                        <Grid>
                          <MKInput
                            sx={{ marginLeft: 2 }}
                            // variant="standard"
                            value={scratch.link}
                            label="Link embedded code for scratch Project"
                            // InputLabelProps={{ shrink: true }}
                            fullWidth
                            // value={property.key}
                            onChange={(e) => {
                              setScratch({ ...scratch, link: e.target.value.replace(/\/$/, '') });
                              setScratchError({ ...ScratchError, link: "" });
                            }}
                          />
                          {"link" in ScratchError ? (
                            <MKTypography
                              fontSize="0.75rem"
                              color="error"
                              style={{ display: "block", marginLeft: "20px" }}
                              textGradient
                            >
                              {ScratchError.link}
                            </MKTypography>
                          ) : null}
                        </Grid>
                      </Grid>
                      <MKButton variant="gradient" color="info" onClick={AddScratchProject}>
                        Add Project
                      </MKButton>
                    </MKBox>
                    {scratchProject.map((ele, ind) => {
                      return (
                        <Grid key={ind} sx={{ padding: "20px" }}>
                          <MKButton
                            variant="gradient"
                            color="error"
                            onClick={() => deleteScratchProject(ele)}
                          >
                            Delete
                          </MKButton>
                          <MKTypography>
                            <strong>Name: </strong> {ele.name}
                          </MKTypography>

                          <MKTypography>
                            {" "}
                            <strong>Link: </strong>{" "}
                            <a href={ele.link} target="_blank">
                              {ele.link}
                            </a>
                          </MKTypography>

                          <Divider style={{ height: "3px" }} />
                        </Grid>
                      );
                    })}
                  </Paper>
                </Grid>
              ) : state?.data?.scratchProject?.length > 0 ? (
                <Grid item xs={12}>
                  <Paper elevation={2}>
                    <MKBox sx={{ padding: "20px" }}>
                      {state?.data?.scratchProject?.map((ele, index) => {
                        return (
                          <>
                            <MKTypography>
                              <strong>Scratch Project </strong>
                            </MKTypography>
                            <MKTypography>
                              <strong>name: </strong>
                              {ele.name}
                            </MKTypography>
                            <MKTypography>
                              <strong>link: </strong>
                              {ele.link}
                            </MKTypography>
                            <Divider style={{ height: "3px" }} />
                          </>
                        );
                      })}
                    </MKBox>
                  </Paper>
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <Paper elevation={2}>
                  <MKBox sx={{ padding: "20px" }} ref={longDescriptionRef}>
                    <MKTypography variant="h6" mb={2}>
                      Lesson Full Description
                    </MKTypography>
                    <TextEditor
                      editorState={longDescription}
                      setEditorState={setLongDescription}
                      readOnly={state.create ? false : readOnly}
                    />
                    {"long" in descError ? (
                      <MKTypography
                        fontSize="0.75rem"
                        color="error"
                        style={{ display: "block" }}
                        textGradient
                      >
                        {descError["long"]}
                      </MKTypography>
                    ) : null}
                  </MKBox>
                </Paper>
              </Grid>
              <Grid items sx={4}></Grid>
              {!readOnly || state.create || permissions.includes(9) ? (
                <Grid item xs={12}>
                  {(permissions?.includes(9) && (!readOnly || state.create)) ||
                    state.user?.isPlatformAdmin ? (
                    <Paper elevation={2}>
                      <MKBox sx={{ padding: "20px" }}>
                        <MKTypography variant="h6" mb={2}>
                          Manage Sharing
                        </MKTypography>
                        {"shareChecks" in error ? (
                          <MKTypography
                            fontSize="0.75rem"
                            color="error"
                            style={{ display: "block" }}
                            textGradient
                          >
                            {error["shareChecks"]}
                          </MKTypography>
                        ) : null}
                        <MKTypography variant="caption" mb={2}>
                          This section is only visible for you as the owner of this lesson
                        </MKTypography>
                        <FormGroup>
                          <FormControlLabel
                            disabled={
                              shareChecks["shareToAll"] ||
                              shareChecks["shareToMyOgranizations"] ||
                              shareChecks["shareToAllOgranizations"]
                            }
                            control={
                              <Checkbox
                                defaultChecked={shareChecks["isPrivate"]}
                                onChange={handlePrivate}
                              />
                            }
                            label="Private"
                          />
                          <MKBox display="flex">
                            <FormControlLabel
                              disabled={
                                shareChecks["isPrivate"] ||
                                shareChecks["shareToAll"] ||
                                shareChecks["shareToAllOgranizations"]
                              }
                              control={
                                <Checkbox
                                  defaultChecked={shareChecks["shareToMyOgranizations"]}
                                  onChange={handleShareWithMyOrg}
                                />
                              }
                              label="Share to my organization"
                            />
                            {shareChecks["shareToMyOgranizations"] && (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      shareChecks["shareAlsoWithStudentsOfMyOgranizations"] || false
                                    }
                                    onChange={(e) =>
                                      setShareChecks({
                                        ...shareChecks,
                                        shareAlsoWithStudentsOfMyOgranizations: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Share also with students"
                              />
                            )}
                          </MKBox>
                          <MKBox display="flex">
                            <FormControlLabel
                              disabled={
                                shareChecks["isPrivate"] ||
                                shareChecks["shareToAll"] ||
                                shareChecks["shareToMyOgranizations"]
                              }
                              control={
                                <Checkbox
                                  defaultChecked={shareChecks["shareToAllOgranizations"]}
                                  onChange={handleShareWithAllOrg}
                                />
                              }
                              label="Share to all organizations"
                            />
                            {shareChecks["shareToAllOgranizations"] && (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      shareChecks["shareAlsoWithStudentsOfAllOgranizations"] || false
                                    }
                                    onChange={(e) =>
                                      setShareChecks({
                                        ...shareChecks,
                                        shareAlsoWithStudentsOfAllOgranizations: e.target.checked,
                                      })
                                    }
                                  />
                                }
                                label="Share also with students"
                              />
                            )}
                          </MKBox>

                          <FormControlLabel
                            disabled={
                              shareChecks["isPrivate"] ||
                              shareChecks["shareToMyOgranizations"] ||
                              shareChecks["shareToAllOgranizations"]
                            }
                            control={
                              <Checkbox
                                defaultChecked={shareChecks["shareToAll"]}
                                onChange={(e) =>
                                  setShareChecks({ ...shareChecks, shareToAll: e.target.checked })
                                }
                              />
                            }
                            label="Share to all [also non-registered users]"
                          />
                        </FormGroup>
                        <Divider style={{ height: "3px" }} />
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <FormControlLabel
                              disabled={shareChecks["isPrivate"] || shareChecks["shareToAll"]}
                              control={
                                <Checkbox
                                  checked={
                                    shareChecks["isPrivate"]
                                      ? false
                                      : shareChecks["sharedWithSpecificPeople"] || false
                                  }
                                  onChange={(e) =>
                                    setShareChecks({
                                      ...shareChecks,
                                      sharedWithSpecificPeople: e.target.checked,
                                    })
                                  }
                                />
                              }
                              label="Shared with specific people"
                            />
                          </Grid>
                          {shareChecks["sharedWithSpecificPeople"] && (
                            <>
                              <Grid item xs={12} md={3}>
                                <MKInput
                                  // variant="standard"
                                  label="Email"
                                  // InputLabelProps={{ shrink: true }}

                                  fullWidth
                                  onChange={(e) => {
                                    setShared({ ...shared, email: e.target.value });
                                    setError({ ...error, email: "" });
                                  }}
                                />
                                {"email" in error ? (
                                  <MKTypography
                                    fontSize="0.75rem"
                                    color="error"
                                    style={{ display: "block" }}
                                    textGradient
                                  >
                                    {error["email"]}
                                  </MKTypography>
                                ) : null}{" "}
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <MKInput
                                  // variant="standard"
                                  label="Invitee Name"
                                  // InputLabelProps={{ shrink: true }}
                                  fullWidth
                                  required
                                  onChange={(e) => {
                                    setShared({ ...shared, name: e.target.value });
                                    setError({ ...error, name: "" });
                                  }}
                                />
                                {"name" in error ? (
                                  <MKTypography
                                    fontSize="0.75rem"
                                    color="error"
                                    style={{ display: "block" }}
                                    textGradient
                                  >
                                    {error["name"]}
                                  </MKTypography>
                                ) : null}
                              </Grid>

                              <Grid item xs={12} md={3}>
                                <MKButton variant="gradient" color="info" onClick={getShared}>
                                  Share
                                </MKButton>
                              </Grid>

                              <Grid item xs={12}>
                                <MKTypography variant="caption" fontWeight="bold" mb={2}>
                                  List of People Shared with by email:
                                </MKTypography>
                                {"sharedWithSpecificPeople" in error ? (
                                  <MKTypography
                                    fontSize="0.75rem"
                                    color="error"
                                    style={{ display: "block" }}
                                    textGradient
                                  >
                                    {error["sharedWithSpecificPeople"]}
                                  </MKTypography>
                                ) : null}
                                <List
                                  sx={{ width: "100%", bgcolor: "background.paper" }}
                                  aria-label="contacts"
                                >
                                  {shares.map((data, index) => (
                                    <ListItem key={index} disabled={data.isDeleted == true}>
                                      <ListItemButton>
                                        <ListItemIcon>
                                          <StarIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                          secondary={
                                            <span>
                                              {data.email}, <strong>{data.name} </strong>{" "}
                                              <MKButton
                                                onClick={() => updateShared(data)}
                                                sx={{ marginLeft: "20px" }}
                                                variant="gradient"
                                                color="info"
                                                // disabled={data.hasAccess==undefined}
                                                disabled={data.userContentSpecificUsersPermissionId == 0}
                                              >
                                                {data.hasAccess ? "Remove Access" : "Give Access"}
                                              </MKButton>
                                              <MKButton
                                                onClick={() => deleteShared(data)}
                                                sx={{ marginLeft: "20px" }}
                                                variant="gradient"
                                                color="error"
                                              >
                                                Delete
                                              </MKButton>
                                            </span>
                                          }
                                        />
                                      </ListItemButton>
                                    </ListItem>
                                  ))}
                                </List>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </MKBox>
                    </Paper>
                  ) : null}
                </Grid>
              ) : null}
              {!readOnly || state.create ? (
                <Grid item xs={12} display="flex" justifyContent={"flex-end"}>
                  <MKButton variant="gradient" color="info" onClick={saveData}>
                    {laoding ? (
                      <Grid item xs={12} lg={6}>
                        {" "}
                        <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                          <CircularProgress color="inherit" />
                        </MKBox>{" "}
                      </Grid>
                    ) : (
                      "Save"
                    )}
                  </MKButton>
                </Grid>
              ) : null}
            </>
          )}
      </Grid>
      <Modal
        keepMounted
        open={openModal}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <MKBox sx={style}>
          <MKBox mb={2}>
            <MKInput
              type="email"
              variant="standard"
              label="Email"
              value={accessEmail}
              fullWidth
              required
              onChange={(e) => {
                setAccessEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
            />
            {"email" in errors ? (
              <MKTypography
                fontSize="0.7rem"
                color="error"
                style={{ display: "block" }}
                textGradient
              >
                {errors["email"]}
              </MKTypography>
            ) : null}
          </MKBox>
          <MKBox mb={2}>
            <MKInput
              variant="standard"
              label="Name"
              fullWidth
              required
              value={accessName}
              onChange={(e) => {
                setAccessName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
            />
            {"name" in errors ? (
              <MKTypography
                fontSize="0.7rem"
                color="error"
                style={{ display: "block" }}
                textGradient
              >
                {errors["name"]}
              </MKTypography>
            ) : null}
          </MKBox>
          <MKBox>
            <MKButton color="info" variant="gradient" onClick={() => SubmitNameEmail()}>
              Submit
            </MKButton>
          </MKBox>
        </MKBox>
      </Modal>
    </MKBox>
  );
};

export default CourseListing;
