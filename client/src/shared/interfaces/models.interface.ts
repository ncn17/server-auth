export interface IAuthUser {
  id: string;
  name: string;
  email: string;
}

export interface IUserConnect {
  email: string;
  password: string;
}

export interface IApiResponse {
  sucess: boolean;
  message?: string;
  data?: any;
}
