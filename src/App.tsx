import { Main } from './components/Main';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Container } from '@mui/material';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
