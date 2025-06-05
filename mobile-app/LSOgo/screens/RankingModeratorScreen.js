import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  FlatList,
  Modal,
} from "react-native";
import BottomNavModerator from "../components/BottomNavModerator";
import { RFValue } from "react-native-responsive-fontsize";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function ModeratorRankingScreen({ navigation }) {
  const [mode, setMode] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("06");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [loading, setLoading] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const { loggedIn } = useContext(AuthContext);

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

  const years = ["2025", "2024"];

  const rankingData = [
    { id: 1, name: "Jan Kowalski", service: 80, meetings: 15, total: 95 },
    { id: 2, name: "Adam Nowak", service: 78, meetings: 12, total: 90 },
    {
      id: 3,
      name: "Krzysztof Wiśniowski",
      service: 70,
      meetings: 10,
      total: 80,
    },
    { id: 4, name: "Tomasz Zieliński", service: 65, meetings: 9, total: 74 },
  ];

  const getMonthLabel = (value) => {
    const found = months.find((m) => m.value === value);
    return found ? found.label : value;
  };

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
            rankingData.map((item, index) => (
              <View key={item.id} style={styles.rankingBox}>
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

        <Modal visible={showMonthPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {months.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  onPress={() => {
                    setSelectedMonth(m.value);
                    setShowMonthPicker(false);
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
