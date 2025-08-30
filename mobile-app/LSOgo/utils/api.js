import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { Alert } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = "http://192.168.1.193:3000/api";
// const { logout } = useContext(AuthContext);

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
export const getNotification = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-notification`, {
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
    console.error("Błąd serwera: ", error);
    return null;
  }
};
export const deleteNotification = async (type, id) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/delete-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, id }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Błąd usuwania");
    return data;
  } catch (error) {
    throw error;
  }
};
export const sendMessage = async (subject, message) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subject, message }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Błąd wysyłania wiadomości");
    return data;
  } catch (error) {
    throw error;
  }
};
export const getRankingAll = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-ranking-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Błąd pobierania rankingu");
    return data;
  } catch (error) {
    throw error;
  }
};
export const getRankingMonth = async (month, year) => {
  const response = await fetchWithAuth(`${BASE_URL}/get-ranking-month`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ month, year }),
  });
  const data = await response.json();
  console.log(data);
  if (!response.ok) throw new Error(data.message || "Błąd pobierania danych");
  return data.monthlyRanking; // zakładamy taki format!
};

export const getRankingYear = async (year) => {
  const response = await fetchWithAuth(`${BASE_URL}/get-ranking-year`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Błąd pobierania danych");
  return data.yearlyRanking; // zakładamy taki format!
};
export const getReadingsByCardId = async (cardId) => {
  const response = await fetchWithAuth(`${BASE_URL}/get-recent-readings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ card_id: cardId }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
};
export const getUsersForMeating = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-users-for-meating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Błąd pobierania rankingu");
    return data;
  } catch (error) {
    throw error;
  }
};
export const submitMeatingResults = async (results) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/submit-meating-results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ results }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Błąd zapisu wyników zbiórki");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const getSchedules = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-schedule-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Błąd pobierania harmonogramu");
    return data;
  } catch (error) {
    throw error;
  }
};
export const sendSchedule = async ({ dateFrom, dateTo, selectedUsersMap }) => {
  try {
    const payload = {
      date_from: dateFrom,
      date_to: dateTo,
      schedule: Object.entries(selectedUsersMap).map(([key, user_ids]) => {
        const [day_of_week, time] = key.split("_");
        return {
          day_of_week,
          time,
          user_ids,
        };
      }),
    };

    const response = await fetchWithAuth(`${BASE_URL}/save-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Błąd zapisu harmonogramu");
    return data;
  } catch (error) {
    throw error;
  }
};
export const getRecentReadings = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-recent-readings30`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Błąd pobierania ostatnich odczytów");
    }
    return data;
  } catch (error) {
    throw error;
  }
};
export const getUserRecentReadings = async (cardId) => {
  try {
    const response = await fetchWithAuth(
      `${BASE_URL}/get-user-recent-readings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId }),
      }
    );
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Błąd pobierania odczytów użytkownika");
    return data;
  } catch (error) {
    throw error;
  }
};
export const getReadingsByDate = async (date) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-readings-by-date`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    });

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Błąd pobierania odczytów dla daty");
    return data;
  } catch (error) {
    console.error("API błąd:", error);
    throw error;
  }
};
export const sendModeratorMessage = async (title, body, recipientCardId) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/send-message-moderator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: title,
        body,
        recipient_id: recipientCardId || null,
      }),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.message || "Nie udało się wysłać wiadomości");

    return data;
  } catch (error) {
    console.error("Błąd wysyłania wiadomości:", error);
    throw error;
  }
};
export const sendReportByEmail = async ({ mode, month, year }) => {
  console.log(mode, month, year);
  try {
    const payload = {
      type: mode, // "monthly" lub "yearly"
      year,
      ...(mode === "monthly" && { month }), // tylko jeśli miesięczny
    };

    const response = await fetchWithAuth(`${BASE_URL}/send-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Błąd wysyłania raportu");
    }

    return data;
  } catch (error) {
    console.error("Błąd wysyłania raportu:", error);
    throw error;
  }
};
export const addService = async ({
  name,
  hour,
  points,
  date,
  day_of_week,
  month_from,
  month_to,
}) => {
  try {
    const payload = {
      name,
      hour,
      points: parseInt(points),
      ...(date && { date }),
      ...(day_of_week && { day_of_week }),
      ...(month_from && { month_from }),
      ...(month_to && { month_to }),
    };

    const response = await fetchWithAuth(`${BASE_URL}/add-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Błąd dodawania nabożeństwa");
    }

    return data;
  } catch (error) {
    console.error("Błąd dodawania nabożeństwa:", error);
    throw error;
  }
};
export const getModeratorNotifications = async () => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/get-notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Błąd pobierania powiadomień");
    }

    return data;
  } catch (err) {
    console.error("Błąd pobierania powiadomień:", err);
    throw err;
  }
};
export const updateJustificationStatus = async ({
  reading_id,
  card_id,
  status,
}) => {
  try {
    const response = await fetchWithAuth(`${BASE_URL}/update-justification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reading_id, card_id, status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Błąd zmiany statusu usprawiedliwienia");
    }

    return data;
  } catch (err) {
    console.error("Błąd zmiany statusu usprawiedliwienia:", err);
    throw err;
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
      // await logout();
      throw new Error("Sesja wygasła. Zaloguj się ponownie");
    }
  }
  return response;
};
