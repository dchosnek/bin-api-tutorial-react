import './bin-table.css';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { ArrowClockwise, LightningFill, PencilSquare, PlusLg, Floppy, Trash } from 'react-bootstrap-icons';

function BinRow(props) {

    const [editMode, setEditMode] = useState(false);
    const [contents, setContents] = useState(props.binContents);

    return (
        <tr>
            <td>{props.binId}</td>
            <td hidden={editMode}>{contents}</td>
            <td hidden={!editMode}><input type='text' value={contents} size={contents.length} onChange={(event) => { setContents(event.target.value) }} /></td>
            <td><OverlayTrigger placement='top' overlay={<Tooltip>Edit</Tooltip>}>
                <Button variant="outline-dark" className='button-pad' hidden={editMode} onClick={() => { setEditMode(true) }}><PencilSquare /></Button>
            </OverlayTrigger>
                <OverlayTrigger placement='top' overlay={<Tooltip>Save</Tooltip>}>
                    <Button variant="outline-dark" className='button-pad' hidden={!editMode} onClick={() => {
                        setEditMode(false);
                        props.saveFunc(props.binId, contents);
                    }}><Floppy /></Button>
                </OverlayTrigger>
                <OverlayTrigger placement='top' overlay={<Tooltip>Delete</Tooltip>}>
                    <Button variant="outline-danger" onClick={() => props.delFunc(props.binId)}><Trash /></Button>
                </OverlayTrigger>
            </td>
        </tr>
    );
};

function BinTable() {
    const [binList, setBinList] = useState([]);

    function createBin() {
        const binId = Math.floor(Math.random() * 100000000);
        const contents = '';
        setBinList([...binList, { "binId": binId, "contents": contents }])
        console.log(binList);
    };

    function deleteBin(id) {
        const newArray = binList.filter(item => item.binId !== id);
        setBinList(newArray);
    };

    const getBinContents = (token, binId) => {
        const fetchUrl = `http://0.0.0.0:5000/bins/${binId}`;
        console.log(fetchUrl);
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
        const newArray = binList.map(item => {
            if (item.binId === binId) {
                return { "binId": binId, "contents": contents }
            }
            return item;
        });

        setBinList(newArray);
    }

    const refreshTable = () => {
        const fetchUrl = 'http://0.0.0.0:5000/bins';
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRjaG9zbmVrQGNpc2NvLmNvbSIsImV4cCI6MTcxMDk3MTYwMn0.wC_F0LRPLcut93QM9iFqI6TfBd8QJfBLvaUQT0l5nMg';
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
                console.log(data.bins);   // Log the bin IDs
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
                console.log(newArray); // newArray now contains objects with binId and contents
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