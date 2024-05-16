const API_URL = "http://localhost:8000/api/stat/";

export const fetchKeywordStatsAll = async (userId) => {
    try {
        const response = await fetch(`${API_URL}kw/${userId}/`, {
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
}

export const fetchCategoryStatsAll = async (userId) => {
    try {
        const response = await fetch(`${API_URL}cat/${userId}/`, {
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
}

export const fetchKwStats24 = async (userId) => {
    try {
        const response = await fetch(`${API_URL}kw/24hr/${userId}/`, {
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
}

export const fetchCatStats24 = async (userId) => {
    try {
        const response = await fetch(`${API_URL}cat/24hr/${userId}/`, {
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
}
