export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('access_token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('access_token');
  },
  
  getUser: (): any => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  setUser: (user: any): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  removeUser: (): void => {
    localStorage.removeItem('user');
  },
  
  clearAll: (): void => {
    localStorage.clear();
  }
};