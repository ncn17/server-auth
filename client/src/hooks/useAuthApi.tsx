/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/lines-between-class-members */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';
import { useContext, useEffect } from 'react';
import { useAuth } from '../context/authContext';

const ACCESS_COOKIE = '_sctoken';
/**
 * Base service for call server api
 * @example const {registerUser} = useAuthApi();
 * @returns {httpClient}
 */
export const useAuthApi = () => {
  const { setAccessToken, setAuthUser } = useAuth();

  const authApi = axios.create({
    baseURL: 'http://127.0.0.1:5017/api',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    authApi.interceptors.request.use(
      (config): InternalAxiosRequestConfig => {
        const accessToken = Cookies.get(ACCESS_COOKIE);
        if (accessToken && accessToken.length > 100) {
          console.log('clerc !!!', accessToken);
          console.log('clerc', config);
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      async (error): Promise<AxiosError> => {
        return Promise.reject(error);
      }
    );

    // authApi.get('get/me').then((res) => {
    //   setAuthUser({
    //     id: res.data._id,
    //     name: res.data.name,
    //     email: res.data.email,
    //   });
    // });

    authApi.interceptors.response.use(
      (response) => response,
      async (error): Promise<AxiosError> => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest.retry) {
          originalRequest.retry = true;
          // try refresh token
          const { data } = await authApi.get('refresh-token');
          // save and set auth token
          setAccessToken(data.token);
          originalRequest.headers.Authorization = `Bearer ${data.token}`;

          return authApi(originalRequest);
        }

        return Promise.reject(error);
      }
    );

    // init user
    // checkUserStatus();
  }, []);

  /**
   * Get Client Data
   * @returns ApiResponse
   */
  const getMe: any = async (): Promise<ApiResponse> => {
    try {
      const { data } = await authApi.get('get/me');

      return {
        sucess: true,
        data: {
          id: data._id,
          name: data.name,
          email: data.email,
        },
      };
    } catch (err) {
      // console.log(err);

      return {
        sucess: false,
        message: 'Get Client failled !',
      };
    }
  };

  /**
   * Call auth server for register new user
   * @param body
   * @returns
   */
  const signIn: any = async (body: object) => authApi.post('user/create', body);

  /**
   * Login user and get AccessToken with refreshToken
   * @param values {UserConnect}
   * @returns ApiResponse
   */
  const signUp = async (values: UserConnect): Promise<ApiResponse> => {
    try {
      const res = await authApi.post('login', values);
      // save user token
      setAccessToken(res.data.token);
      const { sucess, data: clientData } = await getMe();
      if (sucess) {
        setAuthUser(clientData);

        return { sucess: true, data: res.data };
      }

      return { sucess: false, message: 'Login failled !' };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          return {
            sucess: false,
            message: 'Incorrect email or password !',
          };
        }
      }
      // console.log(error);
      return {
        sucess: false,
        message: 'Login failled !',
      };
    }
  };

  return { signIn, signUp, getMe, authApi };
};

export interface UserConnect {
  email: string;
  password: string;
}

export interface ApiResponse {
  sucess: boolean;
  message?: string;
  data?: any;
}
