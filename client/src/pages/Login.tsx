import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { AppForm } from '../components/formik';
import { TextFieldForm } from '../components/texfieldForm';
import { useAuthApi } from '../hooks/useAuthApi';

const controlSchema = yup.object().shape({
  email: yup.string().email('Invalid email passed').required('required'),
  password: yup.string().min(6, 'Invalid password').required('required'),
});

export const Login = () => {
  const { signUp } = useAuthApi();
  const navigate = useNavigate();

  const handleFormSubmit: any = async (values: object, actions: any) => {
    try {
      const res = await signUp(values);
      if (res.data) {
        // actions.resetForm();
        // navigate('/');
      } else {
        alert('Erreur : Login ou mot de passe incorrect !');
      }
    } catch (error) {
      alert('Erreur : Login ou mot de passe incorrect !');
    }
  };

  return (
    <Box
      sx={{ height: '90vh' }}
      width="1000px"
      margin="0 auto"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box sx={{ width: '350px', border: '1px solid grey', padding: '20px' }}>
        <Typography variant="h1" fontSize="20px" m={2}>
          Login
        </Typography>
        <Box>
          <AppForm
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={controlSchema}
            onSubmit={handleFormSubmit}
          >
            <Box display="flex" flexDirection="column" gap="20px">
              <TextFieldForm
                label="email"
                name="email"
                size="small"
                variant="outlined"
              />
              <TextFieldForm
                label="password"
                name="password"
                size="small"
                variant="outlined"
              />
            </Box>
            <Button type="submit" sx={{ margin: '20px 0' }} variant="contained">
              Inscription
            </Button>
          </AppForm>
        </Box>
      </Box>
    </Box>
  );
};
