/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// @mui material components
import Card from "@mui/material/Card";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

// old Billing page components
//new Report Page
import ReportLine from "layouts/reports/components/ReportLine";

function ReportLines() {
  return (
    <Card id="delete-account" sx={{ height: "100%"}}>
      <VuiBox mb="28px" display="flex" justifyContent="space-between" alignItems="center">
        <VuiTypography variant="h6" fontWeight="medium" color="white">
          Reports
        </VuiTypography>
        <VuiButton variant="contained" color="info" size="small">
          CREATE REPORT
        </VuiButton>
      </VuiBox>
      <VuiBox>
        <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          <ReportLine date="March, 01, 2024" id="1"/>
          <ReportLine date="February, 10, 2024" id="2"/>
          <ReportLine date="April, 05, 2023" id="3"/>
          <ReportLine date="June, 25, 2022" id="4"/>
          <ReportLine date="March, 01, 2022" id="5" noGutter />
        </VuiBox>
      </VuiBox>
    </Card>
    
    
  );
}

export default ReportLines;
