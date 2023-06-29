import { Auth } from '../types/hooks';
import { AxiosResponse } from 'axios';  
import useAuth from './useAuth';
import axios from '../../axios';

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response: AxiosResponse = await axios.get('/api/auth/refresh', {
      withCredentials: true,
    });

    setAuth((prev: Auth) => ({
      ...prev,
      accessToken: response.data.accessToken,
      user: response.data?.user,
    }));

    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;