/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { useEffect, useLayoutEffect } from 'react';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from './useAuth';
import {
  IApiResponse,
  IUserConnect,
} from '../shared/interfaces/models.interface';
import { CookieApp } from '../shared/constants/cookieapp';

/**
 * Base service for call server api
 * @example const {registerUser} = useAuthApi();
 * @returns {httpClient}
 */
export const useAuthApi = () => {
  const { setAccessToken, setAuthUser, logOut } = useAuth();

  const ApiUrl = 'http://127.0.0.1:5017/api';
  const authApi = axios.create({
    baseURL: ApiUrl,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useLayoutEffect(() => {
    authApi.interceptors.request.use(
      (config): InternalAxiosRequestConfig => {
        // get token from cookie and assign
        const accessToken = Cookies.get(CookieApp.ACCESS_COOKIE);
        if (accessToken && accessToken.length > 100) {
          // console.log(accessToken);
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
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // try to refresh the acess token
            const { data } = await axios.get('refresh-token', {
              baseURL: ApiUrl,
              withCredentials: true,
            });
            // save and set auth token
            setAccessToken(data.token);
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return authApi(originalRequest);
          } catch (err) {
            // console.log('Token refresh failled !', err);
            const tokenRefreshError = err as any;
            tokenRefreshError.config._retry = true;
            logOut();
            return Promise.reject(tokenRefreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }, []);

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

      const { data } = await getMe();
      setAuthUser({
        id: data._id,
        name: data.name,
        email: data.email,
      });

      return { sucess: true, data: res.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          return {
            sucess: false,
            message: 'Incorrect email or password !',
          };
        }
      }
      console.log(error);
      return {
        sucess: false,
        message: 'Login failled !',
      };
    }
  };

  return { signIn, signUp, getMe, authApi };
};
