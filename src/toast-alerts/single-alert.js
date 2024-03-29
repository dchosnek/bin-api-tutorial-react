import Toast from 'react-bootstrap/Toast';

import { useEffect, useState } from 'react';

import { CheckCircleFill, ExclamationCircleFill } from 'react-bootstrap-icons';

function SingleAlert(props) {

    const [show, setShow] = useState(true);

    useEffect(() => {
        // This code will run once, 3 seconds after the component is loaded
        const timer = setTimeout(() => {
            setShow(false);
        }, 5000);

        // Clean up the timer when the component unmounts
        return () => {
            clearTimeout(timer);
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <Toast onClose={() => { setShow(false); }} show={show} delay={3000} autohide>
            <Toast.Header>
                <CheckCircleFill hidden={props.type !== 'success'} className='me-2' />
                <ExclamationCircleFill hidden={props.type !== 'error'} className='me-2' />
                <strong className="me-auto">{props.method}</strong>
                <small className="text-muted">Status: {props.status}</small>
            </Toast.Header>
            <Toast.Body>{props.message}</Toast.Body>
        </Toast>
    );
};

export default SingleAlert;