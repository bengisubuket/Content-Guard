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
import Grid from "@mui/material/Grid";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

//Took the footer out for now
import Footer from "examples/Footer"; 

// old Billing page components
// new Report
import ReportLines from "layouts/reports/components/ReportLines";

function Reports() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
        <VuiBox py={10}>
          <VuiBox sx={{ paddingLeft: '50px', paddingRight: '50px' }}>
            <ReportLines />
          </VuiBox>
        </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Reports;
