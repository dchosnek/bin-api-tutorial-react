import './bin-table.css';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { ArrowClockwise, LightningFill, PlusLg } from 'react-bootstrap-icons';

import BinRow from '../bin-row';

function BinTable() {
    const [binList, setBinList] = useState([]);

    function createBin() {
        const fetchUrl = `http://0.0.0.0:5000/bins`;
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRjaG9zbmVrQGNpc2NvLmNvbSIsImV4cCI6MTcxMDk4NjEyMH0.3YR9ZDmPYe8o086nofajDk5HGTeOcNI2R46q4Cbs95s';
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
                return response.json(); // Parse the response body as JSON
            })
            .then((data) => {
                setBinList([...binList, { "binId": data.binId, "contents": data.contents }]);
            })
            .catch((error) => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };

    function deleteBin(id) {
        const fetchUrl = `http://0.0.0.0:5000/bins/${id}`;
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRjaG9zbmVrQGNpc2NvLmNvbSIsImV4cCI6MTcxMDk4NjEyMH0.3YR9ZDmPYe8o086nofajDk5HGTeOcNI2R46q4Cbs95s';
        console.log(fetchUrl);
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
            })
            .then(() => {
                const newArray = binList.filter(item => item.binId !== id);
                setBinList(newArray);
            })
            .catch((error) => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };

    const getBinContents = (token, binId) => {
        const fetchUrl = `http://0.0.0.0:5000/bins/${binId}`;
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
        const fetchUrl = `http://0.0.0.0:5000/bins/${binId}`;
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRjaG9zbmVrQGNpc2NvLmNvbSIsImV4cCI6MTcxMDk4NjEyMH0.3YR9ZDmPYe8o086nofajDk5HGTeOcNI2R46q4Cbs95s';
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
                return response.json(); // Parse the response body as JSON
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
        const fetchUrl = 'http://0.0.0.0:5000/bins';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRjaG9zbmVrQGNpc2NvLmNvbSIsImV4cCI6MTcxMDk4NjEyMH0.3YR9ZDmPYe8o086nofajDk5HGTeOcNI2R46q4Cbs95s';
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
        <div className='row align-items-center'>
            <div className='col'>
                <Table hover>
                    <thead>
                        <tr>
                            <th>binId</th>
                            <th>contents</th>
                            <th><LightningFill /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {binList.map(e => (
                            <BinRow binId={e.binId} binContents={e.contents} key={e.binId} delFunc={deleteBin} saveFunc={updateBin} />
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td>
                                <OverlayTrigger placement='auto' overlay={<Tooltip>Create new bin</Tooltip>}>
                                    <Button variant='success' className='button-pad' onClick={createBin}><PlusLg /></Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement='auto' overlay={<Tooltip>Refresh table</Tooltip>}>
                                    <Button variant='primary' className='button-pad' onClick={refreshTable}><ArrowClockwise /></Button>
                                </OverlayTrigger>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default BinTable;