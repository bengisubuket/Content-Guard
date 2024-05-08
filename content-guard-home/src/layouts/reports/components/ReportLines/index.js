// ReportLines.js

import Card from "@mui/material/Card";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import ReportLine from "layouts/reports/components/ReportLine";
import React, { useState, useEffect } from 'react';
import { getAllReports, createReport, deleteReport } from 'services/api';

function ReportLines() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = "22";

    useEffect(() => {
        getAllReports()
            .then(data => {
                const formattedReports = data.reports.map(report => ({
                    ...report,
                    formattedDate: formatDate(report.time_added)
                }));
                setReports(formattedReports || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching reports:", err);
                setError("Failed to load reports");
                setLoading(false);
            });
    }, []);

    const handleCreateReport = () => {
        setLoading(true);

        // Find the highest existing report ID, treating them as numbers
        const highestId = reports.reduce((maxId, report) => {
            const numericId = parseInt(report.report_id, 10);
            return numericId > maxId ? numericId : maxId;
        }, 0);

        // The new report ID is one greater than the highest existing report ID
        const nextReportId = highestId + 1;

        createReport(userId, nextReportId)
            .then(data => {
                const newReport = {
                    report_id: `${nextReportId}`,
                    formattedDate: formatDate(new Date().toISOString()),
                    ...data
                };

                // Add the new report to the existing list
                setReports(prevReports => [...prevReports, newReport]);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error creating report:", err);
                setError("Failed to create report");
                setLoading(false);
            });
    };

	const handleDeleteReport = (reportId) => {
        setLoading(true);
        deleteReport(reportId)
            .then(response => {
                if (response.status === 'success') {
                    setReports(prevReports => prevReports.filter(report => report.report_id !== `${reportId}`));
                } else {
                    setError(response.message);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error deleting report:", err);
                setError("Failed to delete report");
                setLoading(false);
            });
    };

    // Utility function to format dates nicely
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString(); // Customize the options as needed
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <Card id="delete-account" sx={{ height: "100%" }}>
            <VuiBox mb="28px" display="flex" justifyContent="space-between" alignItems="center">
                <VuiTypography variant="h6" fontWeight="medium" color="white">
                    Reports
                </VuiTypography>
                <VuiButton variant="contained" color="info" size="small" onClick={handleCreateReport}>
                    CREATE REPORT
                </VuiButton>
            </VuiBox>
            <VuiBox>
                <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
                    {reports.map(report => (
                        <ReportLine
						key={report.report_id}
						date={report.formattedDate}
						id={report.report_id}
						report={report}
						onDelete={() => handleDeleteReport(report.report_id)} // Pass delete handler
					/>
                    ))}
                </VuiBox>
            </VuiBox>
        </Card>
    );
}

export default ReportLines;
