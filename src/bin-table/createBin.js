import { API_BASE_URL } from '../constants';

// creates a new bin and updates the binList state
function createBin(token, setAlertList, setBinList) {
    const fetchUrl = `${API_BASE_URL}/bins`;
    let status = '';
    fetch(fetchUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((response) => {
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(response.status);
            }
            status = response.status;
            return response.json(); // Parse the response body as JSON
        })
        .then((data) => {
            // append a new alert indicating success
            setAlertList(prevList => [...prevList,
            {
                status: status,
                message: `Create bin ${data.binId}`,
                type: 'success',
                method: 'POST',
                id: `post${data.binId}${Date.now()}`
            }
            ]);
            // append the newly created bin
            setBinList(prevList => [...prevList, { "binId": data.binId, "contents": data.contents }]);
        })
        .catch((error) => {
            // display an error message
            setAlertList(prevList => [...prevList,
            {
                status: error.message,  // HTTP status code
                message: `ERROR ${error.message} creating a bin`,
                type: 'error',
                method: 'POST',
                id: `post${Date.now()}`
            }
            ]);
        });
};

export default createBin;