import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Spinner from 'react-bootstrap/Spinner';

import { Copy } from 'react-bootstrap-icons';

function TokenForm(props) {

    const [email, setEmail] = useState('');
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    // const [token, setToken] = useState('');

    function handleClick() {
        if (isEmailValid) {
            setIsInputDisabled(true);
        }
        const fetchUrl = `http://127.0.0.1:5000/token?email=${encodeURIComponent(email)}`;

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
                        primary size='lg'
                        onClick={handleClick}
                        disabled={props.bearerToken !== ''}>Submit
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
                        />
                        <Button variant='outline-secondary' onClick={() => { navigator.clipboard.writeText(props.bearerToken) }}><Copy /></Button>
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