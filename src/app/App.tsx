import { Main } from '../pages/main';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from '../shared/ui';
import { Container } from '@mui/material';
import { SignIn } from '../pages/signIn';
import { SignUp } from '../pages/signUp';
import { Scene } from '../pages/scene';
import { useUser } from '../entities/user/useUser.ts';
import { User } from '../pages/user';


function App() {
  const { user, logout } = useUser();

  return (
    <Router>
      <Header user={user} onLogout={logout} />
      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/user/:user_id" element={<User />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/scenes/:scene_id" element={<Scene />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
