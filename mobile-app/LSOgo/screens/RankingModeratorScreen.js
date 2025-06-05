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
import { getRankingAll } from "../utils/api"; // zakładamy że masz tę funkcję

export default function ModeratorRankingScreen({ navigation }) {
  const [mode, setMode] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [monthlyRanking, setMonthlyRanking] = useState([]);
  const [yearlyRanking, setYearlyRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const { loggedIn } = useContext(AuthContext);

  const monthsLabels = [
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

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const data = await getRankingAll();

        setSelectedMonth(data.current_month);
        setSelectedYear(data.current_year);
        setAvailableMonths(data.available_months || []);
        setAvailableYears(data.available_years || []);
        setMonthlyRanking(data.monthlyRanking);
        setYearlyRanking(data.yearlyRanking);
      } catch (error) {
        console.error("Błąd podczas pobierania danych rankingu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const getMonthLabel = (value) => {
    const found = monthsLabels.find((m) => m.value === value);
    return found ? found.label : value;
  };

  const displayedRanking = mode === "monthly" ? monthlyRanking : yearlyRanking;

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Ranking</Text>

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "monthly" && styles.activeToggle,
              ]}
              onPress={() => setMode("monthly")}
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
              onPress={() => setMode("yearly")}
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
          ) : (
            displayedRanking.map((item, index) => (
              <View key={item.card_id || index} style={styles.rankingBox}>
                <Text style={styles.rank}>{index + 1}.</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.details}>Służba: {item.service} pkt</Text>
                  <Text style={styles.details}>
                    Zbiórki: {item.meetings} pkt
                  </Text>
                </View>
                <Text style={styles.total}>{item.total}</Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Modale wyboru miesięcy i lat */}
        <Modal visible={showMonthPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {availableMonths.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => {
                    setSelectedMonth(m);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text style={styles.modalOption}>{getMonthLabel(m)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <Modal visible={showYearPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {availableYears.map((y) => (
                <TouchableOpacity
                  key={y}
                  onPress={() => {
                    setSelectedYear(y);
                    setShowYearPicker(false);
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
});
