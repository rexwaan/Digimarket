import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import MKBox from "components/MKBox";
import Divider from '@mui/material/Divider';
import MKTypography from "components/MKTypography";
import Toolbar from '@mui/material/Toolbar';
import { toast, ToastContainer } from 'react-toastify';
import contactService from '../../../../services/contact.service';
import Modal from "@mui/material/Modal";
import MKButton from 'components/MKButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from "@mui/material/Switch";
import "./index.css";
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
function ContactusLog() {

  const [logs, setLogs] = useState([]);
  const orgId = localStorage.getItem("orgId") ? JSON.parse(localStorage.getItem("orgId")) : null;
  const orgName = localStorage.getItem("orgName") ? JSON.parse(localStorage.getItem("orgName")) : null;
  const [visible, setVisible] = useState(false)
  const [contactMessage, setContactMessage] = useState("");
  const handleClose = () => setVisible(false);
  const [checkArchive,setCheckArchive]=useState(false)

  const handleMessege = (messege) => {
    setVisible(true);
    setContactMessage(messege);
  }

const handleDelete=(params)=>{
contactService.DeleteContactUs(params.row.id).then((res)=>{
  contactService.GetContactUsList(orgId,checkArchive).then(res => {
    let logList = []
    res.data.result.map((x => {
      let log = {
        "id": x.contactUsId,
        "firstName": x.firstName,
        "lastName": x.lastName,
        "emailAddress": x.emailAddress,
        "phone": x.phone,
        "topic": x.topic,
        "message": x.message,
        "archive":"Archive",
        "delete":"Delete",
        "isArchived":x.isArchived
      }
      logList.push(log)
    }))
    setLogs(logList)
  })
})
}
const archiveMessage=(params)=>{
  console.log(params," archive params")
  contactService.ArchiveContactUs(params.row.id,!params.row.isArchived).then((res)=>{
    //  console.log(res);
     contactService.GetContactUsList(orgId,checkArchive).then(res => {
      let logList = []
      res.data.result.map((x => {
        let log = {
          "id": x.contactUsId,
          "firstName": x.firstName,
          "lastName": x.lastName,
          "emailAddress": x.emailAddress,
          "phone": x.phone,
          "topic": x.topic,
          "message": x.message,
          "archive":"Archive",
          "delete":"Delete",
          "isArchived":x.isArchived
        }
        logList.push(log)
      }))
      setLogs(logList)
    })
  }).catch((err)=>{
    console.log(err)
  })
}

  const columns = [
    // { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      minWidth: 130,
      flex: 1
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      minWidth: 130,
      flex: 1,
    },
    {
      field: 'emailAddress',
      headerName: 'Email Address',
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      minWidth: 180,
      flex: 1
    },
    {
      field: 'topic',
      headerName: 'Topic',
      minWidth: 100,
      flex: 1
    },
    {
      field: 'message',
      headerName: 'Message',
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return (
          <MKBox>
            {params.row.message ? <Tooltip title="Click To see more" placement="top">
              <MKButton id="messegebtn" onClick={() => handleMessege(params.row.message)}>
                {params.row.message}
              </MKButton></Tooltip> : null}
          </MKBox>

        )
      }

    },
    {
      field: 'archive',
      headerName: '',
      minWidth: 130,
      flex: 1,
      renderCell:(params)=>{
        return(
          <MKBox>
            <MKButton variant="gradient" color="info" onClick={()=>archiveMessage(params)}>{!params.row.isArchived?"Archive":"UnArchive"}</MKButton>
          </MKBox>
        )
      }
    },
    {
      field: 'delete',
      headerName: '',
      minWidth: 130,
      flex: 1,
      renderCell:(params)=>{
        return(
          <MKBox>
            <MKButton variant="gradient" color="error" onClick={()=>handleDelete(params)}>{params.row.delete}</MKButton>
          </MKBox>
        )
      }
    },
     
  ];

  const drawerWidth = 72;

  useEffect(() => {
    contactService.GetContactUsList(orgId,false).then(res => {
      let logList = []
      res.data.result.map((x => {
        let log = {
          "id": x.contactUsId,
          "firstName": x.firstName,
          "lastName": x.lastName,
          "emailAddress": x.emailAddress,
          "phone": x.phone,
          "topic": x.topic,
          "message": x.message,
          "archive":"Archive",
          "delete":"Delete",
          "isArchived":x.isArchived
        }
        logList.push(log)
      }))
      setLogs(logList)
    })
  }, [])

  const handleArchive=(e)=>{
    setCheckArchive(e.target.checked);
    contactService.GetContactUsList(orgId,e.target.checked).then(res => {
      let logList = []
      res.data.result.map((x => {
        let log = {
          "id": x.contactUsId,
          "firstName": x.firstName,
          "lastName": x.lastName,
          "emailAddress": x.emailAddress,
          "phone": x.phone,
          "topic": x.topic,
          "message": x.message,
          "archive":"Archive",
          "delete":"Delete",
           "isArchived":x.isArchived
        }
        logList.push(log)
      }))
      setLogs(logList)
    })
  }

  return (
    <>
      <MKBox
        component="main"
        bgColor="white"
        borderRadius="xl"
        shadow="lg"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, height: "75vh" }}
      >
        <Toolbar />
        <ToastContainer />
        <MKTypography variant="h4">{orgName} Contact us Log</MKTypography>
        <Divider style={{ height: "3px" }} />
        <MKBox style={{display:"flex",justifyContent:"end"}}>
        <MKTypography> Show Archived Messages:</MKTypography>
        
        <Switch
              checked={checkArchive}
              onChange={(e)=>handleArchive(e)}
              inputProps={{ "aria-label": "controlled" }}
            />
        </MKBox>
        <DataGrid
          sx={{ borderRight: 2 }}
          rows={logs}
          columns={columns}
          pageSize={15}
          // rowsPerPageOptions={[5]}
          // checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
        <Modal
          keepMounted
          open={visible}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <MKBox width="100%" style={{ overflowWrap: 'break-word' }} autoComplete="off" sx={style} >
            {contactMessage}
          </MKBox>
        </Modal>
      </MKBox>
    </>
  )
}

export default ContactusLog