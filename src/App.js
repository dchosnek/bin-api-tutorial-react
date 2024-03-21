import './App.css';
import BinTable from './bin-table';
import TokenForm from './fetch-token';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';

function App() {

  const [bearerToken, setBearerToken] = useState('');

  return (
    <Container>
      <div className="App">
        <Container>
          <div className='row'>
            <TokenForm bearerToken={bearerToken} setBearerToken={setBearerToken} />
          </div>
          <div className={`row mt-5 ${bearerToken==='' && 'invisible'}`}>
            <BinTable token={bearerToken} />
          </div>
        </Container>
      </div>
    </Container>
  );
}

export default App;
