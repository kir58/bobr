import { Main } from '../pages/main';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Header } from '../shared/ui';
import { Container } from '@mui/material';
import { SignIn } from '../pages/signIn';
import { SignUp } from '../pages/signUp';
import { useEffect, useState } from 'react';
import { getCurrentUser, logout } from '../shared/api/auth.ts';

function App() {
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const login = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch {
        setUser(null);
      }
    }
    login();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <div>
      <Router>
        <Header user={user} onLogout={handleLogout} />
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/sign-in" element={<SignIn onLoginSuccess={setUser} />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
