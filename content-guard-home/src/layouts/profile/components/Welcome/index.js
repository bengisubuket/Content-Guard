import React from "react";
import { Card, Icon } from "@mui/material";
import welcome from "assets/images/content-guard-images/guardian-welcome-profile.jpeg";
import VuiTypography from "components/VuiTypography/index";
import VuiBox from "components/VuiBox/index";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Welcome = () => {
  const [userData, setUserData] = useState({}); // [1]
  //get user data from cookies
  useEffect(() => {
    const user = Cookies.get("user_data");
    console.log("user", user);
    if (user) {
      setUserData(JSON.parse(user));
      console.log("user data", userData);
    }
    else {
      console.log("user data not found");
    }

  }, []);


  return (
    <Card
      sx={({ breakpoints }) => ({
        background: `url(${welcome})`,
        backgroundSize: "cover",
        borderRadius: "20px",
        height: "100%",
        [breakpoints.only("xl")]: {
          gridArea: "1 / 1 / 2 / 2",
        },
      })}
    >
      <VuiBox display="flex" flexDirection="column" sx={{ height: "100%" }}>
        <VuiBox display="flex" flexDirection="column" mb="auto">
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="3px">
            Welcome back!
          </VuiTypography>
          <VuiTypography color="white" variant="button" fontWeight="regular" key={userData}>
            {userData.user_displayName}
          </VuiTypography>
        </VuiBox>
        <VuiBox justifySelf="flex-end">
          <VuiTypography
            component="a"
            href="#"
            variant="button"
            color="white"
            fontWeight="regular"
            sx={{
              mr: "5px",
              display: "inline-flex",
              alignItems: "center",
              justifySelf: "flex-end",
              cursor: "pointer",

              "& .material-icons-round": {
                fontSize: "1.125rem",
                transform: `translate(2px, -0.5px)`,
                transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
              },

              "&:hover .material-icons-round, &:focus  .material-icons-round": {
                transform: `translate(6px, -0.5px)`,
              },
            }}
          >
            Content Guard is guarding your content for you. Explore Content Guard Home.
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default Welcome;
