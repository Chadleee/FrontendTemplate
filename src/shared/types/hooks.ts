export type AuthContext = {
  auth: Auth;
  setAuth: (update: any) => void;
  authRefreshing: boolean;
  setAuthRefreshing: (refreshing: boolean) => void;
  login: (username: string, password: string) => void;
  logout: () => void;
  register: (username: string, password: string) => void;
  isValidToken: (access: string | undefined) => boolean;
};

export type Auth = {
  user?: any;
  accessToken?: string;
};