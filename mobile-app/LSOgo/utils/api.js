import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

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
export const handleLogin = async (
  login,
  password,
  rememberMe,
  navigation,
  setLoggedIn
) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: login,
        password: password,
        appType: "mobile",
      }),
    });
    if (response.status === 401) {
      Alert.alert("Błąd:", "Niepoprawny login lub hasło");
      return;
    }
    const data = await response.json();

    const token = data.token;
    const refreshToken = data.refreshToken;
    const decoded = jwtDecode(token);
    const expirationTimestamp = decoded.exp; // czas wygaśnięcia w sekundach
    const role = decoded.role;
    // Konwersja do obiektu Date i sformatowany zapis
    const expirationDate = new Date(expirationTimestamp * 1000);
    console.log("Token wygasa:", expirationDate.toLocaleString());
    if (rememberMe) {
      await AsyncStorage.setItem("Login", login);
      await AsyncStorage.setItem("Password", password);
      await AsyncStorage.setItem("RememberMe", JSON.stringify(rememberMe));
    } else {
      await AsyncStorage.removeItem("Login");
      await AsyncStorage.removeItem("Password");
      await AsyncStorage.removeItem("RememberMe");
    }
    await AsyncStorage.setItem("userToken", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    if (decoded.login_completed === 1) {
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("Role", role);
      setLoggedIn(true);
      navigation.replace("Calendar");
    } else {
      setLoggedIn(false);
      navigation.replace("FirstLogin");
    }
  } catch (error) {
    console.error("Błąd", error);
  }
};

export const sendEmail = async (email) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/send-verification-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.warn("Błąd wysyłania e-maila", data);
    }
    return data;
  } catch (error) {
    console.error("Błąd", error);
  }
};
export const verifyCode = async (code) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("Błąd weryfikacji kodu:", data);
    }

    return data;
  } catch (error) {
    console.error("Błąd", error);
  }
};
export const newPassword = async (password) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/new-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("Błąd zmiany hasła:", data);
    }

    return data;
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

export const registerDeviceToken = async () => {
  try {
    if (Platform.OS !== "android" || !Device.isDevice) {
      console.warn("Push notification wymagają fizycznego urządzenia");
      return;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (finalStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Brak zgody na powiadomienia push");
      return;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync();
    const deviceToken = tokenResponse.data;
    console.log("Token urządzenia", deviceToken);

    // Sprawdź czy użytkownik jest zalogowany (czy istnieje JWT)
    const jwt = await AsyncStorage.getItem("userToken");
    if (!jwt) {
      console.warn("Brak tokena JWT – użytkownik nie jest zalogowany");
      return;
    }

    // Rejestracja tokenu urządzenia z fetchWithAuth
    const response = await fetchWithAuth(`${BASE_URL}/device/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_token: deviceToken,
        platform: Platform.OS,
        app_version: Constants.expoConfig?.version || "unknown",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Błąd rejestracji tokenu:", response.status, err);
    } else {
      console.log("Token urządzenia zarejestrowany pomyślnie");
    }
  } catch (error) {
    console.error("Błąd wysyłania tokenu urządzenia", error);
  }
};

export const getProfilData = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-profil-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Błąd serwera");
    }
    return response.json();
  } catch (error) {
    console.error("Błąd pobierania danych profil", error);
    return null;
  }
};
export const removeRefreshToken = async (refreshToken) => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
        appType: "mobile",
      }),
    });
    return response;
  } catch (error) {
    console.error("Błąd wysłania refreshtoken na serwer", error);
  }
};
export const getRankingData = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-ranking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Błąd serwera");
    }
    return response.json();
  } catch (error) {
    console.error("Błąd pobierania rankingu", error);
    return null;
  }
};
export const getHistoryData = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Brak danych do wyświetlenia");
    }

    return response.json();
  } catch (error) {
    return null;
  }
};
export const sendJustificationText = async (reading_id, message) => {
  try {
    const response = await fetchWithAuth(
      `${BASE_URL}/send-justification-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reading_id: reading_id,
          message: message,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Nie wysłano usprawiedliwienia");
    }
  } catch (error) {
    console.error("Błąd serwera", error);
    return null;
  }
};
export const fetchWithAuth = async (url, options = {}) => {
  let token = await AsyncStorage.getItem("userToken");
  let response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const refreshRes = await fetch(`${BASE_URL}/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
        appType: "mobile",
      }),
    });
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      const newToken = data.token;
      await AsyncStorage.setItem("userToken", newToken);
      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
        },
      });
    } else {
      await AsyncStorage.clear();
      throw new Error("Sesja wygasła. Zaloguj się ponownie");
    }
  }
  return response;
};
