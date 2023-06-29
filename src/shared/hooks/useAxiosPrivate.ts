import { useEffect, useRef } from 'react';
import { AuthContext } from '../types/hooks';
import { axiosPrivate } from '../../axios';
import useRefreshToken from './useRefresh';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth }: AuthContext = useAuth();
  const refreshing = useRef(false);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        if (!config.headers['Authorization']) {
          // eslint-disable-next-line no-param-reassign
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent && !refreshing.current) {
          refreshing.current = true;
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          refreshing.current = false;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;