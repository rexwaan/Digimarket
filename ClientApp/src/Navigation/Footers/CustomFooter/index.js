import * as React from 'react';
import MKAvatar from "components/MKAvatar";
import logo_1 from "assets/images/all_logos/logosbeneficaireserasmusright_en_0 web.jpg"
import logo_2 from "assets/images/all_logos/Recurso 17.png"
import logo_3 from "assets/images/all_logos/Recurso 22.png"
import logo_4 from "assets/images/all_logos/Recurso 19.png"
import logo_5 from "assets/images/all_logos/Recurso 21.png"
import logo_6 from "assets/images/all_logos/Recurso 20.png"
import logo_7 from "assets/images/logos/Recurso_15.png"
import logo_8 from "assets/images/all_logos/Recurso 18.png"
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";

function Footer() {
    return (
        <Grid position="fixed" bottom="0" left="0" zIndex="1500" width="100%" >
            <Grid>
                <MKBox
                    sx={
                        {
                            display: "flex",
                            justifyContent: "space-between"
                        }
                    }
                    color="white"
                    bgColor="white"
                    variant="gradient"
                    borderRadius="sm"
                    shadow="inset"
                    opacity={1}
                    p={2}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={3} justifyContent="center" display="flex" >
                            <MKAvatar src={logo_1} sx = {{width:"350px !important"}} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        </Grid>
                        <Grid item xs={2} lg={1}>
                            <MKAvatar src={logo_2} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        </Grid>
                        <Grid item xs={2} lg={1}>
                            <MKAvatar src={logo_3} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        </Grid>
                        <Grid item xs={2} lg={1}>
                            <MKAvatar src={logo_4} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        </Grid>
                        <Grid item xs={2} lg={1}>
                            <MKAvatar src={logo_5} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        </Grid>
                        <Grid item xs={2} lg={1}>
                            <MKAvatar src={logo_6} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        </Grid>
                        <Grid item xs={2} lg={1}>
                            <MKAvatar src={logo_7} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        </Grid>
                        <Grid item xs={12} lg={3} justifyContent="center" display="flex" >
                            <MKAvatar src={logo_8} sx = {{width:"220px !important"}} className="logo_2" variant="square" alt="Avatar" size="lg" />
                        </Grid>
                    </Grid>
                </MKBox>
            </Grid>
        </Grid>
    )
}

export default Footer;