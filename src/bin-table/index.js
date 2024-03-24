import './bin-table.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';

import { ArrowClockwise, LightningFill, PlusLg } from 'react-bootstrap-icons';

import BinRow from '../bin-row';

import { API_BASE_URL } from '../constants';
import { Container } from 'react-bootstrap';

function BinTable(props) {
    const [binList, setBinList] = useState([]);

    function createBin() {
        const fetchUrl = `${API_BASE_URL}/bins`;
        const token = props.token;
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
        const fetchUrl = `${API_BASE_URL}/bins/${id}`;
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
                            <th className='action-col'><LightningFill /></th>
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
                                <OverlayTrigger placement='bottom-end' show={!binList.length && props.pageVisible} overlay={<Tooltip>You have no bins. Click here to create one.</Tooltip>}>
                                    <Button variant='success' className='button-pad' onClick={createBin}><PlusLg /></Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement='top' overlay={<Tooltip>Refresh table</Tooltip>}>
                                    <Button variant='primary' className='button-pad' onClick={refreshTable}><ArrowClockwise /></Button>
                                </OverlayTrigger>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default BinTable;