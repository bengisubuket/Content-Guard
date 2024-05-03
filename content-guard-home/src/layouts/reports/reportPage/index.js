// ReportPage.js
import React from "react";
import { useLocation } from "react-router-dom";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";


// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import KeywordReport from "layouts/reports/reportPage/components/KeywordReport";

const ReportPage = () => {
    const location = useLocation();
    const id = location.state.id;
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox mt={4}>
        <VuiBox mb={1.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} >
                <Card id="delete-account" sx={{ height: "100%" }}>
                    
                    <VuiBox mb="28px" display="flex" justifyContent="space-between" alignItems="center">
                        <VuiTypography variant="h6" fontWeight="medium" color="white">
                            Report ID: {id}
                        </VuiTypography>
                    </VuiBox>
                </Card>
                
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
    
    </DashboardLayout>
    
  );
};

export default ReportPage;
