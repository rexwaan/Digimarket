import React, { useEffect, useState, useRef } from "react";
import { DocumentViewer } from 'react-documents';
import FileViewer from 'react-file-viewer';
import Grid from "@mui/material/Grid";


const videoExtensions = ["jpeg", "jpg", "png", "gif", "mp4", "mpeg", "mkv"]
const imgExtensions = ["jpeg", "jpg", "png", "gif", "mp4", "mpeg", "mkv"]


const Activity = (props) => {

    const link = localStorage.getItem("activityLink")
    const type = localStorage.getItem("type");

    useEffect(() => {
        const handleTabClose = event => {
          event.preventDefault();
    
          localStorage.setItem("activityLink", "exit");
    
          return (event.returnValue =
            'Are you sure you want to exit?');
        };
    
        window.addEventListener('unload', handleTabClose);
    
        return () => {
          window.removeEventListener('unload', handleTabClose);
        };
      }, []);

    return (
        <Grid display="flex" sx={{ justifyContent: "center" }}>

            {!videoExtensions.includes(type) ?

                <DocumentViewer
                    viewerUrl={'https://docs.google.com/gview?url=%URL%&embedded=true'}
                    url={link}
                    viewer="url"
                    style={{ width: "100%", height: "900px" }}
                >
                </DocumentViewer>
                : !imgExtensions.includes(type) ?
                    <FileViewer
                        fileType={type}
                        filePath={link}
                        errorComponent={(e) => console.log(e)}
                        style={{ width: "100%", height: "720px" }}
                    />
                    :
                    <img style={{ width: "100%", height: "720px" }} src={link} alt={"Image"} />

            }
        </Grid>
    )
}

export default Activity;