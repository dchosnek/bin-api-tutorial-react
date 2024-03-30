import { API_BASE_URL } from '../constants';

// updates a single bin with new contents
function updateBin(token, setAlertList, binList, setBinList, binId, contents) {
    const fetchUrl = `${API_BASE_URL}/bins/${binId}`;
    fetch(fetchUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: contents
        }),
        credentials: 'include'
    })
        .then((response) => {
            // Check if the request was successful
            if (!response.ok) {
                throw new Error(response.status);
            }
            setAlertList(prevList => [...prevList,
            {
                status: response.status,
                message: `Update bin contents for ${binId}`,
                type: 'success',
                method: 'PUT',
                id: `put${binId}${Date.now()}`
            }
            ]);

            // update the bin list to show the bin with updated contents
            // const newArray = binList.map(item =>
            //     
            // );
            // setBinList(newArray);
            setBinList(prevList => prevList.map(item => 
                item.binId === binId ? { ...item, contents: contents } : item
                ));
        })
        .catch((error) => {
            setAlertList(prevList => [...prevList,
            {
                status: error.message,
                message: `ERROR ${error.message} attempting to update bin ${binId}`,
                type: 'error',
                method: 'PUT',
                id: `put${binId}${Date.now()}`
            }
            ]);
        });
};

export default updateBin;