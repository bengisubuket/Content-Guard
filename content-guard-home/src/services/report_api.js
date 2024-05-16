// src/api/api.js

const API_URL = "http://localhost:8000/api/report/";

export const createReport = async (userId, reportId) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId, report_id: reportId })  // Send user_id in the request body as JSON
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

// New function to fetch all reports via GET
export const getAllReports = async (userId) => {
    try {
        const response = await fetch(`${API_URL}${userId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
};

export const deleteReport = async (userId, reportId) => {
    try {
        const response = await fetch(`${API_URL}${userId}/${reportId}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the delete operation:', error);
        return { status: 'error', message: 'Failed to delete report' };
    }
};

export const getReportById = async (userId, reportId) => {
    try {
        const response = await fetch(`${API_URL}${userId}/${reportId}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return { status: 'error', message: 'Failed to retrieve report' };
    }
};
