import { useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

import { Copy } from 'react-bootstrap-icons';

import { API_BASE_URL } from '../constants';

function TokenForm(props) {

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [showCopyMsg, setShowCopyMsg] = useState(false);

    // used to refer to the copy button
    const copyBtnRef = useRef(null);

    function handleClick() {

        const fetchUrl = `${API_BASE_URL}/token?email=${encodeURIComponent(email)}`;

        fetch(fetchUrl)
            .then((response) => {
                // Check if the request was successful
                if (!response.ok) {
                    throw new Error(response.text);
                }
                return response.json(); // Parse the response body as JSON
            })
            .then((data) => {
                props.setBearerToken(data.token);   // save the token to state
            })
            .catch((error) => {
                console.error('There was a problem with your fetch operation:', error);
            });
    }

    // when the user types their email, update the {email} variable and
    // set a variable indicating the email is a valid format
    const handleChange = (event) => {
        setEmail(event.target.value);
        setIsEmailValid(event.target.checkValidity());
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Form.Group className='mb-3' controlId='ControlInput1'>
                        <Form.Control
                            size='lg'
                            type='email'
                            placeholder='name@example.com'
                            onChange={handleChange}
                            value={email}
                            disabled={props.bearerToken !== ''}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Button
                        variant='primary' 
                        size='lg'
                        onClick={handleClick}
                        disabled={props.bearerToken !== '' || !isEmailValid}>Submit
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <InputGroup>
                        <InputGroup.Text id="basic-addon1">Token</InputGroup.Text>
                        <Form.Control
                            type='text'
                            value={props.bearerToken}
                            onChange={(event) => { props.setBearerToken(event.target.value); }}
                        />
                        <Button variant='outline-secondary'
                            ref={copyBtnRef}
                            onClick={() => {
                                navigator.clipboard.writeText(props.bearerToken);
                                setShowCopyMsg(true);
                                setTimeout(() => {
                                    setShowCopyMsg(false);
                                }, 1000);
                            }}><Copy /></Button>
                        <Overlay target={copyBtnRef} show={showCopyMsg} placement="right">
                            <Tooltip id="overlay-example">
                                Copied!
                            </Tooltip>
                        </Overlay>
                    </InputGroup>
                </Col>
                {/* empty column for sizing/layout purposes */}
                <Col></Col>
            </Row>
            {/* <Row>
                <Spinner animation="border" variant="primary" />
            </Row> */}
        </Container>

    );
}

export default TokenForm;