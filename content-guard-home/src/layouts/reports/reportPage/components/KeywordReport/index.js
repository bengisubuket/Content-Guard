// Import dependencies and components
import React, { useEffect, useMemo, useState } from 'react';
import Card from "@mui/material/Card";
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import Chart from 'react-apexcharts';
import { getReportById } from 'services/api';

// Main report component
const KeywordReport = ({ id }) => {
    const [blockedItems, setBlockedItems] = useState({});

    // Fetch report data by ID when the component mounts or when `id` changes
    useEffect(() => {
        const fetchReport = async () => {
            const data = await getReportById(id);
            if (data && data.status === 'success') {
                setBlockedItems(data.report);
            }
        };

        fetchReport();
    }, [id]);

    // Destructure the fetched report data or provide default empty objects
    const { categories_reported = {}, keywords_reported = {} } = blockedItems;

    // Memoize the chart data to avoid unnecessary recalculations
    const keywordPieChartData = useMemo(() => ({
        series: Object.values(keywords_reported),
        options: {
            labels: Object.keys(keywords_reported),
            colors: ['#FF4560', '#775DD0', '#008FFB', '#00E396', '#FEB019']
        }
    }), [keywords_reported]);

    const categoryPieChartData = useMemo(() => ({
        series: Object.values(categories_reported),
        options: {
            labels: Object.keys(categories_reported),
            colors: ['#FF4560', '#775DD0', '#008FFB', '#00E396', '#FEB019']
        }
    }), [categories_reported]);

    // Render the UI
    return (
        <Card m={20}>
            <Card id="delete-account" sx={{ height: "100%" }}>
                <VuiBox sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <VuiBox>
                        <VuiTypography variant="h6" sx={{ color: '#e9ecef' }}>
                            Keywords Blocked
                        </VuiTypography>
                        <Chart options={keywordPieChartData.options} series={keywordPieChartData.series} type="pie" width="400" />
                    </VuiBox>
                    <VuiBox>
                        <VuiTypography variant="h6" sx={{ color: '#e9ecef' }}>
                            Categories Blocked
                        </VuiTypography>
                        <Chart options={categoryPieChartData.options} series={categoryPieChartData.series} type="pie" width="400" />
                    </VuiBox>
                </VuiBox>
            </Card>
        </Card>
    );
};

export default KeywordReport;
