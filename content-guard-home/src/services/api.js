// src/api/api.js

const API_URL = "http://localhost:8000/api/report/";

export const fetchBlockedItems = async (userId) => {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId })  // Send user_id in the request body as JSON
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
