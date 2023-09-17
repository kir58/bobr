import { Main } from './components/Main';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Container } from '@mui/material';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Main />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
