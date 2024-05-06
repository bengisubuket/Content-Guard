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
	const categ_KeywPieChartData = {
    labels: ['elon musk', 'parti', 'global warming', 'Politics', 'Football', 'Memes and Jokes'],
    series: [44, 55, 13, 43, 30, 90],
  };
  
  const keywordPieChartData = {
    labels: ['elon musk', 'parti', 'global warming'],
    series: [44, 55, 13],
  };

  const categoryPieChartData = {
    labels: ['Politics', 'Football', 'Memes and Jokes'],
    series: [43, 30, 90],
  };

  const options = {
    chart: {
      type: 'pie',
    },
    labels: categ_KeywPieChartData.labels,
    colors: ['#4318ff', '#0f1535', '#0075ff', '#01b574', '#ffb547', '#e31a1a', '#e9ecef', '#344767'],
    
    markers: {
      colors: ['#F44336', '#E91E63', '#9C27B0']
    },
  };

  const optionsKeyw = {
    chart: {
      type: 'pie',
    },
    labels: keywordPieChartData.labels,
    colors: ['#4318ff', '#0f1535', '#0075ff', '#01b574', '#ffb547', '#e31a1a', '#e9ecef', '#344767'],
    
    markers: {
      colors: ['#F44336', '#E91E63', '#9C27B0']
    },
  };

  const optionsCateg = {
    chart: {
      type: 'pie',
    },
    labels: categoryPieChartData.labels,
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
      
      <Chart options={options} series={categ_KeywPieChartData.series} type="pie" width="400" />

      </VuiBox>
      <VuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>

      <VuiBox>
      <VuiTypography variant="h6" sx={{color: '#e9ecef'}}>
        Keywords Blocked
      </VuiTypography>
      <Chart options={optionsKeyw} series={keywordPieChartData.series} type="pie" width="400" />
      </VuiBox>
      <VuiBox>
      <VuiTypography variant="h6" sx={{color: '#e9ecef'}}>
        Categories Blocked
      </VuiTypography>
      <Chart options={optionsCateg} series={categoryPieChartData.series} type="pie" width="400" />
      </VuiBox>
      </VuiBox>
    

    </Card>
    </Card>
	);
};

export default KeywordReport;
