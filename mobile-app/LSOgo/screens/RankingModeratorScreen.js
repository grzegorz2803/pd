import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Modal,
} from "react-native";
import BottomNavModerator from "../components/BottomNavModerator";
import { RFValue } from "react-native-responsive-fontsize";
import { AuthContext } from "../context/AuthContext";
import { getRankingMonth, getRankingYear, getRankingAll } from "../utils/api";

export default function ModeratorRankingScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
  const [noData, setNoData] = useState(false);

  const [mode, setMode] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const months = [
    { label: "Styczeń", value: "01" },
    { label: "Luty", value: "02" },
    { label: "Marzec", value: "03" },
    { label: "Kwiecień", value: "04" },
    { label: "Maj", value: "05" },
    { label: "Czerwiec", value: "06" },
    { label: "Lipiec", value: "07" },
    { label: "Sierpień", value: "08" },
    { label: "Wrzesień", value: "09" },
    { label: "Październik", value: "10" },
    { label: "Listopad", value: "11" },
    { label: "Grudzień", value: "12" },
  ];

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  const getMonthLabel = (value) => {
    const found = months.find((m) => m.value === value);
    return found ? found.label : value;
  };

  useEffect(() => {
    loadRanking();
  }, []);

  useEffect(() => {
    if (mode === "monthly") {
      setRankingData(
        monthlyData.length > 0
          ? monthlyData.filter(
              (r) =>
                selectedMonth === currentMonth && selectedYear === currentYear
            )
          : []
      );
    } else {
      setRankingData(
        yearlyData.length > 0
          ? yearlyData.filter((r) => selectedYear === currentYear)
          : []
      );
    }
  }, [mode, selectedMonth, selectedYear, monthlyData, yearlyData]);

  const [currentMonth, setCurrentMonth] = useState("01");
  const [currentYear, setCurrentYear] = useState(
    new Date().getFullYear().toString()
  );

  const loadRanking = async () => {
    try {
      setLoading(true);
      const data = await getRankingAll();
      setCurrentMonth(data.current_month);
      setCurrentYear(data.current_year);
      setSelectedMonth(data.current_month);
      setSelectedYear(data.current_year);
      setMonthlyData(data.monthlyRanking || []);
      setYearlyData(data.yearlyRanking || []);
      setRankingData(data.monthlyRanking || []);
    } catch (error) {
      console.error("Błąd pobierania rankingu:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchRankingData = async (month, year, mode) => {
    setLoading(true);
    setNoData(false);
    try {
      let data = [];

      if (mode === "monthly") {
        const response = await getRankingMonth(month, year); // zakładamy że zwraca tablicę
        data = response || [];
      } else {
        const response = await getRankingYear(year);
        data = response || [];
      }

      setRankingData(data);
      setNoData(data.length === 0);
    } catch (error) {
      console.error("Błąd pobierania rankingu:", error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };
  console.log(rankingData);
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Ranking</Text>

          {/* Przełącznik */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "monthly" && styles.activeToggle,
              ]}
              onPress={() => {
                setMode("monthly");
                fetchRankingData(selectedMonth, selectedYear, "monthly");
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "monthly" && styles.activeToggleText,
                ]}
              >
                Miesięczny
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "yearly" && styles.activeToggle,
              ]}
              onPress={() => {
                setMode("yearly");
                fetchRankingData(null, selectedYear, "yearly");
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "yearly" && styles.activeToggleText,
                ]}
              >
                Roczny
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filtry */}
          <View style={styles.filterRow}>
            {mode === "monthly" && (
              <TouchableOpacity
                style={styles.pickerField}
                onPress={() => setShowMonthPicker(true)}
              >
                <Text style={styles.label}>Miesiąc</Text>
                <Text style={styles.value}>{getMonthLabel(selectedMonth)}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.pickerField}
              onPress={() => setShowYearPicker(true)}
            >
              <Text style={styles.label}>Rok</Text>
              <Text style={styles.value}>{selectedYear}</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#6e4b1f"
              style={{ marginTop: 20 }}
            />
          ) : noData ? (
            <Text style={styles.noData}>Brak danych dla tego okresu.</Text>
          ) : rankingData.length > 0 ? (
            (() => {
              let lastTotal = null;
              let lastRank = 0;
              let realIndex = 0; // Liczy prawdziwą pozycję z uwzględnieniem remisów

              return rankingData.map((item, index) => {
                const isSame = item.total === lastTotal;
                const rank = isSame ? lastRank : ++realIndex;

                if (!isSame) {
                  lastTotal = item.total;
                  lastRank = rank;
                } else {
                  realIndex++; // też przesuwamy, żeby numeracja była poprawna
                }

                // Kolorowanie:
                const isTop3 = rank <= 3;
                const isNegative = item.total < 0;
                const highlightColor = isNegative
                  ? "#c62828" // czerwony
                  : isTop3
                  ? "#2e7d32" // zielony
                  : "#4a2d0f"; // domyślny brąz

                return (
                  <View key={item.card_id || index} style={styles.rankingBox}>
                    <Text style={styles.rank}>{rank}.</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.name, { color: highlightColor }]}>
                        {item.name}
                      </Text>
                      <Text style={styles.details}>
                        Służba: {item.service} pkt
                      </Text>
                      <Text style={styles.details}>
                        Zbiórki: {item.meetings} pkt
                      </Text>
                    </View>
                    <Text style={[styles.total, { color: highlightColor }]}>
                      {item.total}
                    </Text>
                  </View>
                );
              });
            })()
          ) : (
            <Text style={{ textAlign: "center", color: "#4a2d0f" }}>
              Brak danych dla wybranego okresu.
            </Text>
          )}
        </ScrollView>

        {/* Modale wyboru */}
        <Modal visible={showMonthPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {months.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  onPress={() => {
                    setSelectedMonth(m.value);
                    setShowMonthPicker(false);
                    fetchRankingData(m.value, selectedYear, "monthly");
                  }}
                >
                  <Text style={styles.modalOption}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <Modal visible={showYearPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {years.map((y) => (
                <TouchableOpacity
                  key={y}
                  onPress={() => {
                    setSelectedYear(y);
                    setShowYearPicker(false);
                    fetchRankingData(
                      mode === "monthly" ? selectedMonth : null,
                      y,
                      mode
                    );
                  }}
                >
                  <Text style={styles.modalOption}>{y}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {loggedIn && <BottomNavModerator navigation={navigation} />}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: RFValue(16),
    paddingBottom: RFValue(80),
  },
  title: {
    fontSize: RFValue(32),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(20),
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: RFValue(10),
  },
  toggleButton: {
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(20),
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 8,
    marginHorizontal: RFValue(5),
  },
  toggleText: {
    color: "#4a2d0f",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  activeToggle: {
    backgroundColor: "#ddb66f",
  },
  activeToggleText: {
    color: "#000",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(20),
  },
  pickerField: {
    flex: 1,
    marginHorizontal: RFValue(5),
    backgroundColor: "#ffc854",
    borderRadius: 8,
    padding: RFValue(10),
    alignItems: "center",
  },
  label: {
    color: "#4a2d0f",
    fontWeight: "bold",
    fontSize: RFValue(14),
  },
  value: {
    fontSize: RFValue(16),
    color: "#4a2d0f",
    marginTop: RFValue(4),
  },
  rankingBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: RFValue(10),
    borderBottomWidth: 1,
    borderBottomColor: "#c4a46d",
  },
  rank: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    width: RFValue(24),
    color: "#4a2d0f",
  },
  name: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  details: {
    fontSize: RFValue(14),
    color: "#4a2d0f",
  },
  total: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginLeft: RFValue(10),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffeca8",
    borderRadius: 10,
    padding: RFValue(16),
    width: "80%",
  },
  modalOption: {
    paddingVertical: RFValue(10),
    fontSize: RFValue(16),
    color: "#000",
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    color: "#4a2d0f",
    fontSize: RFValue(16),
    fontStyle: "italic",
    marginTop: RFValue(20),
  },
});
