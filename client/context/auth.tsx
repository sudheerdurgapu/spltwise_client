import React, { createContext, useState, useEffect } from "react";
import { getToken, removeToken, saveToken } from "@/utils/authStorage";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

type Returns = {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  userToken: string | null | undefined;
};

const AuthContext = createContext<Returns>({} as Returns);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [userToken, setUserToken] = useState<string | null | undefined>(null);
  const querClient = useQueryClient();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setUserToken(token);
    };

    checkToken();
  }, []);

  const login = async (token: string) => {
    await saveToken(token);
    setUserToken(token);
  };

  const logout = async () => {
    setUserToken(null);
    await removeToken();
    querClient.clear();
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
