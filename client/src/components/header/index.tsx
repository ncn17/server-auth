import { Box, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { authUser, logOut } = useAuth();

  const handleLogOut = () => {
    logOut();
    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        padding: '20px 50px',
        mb: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e6ffff;',
      }}
    >
      <Typography variant="h1" fontSize="20px" fontWeight="bold">
        Logo
      </Typography>
      <Box
        sx={{
          listStyle: 'none',
          textDecoration: 'none',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          minWidth: '30%',
          gap: '30px',
          textTransform: 'capitalize',
        }}
      >
        {authUser ? (
          <>
            <Link style={{ textDecoration: 'none', color: 'blue' }} to="/">
              Home
            </Link>
            <Link
              style={{ textDecoration: 'none', color: 'blue' }}
              to="/profile"
            >
              Profile
            </Link>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#f00' }}
              onClick={() => handleLogOut()}
            >
              LogOut
            </Button>
          </>
        ) : (
          <>
            <Link style={{ textDecoration: 'none', color: 'blue' }} to="/login">
              LogIn
            </Link>
            <Link
              style={{ textDecoration: 'none', color: 'blue' }}
              to="/signup"
            >
              Register
            </Link>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header;
