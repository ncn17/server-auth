/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import Cookies from 'js-cookie';

interface AuthProviderProps {
  children: ReactNode;
}

type AuthUserProps = {
  id: string,
  name: string,
  email: string,
} | null;

const ACCESS_COOKIE = '_sctoken';
const AuthContext = createContext({});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUserProps>(null);

  /**
   * Define accesToken and save it in cookie
   * @param token
   */
  const setAccessToken = (accessToken: string) => {
    const cookieTime = new Date(new Date().getTime() + 15 * 60 * 1000);
    Cookies.set(ACCESS_COOKIE, accessToken, {
      path: '/',
      sameSite: 'Strict',
      secure: true,
      partitioned: true,
      expires: cookieTime,
    });
  };

  const value = useMemo(
    () => ({
      authUser,
      setAuthUser,
      setAccessToken,
    }),
    [authUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
