import { Main } from './components/Main';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Container } from '@mui/material';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { signIn, signUp } from './constants/routes';

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path={signIn} element={<SignIn />} />
            <Route path={signUp} element={<SignUp />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
