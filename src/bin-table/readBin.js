import { API_BASE_URL } from '../constants';

// local function used to read the contents of a single bin
const getBinContents = (token, setAlertList, binId) => {
    const fetchUrl = `${API_BASE_URL}/bins/${binId}`;
    return fetch(fetchUrl, {
        method: 'GET',
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

            // append a new alert indicating success
            setAlertList(prevList => [...prevList,
            {
                status: response.status,
                message: `Get bin contents for ${binId}`,
                type: 'success',
                method: 'GET',
                id: `get${binId}${Date.now()}`
            }
            ]);
            return response.json(); // Parse the response body as JSON
        })
        .then((data) => {
            // the response should have a body with binId and contents
            // but the function only returns the contents
            return data.contents;
        })
        .catch((error) => {
            // display an error message
            // This is highly unlikely to occur since the calling function has
            // already determined that this binId exists. It would take a very
            // unusual timing anomaly for this to fail.
            setAlertList(prevList => [...prevList,
                {
                    status: error.message,  // HTTP status code
                    message: `ERROR ${error.message} reading bin ${binId}`,
                    type: 'error',
                    method: 'GET',
                    id: `get${binId}${Date.now()}`
                }
                ]);
        });
};

// reads the list of valid binIds and the contents of each bin
function refreshTable(token, setAlertList, setBinList) {
    const fetchUrl = `${API_BASE_URL}/bins`;
    fetch(fetchUrl, {
        method: 'GET', // GET is the default method, so this is optional
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
            // append a new alert indicating success
            setAlertList(prevList => [...prevList,
            {
                status: response.status,
                message: 'Retrieve list of all bins',
                type: 'success',
                method: 'GET',
                id: `getall${Date.now()}`
            }
            ]);
            return response.json(); // Parse the response body as JSON
        })
        .then((data) => {
            // Map each binId to a promise that resolves to the structure { binId: binId, contents: contents }
            const contentPromises = data.bins.map(binId =>
                getBinContents(token, setAlertList, binId).then(contents => ({
                    binId: binId,
                    contents: contents
                }))
            );
            // Wait for all promises to resolve
            return Promise.all(contentPromises);
        })
        .then(newArray => {
            setBinList(newArray);
        })
        .catch((error) => {
            // display an error message
            setAlertList(prevList => [...prevList,
            {
                status: error.message,
                message: `ERROR ${error.message} attempting to retrieve bin list`,
                type: 'error',
                method: 'GET',
                id: `getall${Date.now()}`
            }
            ]);
        });
};

export default refreshTable;