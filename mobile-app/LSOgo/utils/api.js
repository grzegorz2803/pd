import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { Alert } from "react-native";

const BASE_URL = "http://192.168.1.193:3000/api";

export async function isServerAvailable() {
  try {
    const response = await fetch(`${BASE_URL}/data`, { method: "GET" });
    return response.ok;
  } catch (error) {
    return false;
  }
}
export const fetchTodayLiturgicalData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/calendar/today`);
    if (!response.ok) throw new Error("Błąd serwera");
    return await response.json();
  } catch (error) {
    console.error("Błąd pobierania danych z serwera na dziś:", error.message);
    return null;
  }
};
export const fetchWeekLiturgicalData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/calendar/week`);
    if (!response.ok) throw new Error("Błąd serwera");
    return await response.json();
  } catch (error) {
    console.error(
      "Błąd pobierania danych z serwera dla tygodnia",
      error.message
    );
    return [];
  }
};
export const fetchAboutAppData = async (version) => {
  try {
    const response = await fetch(`${BASE_URL}/about/${version}`);
    if (!response.ok) throw new Error("Błąd serwera");
    return response.json();
  } catch (error) {
    console.error("Błąd pobierania danych o aplikacji ", error.message);
  }
};
export const handleLogin = async (login, password, rememberMe, navigation) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    });
    if (response.status === 401) {
      Alert.alert("Błąd", "Niepoprawny login lub hasło");
    }
    const data = await response.json();
    const token = data.token;
    const decoded = jwtDecode(token);
    console.log(decoded);
    if (decoded.login_completed === 1) {
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("userToken", token);
      navigation.replace("Calendar");
    } else {
      await AsyncStorage.setItem("userToken", token);
      navigation.replace("FirstLogin");
    }
  } catch (error) {
    console.error("Błąd", error);
  }
};

export const sendEmail = async (email) => {
  try {
    const jwt = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${BASE_URL}/send-verification-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      return await response.json();
    }
    return await response.json();
  } catch (error) {
    console.error("Błąd", error);
  }
};
export const verifyCode = async (code) => {
  try {
    const jwt = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${BASE_URL}/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) {
      const text = await response.json();
      Alert.alert("Błąd:", response.status, text.message);
      throw new Error("Błąd podczas wysyłania emaila");
    }
    return await response.json();
  } catch (error) {
    console.error("Błąd", error);
  }
};
export const newPassword = async (password) => {
  try {
    const jwt = await AsyncStorage.getItem("userToken");
    const response = await fetch(`${BASE_URL}/new-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Błąd", error);
  }
};

export const handleCancel = (navigation) => {
  navigation.replace("Calendar");
};
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};
