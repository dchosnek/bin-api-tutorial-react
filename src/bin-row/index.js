import './bin-row.css';
import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { PencilSquare, Floppy, Trash } from 'react-bootstrap-icons';

// Create a single row for a table with 'binId', 'contents', and action buttons
// as the three columns. The action buttons allow a user to edit the contents
// of that row's bin, save their edits, or delete that bin entirely.
// props: binId, binContents
function BinRow(props) {

    const [editMode, setEditMode] = useState(false);
    const [contents, setContents] = useState(props.binContents);

    // this is needed to refresh the row if the contents ever change
    useEffect(() => {
        setContents(props.binContents);
        setEditMode(false);
    }, [props])

    return (
        <tr>
            {/* column 1 */}
            <td>{props.binId}</td>
            {/* column 2: either bin contents or an input box to edit the contents */}
            <td hidden={editMode}>{contents}</td>
            <td hidden={!editMode}><input type='text' value={contents} size={contents.length} onChange={(event) => { setContents(event.target.value) }} /></td>
            {/* column 3: action buttons (edit, save, delete) */}
            <td>
                <OverlayTrigger placement='left' overlay={<Tooltip>Edit</Tooltip>}>
                    <Button variant='outline-dark' className='button-pad' hidden={editMode} onClick={() => { setEditMode(true) }}><PencilSquare /></Button>
                </OverlayTrigger>
                <OverlayTrigger placement='left' overlay={<Tooltip>Save</Tooltip>}>
                    <Button variant='outline-dark' className='button-pad' hidden={!editMode} onClick={() => {
                        setEditMode(false);
                        props.saveFunc(props.binId, contents);
                    }}><Floppy /></Button>
                </OverlayTrigger>
                <OverlayTrigger placement='right' overlay={<Tooltip>Delete</Tooltip>}>
                    <Button variant='outline-danger' onClick={() => props.delFunc(props.binId)}><Trash /></Button>
                </OverlayTrigger>
            </td>
        </tr>
    );
};

export default BinRow;