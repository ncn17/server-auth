/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useLayoutEffect } from 'react';
import { useAuth } from './useAuth';
import { CookieApp } from '../shared/constants/cookieapp';
import {
  IApiResponse,
  IUserConnect,
} from '../shared/interfaces/models.interface';

export const authApi = axios.create({
  baseURL: 'http://127.0.0.1:5017/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Base service for call server api
 * @example const {registerUser} = useAuthApi();
 * @returns {httpClient}
 */
export const useAuthApi = () => {
  const { setAccessToken, setAuthUser } = useAuth();

  useEffect(() => {
    authApi.interceptors.request.use(
      (config): InternalAxiosRequestConfig => {
        const accessToken = Cookies.get(CookieApp.ACCESS_COOKIE);
        console.log('req => ', config);
        if (accessToken && accessToken.length > 100) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      async (error): Promise<AxiosError> => {
        return Promise.reject(error);
      }
    );

    authApi.interceptors.response.use(
      (response) => response,
      async (error): Promise<AxiosError> => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest.retry) {
          originalRequest.retry = true;
          console.log('refresh => ');
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
  }, [authApi, setAccessToken]);

  /**
   * Get Client Data
   * @returns ApiResponse
   */
  const getMe: any = async (): Promise<IApiResponse> => {
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
  const signUp = async (values: IUserConnect): Promise<IApiResponse> => {
    try {
      const res = await authApi.post('login', values);
      // save or update user token
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
