export interface User {
  name: string;
  email: string;
}

export interface LoginData {
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
}
