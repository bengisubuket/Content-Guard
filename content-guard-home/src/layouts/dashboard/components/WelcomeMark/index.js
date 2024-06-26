import React from "react";

import { Card, Icon } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

import jellyfishboi from "assets/images/content-guard-images/jellyfish-guardian.png";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const WelcomeMark = () => {
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
    <Card sx={() => ({
      height: "340px",
      py: "32px",
      backgroundImage: `url(${jellyfishboi})`,
      backgroundSize: "contain", // Adjusted property
      backgroundPosition: "center", // Adjusted property
      backgroundRepeat: "no-repeat", // Adjusted property
    })}>
      <VuiBox height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <VuiBox>
          <VuiTypography color="text" variant="button" fontWeight="regular" mb="12px">
            Welcome back,
          </VuiTypography>
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="18px" key={userData}>
            {userData.user_displayName}
          </VuiTypography>
          <VuiTypography color="text" variant="h6" fontWeight="regular" mb="auto">
            Glad to see you again!
          </VuiTypography>
        </VuiBox>
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
    </Card>
  );
};

export default WelcomeMark;
