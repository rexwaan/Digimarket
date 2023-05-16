import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";



const Resources = (props) => {

    const link = localStorage.getItem("resourceLink")

    useEffect(() => {
        const handleTabClose = event => {
            event.preventDefault();

            localStorage.setItem("resourceLink", "");

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
            <iframe src={link} frameBorder={"0"} allowFullScreen
                style={{ width: "100%", height: "100vh" }} />
        </Grid>
    )
}

export default Resources;