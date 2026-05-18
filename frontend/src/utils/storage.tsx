export const storage = {
  setToken(token: string): void {
    localStorage.setItem('token', token);
  },
  
  getToken(): string | null {
    return localStorage.getItem('token');
  },
  
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  clearAll(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_type');
  }
};