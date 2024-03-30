import { API_BASE_URL } from '../constants';

function deleteBin(token, setAlertList, setBinList, binId) {
    const fetchUrl = `${API_BASE_URL}/bins/${binId}`;
    fetch(fetchUrl, {
        method: 'DELETE',
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

            // if the delete was successful, display an alert
            setAlertList(prevList => [...prevList,
            {
                status: response.status,
                message: `Delete bin ${binId}`,
                type: 'success',
                method: 'DELETE',
                id: `delete${binId}${Date.now()}`
            }
            ]);

            // update the bin list to remove the deleted bin
            setBinList(prevList => prevList.filter(item => item.binId !== binId));
        })
        .catch((error) => {
            console.log(error);
            setAlertList(prevList => [...prevList,
            {
                status: error.message,
                message: `ERROR ${error.message} attempting to delete bin ${binId}`,
                type: 'error',
                method: 'DELETE',
                id: `delete${binId}${Date.now()}`
            }
            ]);
        });
};

export default deleteBin;