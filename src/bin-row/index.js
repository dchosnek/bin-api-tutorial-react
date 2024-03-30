import './bin-row.css';
import { useState, useEffect, useRef } from 'react';

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
    // track the state before entering edit mode so we only perform an API
    // call when there is a change in contents
    const [beforeEdits, setBeforeEdits] = useState(props.binContents);

    // this is needed to refresh the row if the contents ever change
    useEffect(() => {
        setContents(props.binContents);
        setEditMode(false);
    }, [props])

    // create a reference to the input text box in order to place the cursor
    // in it in edit mode
    const inputRef = useRef(null);

    // look for user to hit the enter key while typing in the input box
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            exitEditMode();
        }
    };

    // handle exiting edit mode (whether by pressing save or hitting enter)
    // make an API call only if the contents of the field have changed
    const exitEditMode = () => {
        setEditMode(false);
        if (contents !== beforeEdits) {
            props.saveFunc(props.binId, contents);
            setBeforeEdits(contents);
        }
    };

    // handle entering edit mode, which involves turning on edit mode but also
    // putting the cursor at the end of the input box, which proved tricky for
    // Chrome/Brave (had to add a setTimeout)
    const enterEditMode = () => {
        // this will make the input box visible
        setEditMode(true);
        //timeout is required to ensure rendering is complete
        // before attempting to set focus on the input box
        setTimeout(() => {
            const input = inputRef.current;
            if (input) {    // make sure the ref is not null
                input.focus();
                // set the cursor position to the end of text
                const length = input.value.length;
                input.setSelectionRange(length, length);
            }
        }, 0);
    }

    return (
        <tr>
            {/* column 1 */}
            <td>{props.binId}</td>
            {/* column 2: either bin contents or an input box to edit the contents */}
            <td hidden={editMode}>{contents}</td>
            <td hidden={!editMode}><input type='text' value={contents} ref={inputRef} size={contents.length} onKeyDown={handleKeyDown} onChange={(event) => { setContents(event.target.value) }} /></td>
            {/* column 3: action buttons (edit, save, delete) */}
            <td>
                <OverlayTrigger placement='left' overlay={<Tooltip>Edit</Tooltip>}>
                    <Button variant='outline-light' className='button-pad' hidden={editMode} onClick={enterEditMode}><PencilSquare />
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement='left' overlay={<Tooltip>Save</Tooltip>}>
                    <Button variant='outline-light' className='button-pad' hidden={!editMode} onClick={exitEditMode}><Floppy /></Button>
                </OverlayTrigger>
                <OverlayTrigger placement='right' overlay={<Tooltip>Delete</Tooltip>}>
                    <Button variant='outline-danger' onClick={() => props.delFunc(props.binId)}><Trash /></Button>
                </OverlayTrigger>
            </td>
        </tr>
    );
};

export default BinRow;