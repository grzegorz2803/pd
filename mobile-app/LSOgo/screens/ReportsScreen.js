import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  ImageBackground,
  TextInput,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavModerator from "../components/BottomNavModerator";

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

export default function RaportsScreen({ navigation }) {
  const [mode, setMode] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("01");
  const [email, setEmail] = useState("uzytkownik@example.com");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState(email);

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Generowanie raportu</Text>

          {/* Przełącznik typu raportu */}
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

          {/* Wybór miesiąca i/lub roku */}
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
          <View style={styles.emailInfoBox}>
            <Text style={styles.emailText}>
              Raport zostanie wysłany na adres:
            </Text>
            <Text style={styles.emailAddress}>{email}</Text>

            <TouchableOpacity onPress={() => setShowEmailModal(true)}>
              <Text style={styles.changeEmailText}>Zmień e-mail</Text>
            </TouchableOpacity>
          </View>

          {/* Przycisk generowania */}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => {
              const reportText =
                mode === "monthly"
                  ? `Generuję raport za ${getMonthLabel(
                      selectedMonth
                    )} ${selectedYear}`
                  : `Generuję raport za rok ${selectedYear}`;
              alert(reportText);
            }}
          >
            <Text style={styles.generateButtonText}>Generuj raport</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal wyboru miesiąca */}
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

        {/* Modal wyboru roku */}
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
        <Modal visible={showEmailModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Zmień adres e-mail</Text>
              <TextInput
                style={styles.input}
                value={newEmail}
                onChangeText={setNewEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="nowy@email.com"
                placeholderTextColor="#a67c52"
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  if (!validateEmail(newEmail)) {
                    alert("Wprowadź poprawny adres e-mail.");
                    return;
                  }
                  setEmail(newEmail);
                  setShowEmailModal(false);
                }}
              >
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <BottomNavModerator navigation={navigation} />
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
    fontSize: RFValue(28),
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
    marginTop: RFValue(10),
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
  generateButton: {
    backgroundColor: "#ddb66f",
    borderRadius: 8,
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(20),
    alignItems: "center",
    marginTop: RFValue(10),
  },
  generateButtonText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
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
  emailInfoBox: {
    backgroundColor: "#fff3d1",
    padding: RFValue(12),
    borderRadius: 8,
    marginTop: RFValue(10),
    alignItems: "center",
    marginBottom: RFValue(20),
  },
  emailText: {
    color: "#4a2d0f",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  emailAddress: {
    color: "#4a2d0f",
    fontSize: RFValue(16),
    marginTop: RFValue(4),
  },
  changeEmailText: {
    marginTop: RFValue(8),
    color: "#0066cc",
    fontSize: RFValue(14),
    textDecorationLine: "underline",
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(10),
    color: "#4a2d0f",
  },
  input: {
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 8,
    padding: RFValue(10),
    backgroundColor: "#fff",
    color: "#4a2d0f",
    marginBottom: RFValue(10),
  },
  confirmButton: {
    backgroundColor: "#ddb66f",
    borderRadius: 8,
    paddingVertical: RFValue(10),
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#4a2d0f",
    fontWeight: "bold",
  },
});
