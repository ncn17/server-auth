import { IAuthUser } from '../interfaces/models.interface';

export type AuthContextType = {
  authUser: IAuthUser | undefined,
  setAuthUser: (value: IAuthUser) => void,
  setAccessToken: (token: string) => void,
  logOut: () => void,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
};
