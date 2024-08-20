/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  FC,
  ReactNode,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { CookieApp } from '../shared/constants/cookieapp';
import { IAuthUser } from '../shared/interfaces/models.interface';
import { AuthContextType } from '../shared/types/contexts.type';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  authUser: undefined,
  setAuthUser: () => {},
  setAccessToken: () => {},
  logOut: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<IAuthUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Define accesToken and save it in cookie
   * @param token
   */
  const setAccessToken = (accessToken: string) => {
    const cookieTime = new Date(new Date().getTime() + 15 * 60 * 1000);
    Cookies.set(CookieApp.ACCESS_COOKIE, accessToken, {
      path: '/',
      sameSite: 'Strict',
      // secure: true,
      partitioned: true,
      expires: cookieTime,
    });
  };

  /**
   * LogOut User and clean session
   */
  const logOut = () => {
    setAuthUser(undefined);
    Cookies.remove(CookieApp.ACCESS_COOKIE, { path: '/' });
    Cookies.remove(CookieApp.REFRESH_COOKIE, { path: '/' });
  };

  /**
   * CheckUserStaus for Init state and token session
   */
  const CheckUserStatus = async () => {
    try {
      setIsLoading(true);
      const authServer = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // try refrsh user tokens
      const res = await authServer.get('refresh-token');
      setAccessToken(res.data.token);
      authServer.defaults.headers.Authorization = `Bearer ${Cookies.get(CookieApp.ACCESS_COOKIE)}`;

      // check auth and get user data
      const { data } = await authServer.get('get/me');
      setAuthUser({
        id: data._id,
        name: data.name,
        email: data.email,
      });
    } catch (error) {
      // console.log('Init user auth failled !');
    }
    setIsLoading(false);
  };

  useLayoutEffect(() => {
    CheckUserStatus();
  }, []);

  const value = useMemo(
    () => ({
      authUser,
      setAuthUser,
      setAccessToken,
      logOut,
      isLoading,
      setIsLoading,
    }),
    [authUser, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
