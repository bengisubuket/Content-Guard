import TwitterIcon from "@mui/icons-material/Twitter";
import Grid from "@mui/material/Grid";// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import Footer from "examples/Footer";
// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Overview page components
import Header from "layouts/profile/components/Header";
import Welcome from "../profile/components/Welcome/index";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Overview() {
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
    <DashboardLayout>
      <Header />
      <VuiBox mt={5} mb={3}>
        <Grid
          container
          spacing={3}
          sx={({ breakpoints }) => ({
            [breakpoints.only("xl")]: {
              gridTemplateColumns: "repeat(2, 1fr)",
            },
          })}
        >
          <Grid
            item
            xs={12}
            xl={4}
            xxl={3}
            sx={({ breakpoints }) => ({
              minHeight: "400px",
              [breakpoints.only("xl")]: {
                gridArea: "1 / 1 / 2 / 2",
              },
            })}
          >
            <Welcome />
          </Grid>
  
          <Grid
            item
            xs={12}
            xl={3}
            xxl={3}
            sx={({ breakpoints }) => ({
              [breakpoints.only("xl")]: {
                gridArea: "1 / 2 / 2 / 3",
              },
            })}
          >
            <ProfileInfoCard
              title="profile information"
              info={{
                fullName: userData.user_displayName,
                mobile: userData.phoneNumber || "Not available",
                email: userData.email || "Not available",
              }}
              social={[
                {
                  link: "https://twitter.com/".concat(userData.userName),
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
              ]}
            />
          </Grid>
        </Grid>
      </VuiBox>
      
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
