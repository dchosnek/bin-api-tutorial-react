import './App.css';

import ToastAlerts from './toast-alerts';
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
  const [alertList, setAlertList] = useState([]);

  return (
    <Container>

      {/* NAVBAR */}
      <Navbar expand="lg" data-bs-theme='dark'>
        <Container>
          <Navbar.Brand href="#" onClick={()=>{ setHomePage(true); }}><InboxesFill /> Bin API Tutorial</Navbar.Brand>
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

      {/* MAIN BODY OF THE PAGE */}
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
              <BinTable token={bearerToken} alertList={alertList} setAlertList={setAlertList} pageVisible={!homePage} />
            </div>
          </Container>
      </Container>
      {/* END OF MAIN BODY OF THE PAGE */}

      {/* Toasts (alerts) are in a fixed location */}
      <div className='position-fixed top-0 end-0 p-3'><ToastAlerts alertList={alertList} /></div>

    </Container>
  );
}

export default App;
