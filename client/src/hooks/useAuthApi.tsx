import axios from 'axios';

/**
 * Base service for call server auth api
 * @example const {registerUser} = useAuthApi();
 * @returns {httpClient}
 */
export const useAuthApi = () => {
  const authApi = axios.create({
    baseURL: 'http://127.0.0.1:5017',
    withCredentials: true,
  });

  const signIn: any = async (body: object) => {
    try {
      const res = await authApi.post('user/create', body);
      return res.data;
    } catch (error) {
      return {};
    }
  };

  const signUp: any = async (values: object) => {
    try {
      const res = await authApi.post('login', values);
      return res;
    } catch (error) {
      return {};
    }
  };

  const getMe: any = async () => {
    try {
      const res = await authApi.get('get/me');
      return res;
    } catch (error) {
      return {};
    }
  };

  return { signIn, signUp, getMe };
};
