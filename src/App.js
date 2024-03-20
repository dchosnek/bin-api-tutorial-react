import './App.css';
import './bin-table';
import BinTable from './bin-table';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <Container>
      <div className="App">
        <BinTable />
      </div>
    </Container>
  );
}

export default App;
