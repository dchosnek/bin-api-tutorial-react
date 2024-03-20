import './bin-table.css';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { ArrowClockwise, LightningFill, PencilSquare, PlusLg, Floppy, Trash } from 'react-bootstrap-icons';

const myBins = [
    { "binId": "cb1a235f-3bac-4ec2-8f87-a938637344b4", "contents": "the quick brown fox jumped over the lazy dog" },
    { "binId": "cef08be6-dd7f-4226-a7a6-9ad1856faa3d", "contents": "my second bin" },
    { "binId": "f1b1d0e9-1964-4a64-a740-dd7adc5eacdc", "contents": "this is my third bin" },
    { "binId": "95feca92-ad5b-4e63-a680-694f31204034", "contents": "this is my fourth bin" }
]



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
}

function BinTable() {
    const [binList, setBinList] = useState(myBins.slice());

    function createBin() {
        const binId = Math.floor(Math.random() * 100000000);
        const contents = '';
        setBinList([...binList, { "binId": binId, "contents": contents }])
        console.log(binList);
    };

    function deleteBin(id) {
        const newArray = binList.filter(item => item.binId !== id);
        setBinList(newArray);
    }
    
    function refreshTable() {
        const newArray = binList.slice();
        setBinList([]);
        setTimeout(() => {setBinList(newArray);}, 750);
    }

    function updateBin(binId, contents) {
        const newArray = binList.map(item => {
            if(item.binId === binId) {
                return {"binId": binId, "contents": contents }
            }
            return item;
        });

        setBinList(newArray);
    }



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