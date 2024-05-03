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

/* eslint-disable react/prop-types */
// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiAvatar from "components/VuiAvatar";
import VuiBadge from "components/VuiBadge";

// Images
import avatar1 from "assets/images/avatar1.png";
import avatar2 from "assets/images/avatar2.png";
import avatar3 from "assets/images/avatar3.png";
import avatar4 from "assets/images/avatar4.png";
import avatar5 from "assets/images/avatar5.png";
import avatar6 from "assets/images/avatar6.png";

function Author({ image, name, email }) {
  return (
    <VuiBox display="flex" alignItems="center" px={1} py={0.5}>
      <VuiBox mr={2}>
        <VuiAvatar src={image} alt={name} size="sm" variant="rounded" />
      </VuiBox>
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {name}
        </VuiTypography>
        <VuiTypography variant="caption" color="text">
          {email}
        </VuiTypography>
      </VuiBox>
    </VuiBox>
  );
}

function Function({ job, org }) {
  return (
    <VuiBox display="flex" flexDirection="column">
      <VuiTypography variant="caption" fontWeight="medium" color="white">
        {job}
      </VuiTypography>
      <VuiTypography variant="caption" color="text">
        {org}
      </VuiTypography>
    </VuiBox>
  );
}

export default {
  columns: [
    { name: "keyword", align: "left" },
    { name: "date", align: "left" },
    { name: "action", align: "center" },
  ],

  rows: [
    {
      keyword: (<VuiTypography variant="caption" color="white" fontWeight="medium">
        elon musk</VuiTypography>),
      date: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          23/04/24 08:00 PM
        </VuiTypography>
      ),
      action: (
        <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Edit
        </VuiTypography>
      ),
    },
    {
      keyword: (<VuiTypography variant="caption" color="white" fontWeight="medium">
        parti</VuiTypography>),
      date: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          18/03/24 4:00 AM
        </VuiTypography>
      ),
      action: (
        <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Edit
        </VuiTypography>
      ),
    },
    {
      keyword: (<VuiTypography variant="caption" color="white" fontWeight="medium">
        global warming</VuiTypography>),
      date: (
        <VuiTypography variant="caption" color="white" fontWeight="medium">
          11/01/24 01:00 PM
        </VuiTypography>
      ),
      action: (
        <VuiTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          Edit
        </VuiTypography>
      ),
    },
    
  ],
};
