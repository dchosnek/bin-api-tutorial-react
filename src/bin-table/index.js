import './bin-table.css';
import { useState } from 'react';

// import bootstrap components and icons
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Tooltip from 'react-bootstrap/Tooltip';

import { ArrowClockwise, PlusLg } from 'react-bootstrap-icons';

// import child components
import BinRow from '../bin-row';

// CRUD operations for bins
import createBin from './createBin';
import refreshTable from './readBin';
import updateBin from './updateBin';
import deleteBin from './deleteBin';

function BinTable(props) {
    // list of maps where each map uses keys: binId, contents
    // initialized as an empty list
    const [binList, setBinList] = useState([]);

    // These functions are used for all bin CRUD operations.
    // They are defined this way in order to hard-code values into the more
    // generic CRUD functions imported into this file.
    const createBinFunc = () => createBin(props.token, props.setAlertList, setBinList);
    const readAllBinsFunc = () => refreshTable(props.token, props.setAlertList, setBinList)
    const updateBinFunc = (binId, contents) => updateBin(props.token, props.setAlertList, binList, setBinList, binId, contents);
    const delBinFunc = (binId) => deleteBin(props.token, props.setAlertList, setBinList, binId);

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
                                    <Button variant='success' className='button-pad' onClick={createBinFunc}><PlusLg /></Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement='top' overlay={<Tooltip>Refresh table</Tooltip>}>
                                    <Button variant='primary' className='button-pad' onClick={readAllBinsFunc}><ArrowClockwise /></Button>
                                </OverlayTrigger>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {binList.map(e => (
                            <BinRow binId={e.binId} binContents={e.contents} key={e.binId} delFunc={delBinFunc} saveFunc={updateBinFunc} />
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}

export default BinTable;