import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormikHelpers } from 'formik';
import * as yup from 'yup';
import { AppForm } from '../components/formik';
import { TextFieldForm } from '../components/texfieldForm';
import { useAuthApi } from '../hooks/useAuthApi';

const controlSchema = yup.object().shape({
  name: yup.string().required('required'),
  email: yup.string().email('Invalid email passed').required('required'),
  password: yup.string().min(8, 'Invalid password').required('required'),
});

export const Register = () => {
  const { signIn } = useAuthApi();
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit: any = async (
    values: object,
    { resetForm, setFieldValue }: FormikHelpers<object>
  ) => {
    try {
      await signIn(values);
      resetForm();
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrMsg('Email is already used !');
        } else {
          setErrMsg('Subscription failled !');
        }
      } else {
        setErrMsg('Subscription failled !');
      }
      setFieldValue('password', '');
      // console.log(error);
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
          Register new user
        </Typography>

        {errMsg && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'normal',
              textTransform: 'none',
              color: 'red',
              fontSize: '14px',
            }}
            margin="10px 0"
          >
            Error : {errMsg}
          </Typography>
        )}
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
            <TextFieldForm
              label="name"
              size="small"
              variant="outlined"
              name="name"
            />
            <TextFieldForm
              label="email"
              size="small"
              variant="outlined"
              name="email"
              type="email"
            />
            <TextFieldForm
              label="password"
              size="small"
              variant="outlined"
              name="password"
              type="password"
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            sx={{
              margin: '20px 0',
              backgroundColor: 'green',
              textTransform: 'none',
            }}
            variant="contained"
          >
            Inscription
          </Button>
        </AppForm>
        <Typography
          style={{
            textTransform: 'none',
            textDecoration: 'none',
          }}
        >
          Déja inscrit ?{' '}
          <Link
            to="/login"
            style={{
              textTransform: 'none',
              color: 'blue',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Se connecter
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
