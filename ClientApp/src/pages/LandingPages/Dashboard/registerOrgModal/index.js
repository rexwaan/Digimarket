import React from "react";

import CreateOrgRequest from 'components/createOrgRequest';
import Modal from '@mui/material/Modal';




const ModalPopup = (props) => {
   
    return (
            <CreateOrgRequest {...props} />
    );
}


export default ModalPopup


