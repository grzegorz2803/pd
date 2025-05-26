import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext();

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
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("isLoggedIn");
      setLoggedIn(false);
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
