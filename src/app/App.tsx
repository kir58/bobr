import { Main } from '../pages/main';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from '../shared';
import { Container } from '@mui/material';
import { SignIn } from '../pages/signIn';
import { SignUp } from '../pages/signUp';

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
