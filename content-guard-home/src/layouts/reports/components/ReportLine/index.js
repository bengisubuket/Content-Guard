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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import { IoDocumentText } from "react-icons/io5";
import Icon from "@mui/material/Icon";
import VuiButton from "components/VuiButton";
import linearGradient from "assets/theme/functions/linearGradient";
import colors from "assets/theme/base/colors";
function ReportLine({ date, id}) {
  return (
    <VuiBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb="32px"
    >
      <VuiBox lineHeight={1}>
        <VuiTypography display="block" variant="button" fontWeight="medium" color="white">
          {date}
        </VuiTypography>
        <VuiTypography variant="caption" fontWeight="regular" color="text">
          {id}
        </VuiTypography>
      </VuiBox>
      <VuiBox display="flex" alignItems="center">
            <VuiBox mr={1}>
              <VuiButton variant="text" color="error">
                <Icon sx={{ mr: "4px" }}>delete</Icon>&nbsp;DELETE
              </VuiButton>
            </VuiBox>
        <VuiBox display="flex" alignItems="center" lineHeight={0} ml={3} sx={{ cursor: "pointer" }}>
          <IoDocumentText color="#fff" size="15px" />
          <VuiTypography variant="button" fontWeight="medium" color="text">
            &nbsp;REPORT
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
}

// Setting default values for the props of ReportLine (old Invoice)
ReportLine.defaultProps = {
  noGutter: false,
};

// Typechecking props for the ReportLine (old Invoice)
ReportLine.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  noGutter: PropTypes.bool,
};

export default ReportLine;
