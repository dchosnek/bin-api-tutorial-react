import './App.css';
import BinTable from './bin-table';
import Container from 'react-bootstrap/Container';

function App() {
  return (
    <Container>
      <div className="App">
        <BinTable token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRjaG9zbmVrQGNpc2NvLmNvbSIsImV4cCI6MTcxMTAwMTM5NX0.Rg21wdgvCz20DNo1yAMLqrnbXFVqUOIT_0JB8RtcomQ' />
      </div>
    </Container>
  );
}

export default App;
