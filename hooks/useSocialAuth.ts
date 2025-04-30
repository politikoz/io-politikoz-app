import { useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export function useSocialAuth() {
  const LOCAL_STORAGE_KEY = "discord_user";
  const [user, setUser] = useState<User | null>(null);

  // Carregar o usuário do LocalStorage na inicialização
  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const authenticate = (userInfo: User) => {
    setUser(userInfo);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userInfo));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return { user, authenticate, logout };
}
