// ReportLine.js
import PropTypes from "prop-types";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import Icon from "@mui/material/Icon";
import { IoDocumentText } from "react-icons/io5";
import { useHistory } from "react-router-dom";

function ReportLine({ date, id, onDelete }) {
  const history = useHistory();

  const handleReportClick = () => {
    history.push({
      pathname: "/reports/reportPage/",
      state: { id, date },
    });
  };

  return (
    <VuiBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        "&:not(:last-child)": {
          borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
            `${borderWidth[1]} solid ${grey[700]}`,
        },
        "&:not(:first-child)": {
          borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
            `${borderWidth[1]} solid ${grey[700]}`,
        },
      }}
    >
      <VuiBox lineHeight={1}>
        <VuiTypography display="block" variant="button" fontWeight="medium" color="white">
          {id}
        </VuiTypography>
      </VuiBox>
      <VuiBox lineHeight={1}>
        <VuiTypography display="block" variant="button" fontWeight="medium" color="white">
          {date}
        </VuiTypography>
      </VuiBox>
      <VuiBox display="flex" alignItems="center">
        <VuiBox mr={1}>
          <VuiButton
            variant="text"
            color="error"
            onClick={() => onDelete(id)} // Trigger the delete function
          >
            <Icon sx={{ mr: "4px" }}>delete</Icon>&nbsp;DELETE
          </VuiButton>
        </VuiBox>
        <VuiBox display="flex" alignItems="center" lineHeight={0} ml={3} sx={{ cursor: "pointer" }}>
          <IoDocumentText color="#fff" size="15px" />
          <VuiTypography
            variant="button"
            fontWeight="medium"
            color="text"
            onClick={handleReportClick}
          >
            &nbsp;REPORT
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </VuiBox>
  );
}

// Set default prop values
ReportLine.defaultProps = {
  noGutter: false,
};

// Type-check the prop types
ReportLine.propTypes = {
  date: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired, // Add onDelete as a required prop
  noGutter: PropTypes.bool,
};

export default ReportLine;
