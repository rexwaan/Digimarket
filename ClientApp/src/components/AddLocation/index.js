import React, { useState, useEffect, useRef } from 'react';
import Modal from '@mui/material/Modal';
import MKBox from "components/MKBox";
import Grid from "@mui/material/Grid";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import CircularProgress from '@mui/material/CircularProgress';
import MKTypography from "components/MKTypography";
import locationService from '../../services/location.service';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AutoComplete = (props) => {

    const [error, setError] = useState("")
    const [location, setNewLocation] = useState("")
    const [loading, setLoading] = useState(false)
    const [description_, setDescription_] = useState("")


    const autoCompleteRef = useRef();
    const inputRef = useRef();
    // const options = {
    //     // componentRestrictions: { country: "ng" },
    fields: ["formatted_address"],
        //     types: ["establishment"]
        // }
        useEffect(() => {
            autoCompleteRef.current = new window.google.maps.places.Autocomplete(
                inputRef.current,
                // options
            );
            autoCompleteRef.current.addListener("place_changed", async function () {
                const place = await autoCompleteRef.current.getPlace();
                setNewLocation(place?.formatted_address)
                setError("")
                console.log({ place });
            });
        }, []);


    const setLocation = () => {
        if (location == "") {
            setError("required")
        }
        else {
            const postRequest = {
                "location": location,
                "details": description_,
                "organizationId": props.orgId,
                "createdBy": props.userId
            }
            setLoading(true)
            locationService.addlocation(postRequest).then((res) => {
                setLoading(false)
                props.setVisible(false)
              


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
             


                toast.success(
                    <MKBox sx={{ display: "flex", justifyContent: "center" }}>
                      <MKTypography variant="contained" color="secondary">
                      {err}
                      </MKTypography>
                    </MKBox>,
                    {
                      position: toast.POSITION.TOP_CENTER,
                      autoClose: false,
                    }
                  )


            })
        }
    }

    return (
        <MKBox sx={style}>
            <MKBox mb={2}>
                {/* <label>enter address :</label>
      <input  /> */}
                <MKInput variant="standard" label="Location" required fullWidth InputProps={{
                    inputProps: { ref: inputRef }, onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            e.stopPropagation();
                        }
                    },
                }} />
                {error !== "" ? <MKTypography

                    fontSize="0.75rem"
                    color="error"
                    style={{ display: "block" }}
                    textGradient
                >
                    {error}
                </MKTypography> : null}
            </MKBox>
            <MKBox mb={2}>
                <TextField
                    id="filled-textarea"
                    label="Description"
                    fullWidth
                    multiline
                    variant="standard"
                    value={description_}
                    onChange={(e) => setDescription_(e.target.value)}
                />
            </MKBox>
            <MKBox mb={2}>
                <MKButton color="info" onClick={setLocation}> {loading ? <CircularProgress color="inherit" size="20px" /> : "Save"} </MKButton>
            </MKBox>
        </MKBox>
    );
};

const AddLocation = (props) => {






    return (
        <Modal
            keepMounted
            open={props.visible}
            onClose={() => props.setVisible(false)}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >

            {/* 
                <MKBox mb={2}> */}
            <AutoComplete  {...props} />
            {/* <MKInput type="text" variant="standard" label="Location" fullWidth required onChange={getLocation} />

                </MKBox>
              
            </MKBox> */}

        </Modal>
    )
}


export default AddLocation
