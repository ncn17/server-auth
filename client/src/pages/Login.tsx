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
    <Box sx={{ border: '1px solid red' }} width="1000px" margin="0 auto">
      <Typography variant="h1" fontSize="20px" m={2}>
        Login
      </Typography>
      <Box width="600px" margin="0 auto">
        <AppForm
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={controlSchema}
          onSubmit={handleFormSubmit}
        >
          <Box display="flex" flexDirection="column" gap="20px">
            <TextFieldForm label="email" name="email" />
            <TextFieldForm label="password" name="password" />
          </Box>
          <Button type="submit" sx={{ margin: '20px 0' }} variant="contained">
            Inscription
          </Button>
        </AppForm>
      </Box>
    </Box>
  );
};
