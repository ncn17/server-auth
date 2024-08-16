import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthApi } from '../hooks/useAuthApi';

export default function Home() {
  const { getMe } = useAuthApi();
  const navigate = useNavigate();
  /*
  useEffect(() => {
    getMe()
      .then((res) => console.log(res.data))
      .catch((error) => console.log(error));
  });
*/
  return (
    <>
      <h1>Dashboard</h1>
      <p>Simple dashboard for auth</p>
    </>
  );
}
