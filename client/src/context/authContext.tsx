import { createContext, FC, ReactNode, useMemo, useState } from 'react';
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
