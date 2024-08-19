import { useLayoutEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import * as yup from 'yup';
import { AppForm } from '../components/formik';
import { TextFieldForm } from '../components/texfieldForm';
import { useAuthApi } from '../hooks/useAuthApi';
import { useAuth } from '../hooks/useAuth';

const controlSchema = yup.object().shape({
  email: yup.string().email('Invalid email passed').required('required'),
  password: yup.string().min(6, 'Invalid password').required('required'),
});

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuthApi();
  const { authUser } = useAuth();
  const [errMsg, setErrMsg] = useState<string | undefined>('');

  useLayoutEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  const handleFormSubmit: any = async (
    values: any,
    { resetForm, setFieldValue }: FormikHelpers<object>
  ) => {
    const res = await signUp(values);
    if (res.sucess) {
      resetForm();
      setErrMsg(res.data.message);

      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate('/');
      }
    } else {
      setErrMsg(res.message);
      setFieldValue('password', '');
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
        <Box>
          <AppForm
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={controlSchema}
            onSubmit={handleFormSubmit}
          >
            <Box display="flex" flexDirection="column" gap="10px">
              <TextFieldForm
                label="email"
                name="email"
                size="small"
                variant="outlined"
              />
              <Box sx={{ marginTop: '0px', textAlign: 'right' }}>
                <Link
                  to="/signup"
                  style={{
                    textTransform: 'none',
                    color: 'blue',
                    textDecoration: 'none',
                    margin: '0px',
                  }}
                >
                  Mot de passe oublier ?
                </Link>
              </Box>
              <TextFieldForm
                label="password"
                name="password"
                size="small"
                variant="outlined"
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
              Connexion
            </Button>
          </AppForm>

          <Typography
            style={{
              textTransform: 'none',
              textDecoration: 'none',
            }}
          >
            Pas encore Inscrit ?{' '}
            <Link
              to="/signup"
              style={{
                textTransform: 'none',
                color: 'blue',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Creer un compte
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
