import React from 'react';

import Card from "@mui/material/Card";
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { IoHappy } from 'react-icons/io5';
import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import CircularProgress from '@mui/material/CircularProgress';
//import { PieChart } from '@mui/x-charts/PieChart';
//import { Chart } from "react-google-charts";

import ReportLine from "layouts/reports/components/ReportLine";

const KeywordReport = () => {
	
	return (
	<Card m={20}>
    <Card id="delete-account" sx={{ height: "100%"}}>
      <VuiBox>
        <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: 'series A' },
                { id: 1, value: 15, label: 'series B' },
                { id: 2, value: 20, label: 'series C' },
              ],
            },
          ]}
        width={400}
      height={200}
    />
        </VuiBox>
      </VuiBox>
    </Card>
    </Card>
	);
};

export default KeywordReport;
