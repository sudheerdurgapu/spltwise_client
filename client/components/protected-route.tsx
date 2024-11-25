import React, { useContext } from "react";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AuthContext from "@/context/auth";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { userToken } = useContext(AuthContext);
  const router = useRouter();

  if (userToken === undefined) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!userToken) {
    router.replace("/sign-in");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
