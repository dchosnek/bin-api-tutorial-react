import './bin-table.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';

import { ArrowClockwise, PlusLg } from 'react-bootstrap-icons';

import BinRow from '../bin-row';

import { API_BASE_URL } from '../constants';
import { Container } from 'react-bootstrap';

function BinTable(props) {
    const [binList, setBinList] = useState([]);

    function createBin() {
        const fetchUrl = `${API_BASE_URL}/bins`;
        const token = props.token;
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
                    throw new Error('Network response was not ok');
                }
                status = response.status;
                return response.json(); // Parse the response body as JSON
            })
            .then((data) => {
                props.setAlertList(prevList => [...prevList,
                    {
                        status: status,
                        message: `Create bin ${data.binId}`,
                        type: 'success',
                        method: 'POST',
                        id: `post${data.binId}${Date.now()}`
                    }
                ]);
                setBinList(prevList => [...prevList, { "binId": data.binId, "contents": data.contents }]);
            })
            .catch((error) => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };

    function deleteBin(binId) {
        const fetchUrl = `${API_BASE_URL}/bins/${binId}`;
        const token = props.token;
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
                    throw new Error('Network response was not ok');
                }
                props.setAlertList(prevList => [...prevList,
                    {
                        status: response.status,
                        message: `Delete bin ${binId}`,
                        type: 'success',
                        method: 'DELETE',
                        id: `delete${binId}${Date.now()}`
                    }
                ]);
                return response;
            })
            .then(() => {
                setBinList(prevList => prevList.filter(item => item.binId !== binId));
            })
            .catch((error) => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };

    const getBinContents = (token, binId) => {
        const fetchUrl = `${API_BASE_URL}/bins/${binId}`;
        return fetch(fetchUrl, {
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
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response body as JSON
            })
            .then((data) => {
                return data.contents;
            })
            .catch((error) => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };

    function updateBin(binId, contents) {
        const fetchUrl = `${API_BASE_URL}/bins/${binId}`;
        const token = props.token;
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
                    throw new Error('Network response was not ok');
                }
                props.setAlertList(prevList => [...prevList,
                    {
                        status: response.status,
                        message: `Update bin contents for ${binId}`,
                        type: 'success',
                        method: 'PUT',
                        id: `put${binId}${Date.now()}`
                    }
                ]);
                return response;
            })
            .then(() => {
                const newArray = binList.map(item =>
                    item.binId === binId ? { ...item, contents: contents } : item
                );
                setBinList(newArray);
            })
            .catch((error) => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }

    const refreshTable = () => {
        const fetchUrl = `${API_BASE_URL}/bins`;
        const token = props.token;
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
                    throw new Error('Network response was not ok');
                }
                props.setAlertList(prevList => [...prevList,
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
                    getBinContents(token, binId).then(contents => ({
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
                console.error('There was a problem with your fetch operation:', error);
            });
    };

    return (
        <Container>
            <Row>
                <Table hover bordered>
                    <thead>
                        <tr>
                            <th className='fit-content'>binId</th>
                            <th className='fill-space'>contents</th>
                            <th className='action-col'>
                                <OverlayTrigger placement='bottom-end' show={!binList.length && props.pageVisible} overlay={<Tooltip>You have no bins. Click here to create one.</Tooltip>}>
                                    <Button variant='success' className='button-pad' onClick={createBin}><PlusLg /></Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement='top' overlay={<Tooltip>Refresh table</Tooltip>}>
                                    <Button variant='primary' className='button-pad' onClick={refreshTable}><ArrowClockwise /></Button>
                                </OverlayTrigger>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {binList.map(e => (
                            <BinRow binId={e.binId} binContents={e.contents} key={e.binId} delFunc={deleteBin} saveFunc={updateBin} />
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default BinTable;