import {
  createContext,
  FC,
  ReactNode,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import Cookies from 'js-cookie';
import { CookieApp } from '../shared/constants/cookieapp';
import { IAuthUser } from '../shared/interfaces/models.interface';
import { AuthContextType } from '../shared/types/contexts.type';
import axios from 'axios';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  authUser: undefined,
  setAuthUser: () => {},
  setAccessToken: () => {},
  logOut: () => {},
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<IAuthUser | undefined>(undefined);

  /**
   * Define accesToken and save it in cookie
   * @param token
   */
  const setAccessToken = (accessToken: string) => {
    const cookieTime = new Date(new Date().getTime() + 15 * 60 * 1000);
    Cookies.set(CookieApp.ACCESS_COOKIE, accessToken, {
      path: '/',
      sameSite: 'Strict',
      secure: true,
      partitioned: true,
      expires: cookieTime,
    });
  };

  const AutoLoginUser = async () => {
    try {
      const accessToken = Cookies.get(CookieApp.ACCESS_COOKIE);
      const api = axios.create({
        baseURL: 'http://127.0.0.1:5017/api',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data } = await api.get('get/me');

      setAccessToken(data.token);
      setAuthUser({
        id: data._id,
        name: data.name,
        email: data.email,
      });
    } catch (err) {
      // console.log(err);
    }
  };

  useLayoutEffect(() => {
    AutoLoginUser();
  }, []);

  /**
   * LogOut User and clean session
   */
  const logOut = () => {
    setAuthUser(undefined);
    Cookies.remove(CookieApp.ACCESS_COOKIE, { path: '' });
    Cookies.remove(CookieApp.REFRESH_COOKIE, { path: '' });
  };

  const value = useMemo(
    () => ({
      authUser,
      setAuthUser,
      setAccessToken,
      logOut,
    }),
    [authUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
