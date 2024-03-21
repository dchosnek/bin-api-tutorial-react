import './App.css';
import BinTable from './bin-table';
import TokenForm from './fetch-token';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';

import { InboxesFill, LockFill, UnlockFill } from 'react-bootstrap-icons';

function App() {

  const [bearerToken, setBearerToken] = useState('');

  return (
    <Container>

      {/* NAVBAR */}
      <Navbar expand="lg" bg='dark' data-bs-theme='dark'>
        <Container>
          <Navbar.Brand href="#home"><InboxesFill /> Bins API Tutorial</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home"><LockFill hidden={bearerToken !== ''} /><UnlockFill hidden={bearerToken === ''} /> Token</Nav.Link>
              <Nav.Link href="#bins">Bins</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* END OF NAVBAR */}

      <Container>
        <div className="App">
          <Container>
            <div className='row'><h3>Your token</h3></div>
            <div className='row mb-3'>Use this form to generate a token for API access.</div>
            <div className='row'>
              <TokenForm bearerToken={bearerToken} setBearerToken={setBearerToken} />
            </div>
            <div className='row mt-5'><h3>Your bins</h3></div>
            <div className='row'>Use the table below to create (), edit, and delete () bins.</div>
            <div className={`row mt-5 ${bearerToken === '' && 'invisible'}`}>
              <BinTable token={bearerToken} />
            </div>
          </Container>
        </div>
      </Container>
    </Container>
  );
}

export default App;
