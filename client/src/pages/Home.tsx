/* eslint-disable react/jsx-no-useless-fragment */
import { useNavigate } from 'react-router-dom';
import { useAuthApi } from '../hooks/useAuthApi';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { isLoading } = useAuth();
  const { getMe } = useAuthApi();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await getMe();
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <p>loading....</p>
      ) : (
        <div>
          <h1>Dashboard</h1>
          <p>Simple dashboard for auth</p>
          <button type="submit" onClick={() => navigate('/login')}>
            Check Login
          </button>
          <br />
          <button type="submit" onClick={() => handleSubmit()}>
            GeMe
          </button>
        </div>
      )}
    </>
  );
}
