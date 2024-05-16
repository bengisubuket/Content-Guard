// @mui material components
import Grid from "@mui/material/Grid";
import { Card, Stack } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";


// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";

// React icons
import { MdKey } from "react-icons/md";
import { FaFolderClosed } from "react-icons/fa6";
import { IoShieldCheckmark } from "react-icons/io5";

// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";

import { fetchKwStats24, fetchCatStats24, fetchCategoryStatsAll, fetchKeywordStatsAll } from "services/stats_api";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";


function Dashboard() {
  if (!Cookies.get("user_data"))
    window.location.href = "/authentication/sign-in";

  const [totalKwBlockedTweets24h, setTotalKwBlockedTweets24h] = useState(0);
  const [totalCatBlockedTweets24h, setTotalCatBlockedTweets24h] = useState(0);
  const [totalKwBlockedTweets, setTotalKwBlockedTweets] = useState(0);
  const [totalCatBlockedTweets, setTotalCatBlockedTweets] = useState(0);
  const uid = "3ZV6aeGHgMe5e3gIju5TskWkVk12";

  useEffect(() => {
      const fetchData = async () => {
          try {
              const keywords = await fetchKeywordStatsAll(uid);
              const totalKw = keywords.reduce((acc, keyword) => acc + (keyword.total_blocked_tweets || 0), 0);
              setTotalKwBlockedTweets(totalKw);

              const categories = await fetchCategoryStatsAll(uid);
              const totalCat = categories.reduce((acc, category) => acc + (category.total_blocked_tweets || 0), 0);
              setTotalCatBlockedTweets(totalCat);

          } catch (error) {
              console.error('Error loading data:', error);
          }
      };

      fetchData();
  }, []);

  const [keywordsData, setKeywordsData] = useState({});
  const [keywordBlockedCountList, setKeywordBlockedCountList] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoryBlockedCountList, setCategoryBlockedCountList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data_kw = await fetchKwStats24(uid);
      const data_cat = await fetchCatStats24(uid);

      if(data_kw && data_kw.status === 'success') {
        setKeywordsData(data_kw);
        setKeywordBlockedCountList(data_kw.total_blocked);
        setTotalKwBlockedTweets24h(keywordBlockedCountList.reduce((accumulator, currentValue) => accumulator + currentValue, 0))

      }
      if(data_cat && data_cat.status === 'success') {
        setCategoriesData(data_cat);
        setCategoryBlockedCountList(data_cat.total_blocked);
        setTotalCatBlockedTweets24h(categoryBlockedCountList.reduce((accumulator, currentValue) => accumulator + currentValue, 0))
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>

        <VuiBox mb={3}>
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={12} xl={7}>
              <WelcomeMark />
            </Grid>

          </Grid>
        </VuiBox>
       
        <VuiBox mb={3}>
        <Grid container spacing={3} justifyContent="center">

            <Grid item xs={12} lg={6} xl={7}>
              <Card>
                <VuiBox sx={{ height: "100%" }}>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                    Number of Keywords Blocked
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" mb="40px" key={Date.now()}>
                    <VuiTypography variant="button" color="success" fontWeight="bold" >
                      {totalKwBlockedTweets24h} in total{" "}
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        last 24 hour
                      </VuiTypography>
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox sx={{ height: "310px" }}>
                  <LineChart
                    key={keywordBlockedCountList} // Changes every time state updates, forcing re-render
                    lineChartData={[
                      {
                        name: "Keywords Blocked",
                        data: keywordBlockedCountList,
                      }
                    ]}
                    lineChartOptions={lineChartOptionsDashboard}
                  />
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
            <Grid item xs={12} lg={6} xl={7}>
              <Card>
                <VuiBox sx={{ height: "100%" }}>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                    Number of Categories Blocked
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" mb="40px" >
                    <VuiTypography variant="button" color="success" fontWeight="bold" key={Date.now()}>
                      {totalCatBlockedTweets24h} in total{" "}
                      <VuiTypography variant="button" color="text" fontWeight="regular">
                        last 24 hour
                      </VuiTypography>
                    </VuiTypography>
                  </VuiBox>
                  <VuiBox sx={{ height: "310px" }}>
                    <LineChart
                      key={categoryBlockedCountList} // Changes every time state updates, forcing re-render
                      lineChartData={[
                        {
                          name: "Categories Blocked",
                          data: categoryBlockedCountList,
                        }
                      
                      ]}
                      lineChartOptions={lineChartOptionsDashboard}
                    />
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
      
          </Grid>
        </VuiBox>
        <Grid container spacing={3} direction="row" justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={6} lg={8}>
          <Card>
                <VuiBox>
                  <VuiTypography variant="lg" color="white" fontWeight="bold" mb="5px">
                    Number of Keyword and Category Tweets Blocked So Far
                  </VuiTypography>
                  <VuiBox display="flex" alignItems="center" mb="40px">
                  </VuiBox>
                  <Grid container spacing="50px">
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <MdKey color="#fff" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Keywords
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        {totalKwBlockedTweets}
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                    <Grid item xs={6} md={3} lg={3}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <FaFolderClosed color="#fff" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Categories
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        {totalCatBlockedTweets}
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                    <Grid item xs={6} md={3} lg={6}>
                      <Stack
                        direction="row"
                        spacing={{ sm: "10px", xl: "4px", xxl: "10px" }}
                        mb="6px"
                      >
                        <VuiBox
                          bgColor="info"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{ borderRadius: "6px", width: "25px", height: "25px" }}
                        >
                          <IoShieldCheckmark color="#fff" size="12px" />
                        </VuiBox>
                        <VuiTypography color="text" variant="button" fontWeight="medium">
                          Total of Tweets Blocked
                        </VuiTypography>
                      </Stack>
                      <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                        {totalCatBlockedTweets + totalKwBlockedTweets}
                      </VuiTypography>
                      <VuiProgress value={60} color="info" sx={{ background: "#2D2E5F" }} />
                    </Grid>
                  </Grid>
                </VuiBox>
              </Card>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;

