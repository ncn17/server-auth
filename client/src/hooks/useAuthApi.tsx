/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import { useContext, useEffect } from 'react';
import AuthContext from '../context/authContext';

const ACCESS_COOKIE = '_sctoken';
/**
 * Base service for call server api
 * @example const {registerUser} = useAuthApi();
 * @returns {httpClient}
 */
export const useAuthApi = () => {
  const { setAccessToken, setAuthUser } = useContext(AuthContext);

  const authApi = axios.create({
    baseURL: 'http://127.0.0.1:5017/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // useEffect(() => {
  //   const accessToken = Cookies.get(ACCESS_COOKIE);
  //   console.log('clerc !!!', accessToken);
  //   authApi.interceptors.request.use(
  //     (config): InternalAxiosRequestConfig => {
  //       console.log('clerc', config);
  //       if (accessToken && accessToken.length > 100) {
  //         config.headers.Authorization = `Bearer ${accessToken}`;
  //       }
  //       return config;
  //     },
  //     async (error): Promise<AxiosError> => {
  //       return Promise.reject(error);
  //     }
  //   );

  //   authApi.interceptors.response.use(
  //     (response) => response,
  //     async (error): Promise<AxiosError> => {
  //       const originalRequest = error.config;

  //       if (error.response.status === 401 && !originalRequest.retry) {
  //         originalRequest.retry = true;
  //         const { data } = await authApi.get('refresh-token');
  //         // set auth token
  //         setAccessToken(data.token);
  //         // config and retry
  //         originalRequest.headers.Authorization = `Bearer ${data.token}`;
  //         return authApi(originalRequest);
  //       }

  //       return Promise.reject(error);
  //     }
  //   );

  //   // authApi
  //   //   .get('get/me')
  //   //   .then((res) => console.log(res.data))
  //   //   .catch((err) => console.log(''));

  //   // get client
  // }, [setAccessToken, authApi]);

  /**
   * Call auth server for register new user
   * @param body
   * @returns
   */
  const signIn: any = async (body: object) => authApi.post('user/create', body);

  /**
   * Login user and get AccessToken with refreshToken
   * @param values
   * @returns
   */
  const signUp: any = async (values: object) => authApi.post('login', values);

  const getMe: any = async () => {
    try {
      return await authApi.get('get/me');
    } catch (err) {
      const errors = err as AxiosError;
      return errors.response;
    }
  };

  return { signIn, signUp, getMe, authApi };
};
