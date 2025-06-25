import React, { useState } from 'react';
import { Link } from './Link.tsx';
import {
  Button,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
} from '@mui/material';


const settingsNotAuth = [
  { url: '/sign-in', label: 'Sign in' },
  { url: '/sign-up', label: 'Sign up' },
];

export const Header = ({ user, onLogout }: { user: { username: string } | null, onLogout: () => void }) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BOBR
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Typography sx={{ mr: 2, display: 'inline-block' }}>
                  Welcome, {user.username}
                </Typography>
                <Button
                  color="inherit"
                  onClick={() => {
                    onLogout();
                    handleCloseUserMenu();
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Guest" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settingsNotAuth.map(({ url, label }) => (
                    <MenuItem key={url} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">
                        <Link underline="hover" href={url}>
                          {label}
                        </Link>
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
