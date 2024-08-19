import { Box, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { authUser } = useAuth();

  return (
    <Box>
      {authUser ? (
        <Box>
          <Typography>Id: {authUser?.id}</Typography>
          <Typography>Name: {authUser?.name}</Typography>
          <Typography>Email: {authUser?.email}</Typography>
        </Box>
      ) : (
        <Typography>User not found</Typography>
      )}
    </Box>
  );
};
export default Profile;
