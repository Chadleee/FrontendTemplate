import { createContext, useState } from 'react';
import jwtDecode from 'jwt-decode';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Auth } from '../types/hooks';
import { AuthContext as AuthContextType } from '../types/hooks';

const isValidToken = (accessToken: string | undefined) => {
  if (!accessToken){
    return false;
  }

  const decodedToken: any = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;
  return decodedToken?.exp > currentTime;
};

const AuthContext = createContext<AuthContextType>({
  auth: {},
  setAuth: () => {},
  authRefreshing: false,
  setAuthRefreshing: () => {},
  login: () => {},
  logout: () => {},
  register: () => {},
  isValidToken: isValidToken,
});

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState<Auth>({});
  const [authRefreshing, setAuthRefreshing] = useState(false);
  const axios = useAxiosPrivate();

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      setAuth({ ...response.data});
      return { response };
    }
    catch (error) {
      return error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        password,
      });
      setAuth({ ...response.data});
      return { response };
    }
    catch (error) {
      return error;
    }
  };

  const logout = async () => {
    await axios.post(`/api/auth/logout/${auth?.user?.id}`);
    setAuth({});
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        authRefreshing,
        setAuthRefreshing,
        login,
        logout,
        register,
        isValidToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
