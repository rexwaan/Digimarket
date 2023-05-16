

import { useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";
import Dashboard from "./pages/LandingPages/Dashboard"
import CreateOrg from "./pages/LandingPages/OrganizationRequest"
import AcceptRequest from "./pages/LandingPages/Confirm"
import routes from "./routes";

export default function App() {
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {getRoutes(routes)}
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/createOrg" element={<CreateOrg />} /> 
        {["/adduserrequest","/confirm" ].map((path, index) => 
        <Route path={path} element={<AcceptRequest/>} key={index} />
    )}
        
        <Route path="*" element={<Navigate to="/dashboard" />} />
       
      </Routes>
    </ThemeProvider>
  );
}
