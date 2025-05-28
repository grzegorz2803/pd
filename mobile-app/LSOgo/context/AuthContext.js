import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext();
import { removeRefreshToken } from "../utils/api";

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);
  useEffect(() => {
    const checkLogin = async () => {
      const value = await AsyncStorage.getItem("isLoggedIn");
      setLoggedIn(value === "true");
    };
    checkLogin();
  }, []);
  const logout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const response = await removeRefreshToken(refreshToken);
      if (!response.ok) {
        console.error("Nie udało sie wylogować");
        return false;
      }

      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("isLoggedIn");
      await AsyncStorage.removeItem("Role");
      setLoggedIn(false);
      return true;
    } catch (error) {
      console.error("Bład usuwania danych logowania", error);
    }
  };
  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
