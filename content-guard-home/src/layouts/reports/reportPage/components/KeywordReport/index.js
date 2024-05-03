import React from 'react';

import Card from "@mui/material/Card";
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { IoHappy } from 'react-icons/io5';
import linearGradient from 'assets/theme/functions/linearGradient';
import CircularProgress from '@mui/material/CircularProgress';
//import { PieChart } from '@mui/x-charts/PieChart';
//import { Chart } from "react-google-charts";
import Chart from 'react-apexcharts';
import colors from "assets/theme/base/colors";
import ReportLine from "layouts/reports/components/ReportLine";
import { InfoOutlined } from '@mui/icons-material';

const KeywordReport = () => {
	const pieChartData = {
    labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team f'],
    series: [44, 55, 13, 43, 30, 90],
  };
  
  const options = {
    chart: {
      type: 'pie',
    },
    labels: pieChartData.labels,
    colors: ['#4318ff', '#0f1535', '#0075ff', '#01b574', '#ffb547', '#e31a1a', '#e9ecef', '#344767'],
    
    markers: {
      colors: ['#F44336', '#E91E63', '#9C27B0']
    },
  };

	return (
	<Card m={20}>
    <Card id="delete-account" sx={{ height: "100%"}}>
      <VuiBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <VuiTypography variant="h6" sx={{color: '#e9ecef'}}>
        Keywords and Categories Blocked
      </VuiTypography>
      
      <Chart options={options} series={pieChartData.series} type="pie" width="400" />

      </VuiBox>
      <VuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>

      <VuiBox>
      <VuiTypography variant="h6" sx={{color: '#e9ecef'}}>
        Keywords Blocked
      </VuiTypography>
      <Chart options={options} series={pieChartData.series} type="pie" width="400" />
      </VuiBox>
      <VuiBox>
      <VuiTypography variant="h6" sx={{color: '#e9ecef'}}>
        Categories Blocked
      </VuiTypography>
      <Chart options={options} series={pieChartData.series} type="pie" width="400" />
      </VuiBox>
      </VuiBox>
    

    </Card>
    </Card>
	);
};

export default KeywordReport;
