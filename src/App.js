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
  const [homePage, setHomePage] = useState(true);

  return (
    <Container>

      {/* NAVBAR */}
      <Navbar expand="lg" bg='dark' data-bs-theme='dark'>
        <Container>
          <Navbar.Brand href="#" onClick={()=>{ setHomePage(true); }}><InboxesFill /> Bins API Tutorial</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" onClick={()=>{ setHomePage(true); }}><LockFill hidden={bearerToken !== ''} /><UnlockFill hidden={bearerToken === ''} /> Token</Nav.Link>
              <Nav.Link href="#" onClick={()=>{ setHomePage(false); }} disabled={bearerToken===''}>Bins</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* END OF NAVBAR */}

      <Container>
          <Container hidden={!homePage}>
            <div className='row mt-3'><h3>Your token</h3></div>
            <div className='row'>Use this form to generate a token for API access.</div>
            <div className='row mt-3'>
              <TokenForm bearerToken={bearerToken} setBearerToken={setBearerToken} />
            </div>
          </Container>
          <Container hidden={homePage}>
            <div className='row mt-3'><h3>Your bins</h3></div>
            <div className='row'>Use the table below to create, update (save), and delete bins. Every button except the edit button will generate one or more API calls.</div>
            <div className='row mt-3'>
              <BinTable token={bearerToken} />
            </div>
          </Container>
      </Container>
    </Container>
  );
}

export default App;
