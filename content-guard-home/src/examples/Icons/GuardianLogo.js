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
import guardianLogo from "assets/images/content-guard-images/guardian.png";

function GuardianLogo({ size }) {
  return (
    <img
      src={guardianLogo}
      alt="Guardian Logo"
      style={{ width: size, height: "auto", borderRadius: "20%",  }}
    />
  );
}
// Setting default values for the props of GuardianLogo
GuardianLogo.defaultProps = {
  color: "dark",
  size: "16px",
};

// Typechecking props for the GuardianLogo
GuardianLogo.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
    "white",
  ]),
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default GuardianLogo;
