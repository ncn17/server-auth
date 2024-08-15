import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { AppForm } from '../components/formik';
import { TextFieldForm } from '../components/texfieldForm';
import { useAuthApi } from '../hooks/useAuthApi';

const controlSchema = yup.object().shape({
  name: yup.string().required('required'),
  email: yup.string().email('Invalid email passed').required('required'),
  password: yup.string().min(6, 'Invalid password').required('required'),
});

export const Register = () => {
  const { signIn } = useAuthApi();
  const navigate = useNavigate();

  const handleFormSubmit: any = async (values: object, actions: any) => {
    try {
      const res = await signIn(values);
      if (res) {
        actions.resetForm();
        navigate('/login');
      } else {
        alert('Inscription échouer !');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ border: '1px solid red' }} width="1000px" margin="0 auto">
      <Typography variant="h1" fontSize="20px" m={2}>
        Register new user
      </Typography>
      <Box width="600px" margin="0 auto">
        <AppForm
          initialValues={{
            name: '',
            email: '',
            password: '',
          }}
          validationSchema={controlSchema}
          onSubmit={handleFormSubmit}
        >
          <Box display="flex" flexDirection="column" gap="20px">
            <TextFieldForm label="name" name="name" />
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
