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
    return await response.json();
  } catch (error) {
    console.error("Błąd pobierania danych o aplikacji ", error.message);
  }
};
