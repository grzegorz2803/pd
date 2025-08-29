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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavModerator from "../components/BottomNavModerator";
import { addService } from "../utils/api";

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

const daysOfWeek = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function AddServiceScreen({ navigation }) {
  const [name, setName] = useState("");
  const [hour, setHour] = useState("");
  const [points, setPoints] = useState("");
  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [monthFrom, setMonthFrom] = useState(null);
  const [monthTo, setMonthTo] = useState(null);
  const [showMonthFromPicker, setShowMonthFromPicker] = useState(false);
  const [showMonthToPicker, setShowMonthToPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleAdd = async () => {
    if (!name.trim() || !hour.trim() || !points.trim()) {
      setErrorMessage(
        "Uzupełnij wszystkie wymagane pola: nazwa, godzina, punkty."
      );
      return;
    }

    if (isNaN(points)) {
      setErrorMessage("Punkty muszą być liczbą.");
      return;
    }

    setErrorMessage("");

    const payload = {
      name,
      hour,
      points: parseInt(points),
      date: date ? date.toISOString().split("T")[0] : null,
      day_of_week: selectedDay || null,
      month_from: monthFrom,
      month_to: monthTo,
    };

    try {
      await addService(payload);
      alert("Nabożeństwo zostało dodane.");
      clearOptionalFields();
    } catch (error) {
      console.error("Błąd dodawania nabożeństwa:", error);
      alert("Wystąpił błąd podczas dodawania nabożeństwa.");
    }
  };

  const clearOptionalFields = () => {
    setDate(null);
    setName("");
    setHour("");
    setPoints("");
    setSelectedDay(null);
    setMonthFrom(null);
    setMonthTo(null);
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Dodaj nabożeństwo</Text>

          <Text style={styles.label}>Nazwa nabożeństwa *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nazwa nabożeństwa"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Godzina *</Text>
          <TextInput
            style={styles.input}
            value={hour}
            onChangeText={setHour}
            placeholder="Godzina (np. 18:00)"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Punkty *</Text>
          <TextInput
            style={styles.input}
            value={points}
            onChangeText={setPoints}
            placeholder="Punkty"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Data (opcjonalna)</Text>
          <TouchableOpacity
            style={styles.fieldBox}
            onPress={() => setDatePickerVisible(true)}
          >
            <Text style={styles.fieldValue}>
              {date ? formatDate(date) : "Wybierz datę"}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(selectedDate) => {
              setDate(selectedDate);
              setDatePickerVisible(false);
            }}
            onCancel={() => setDatePickerVisible(false)}
            date={date || new Date()}
          />

          <Text style={styles.label}>Dzień tygodnia (opcjonalny)</Text>
          <TouchableOpacity
            style={styles.fieldBox}
            onPress={() => setShowDayPicker(true)}
          >
            <Text style={styles.fieldValue}>
              {selectedDay || "Wybierz dzień tygodnia"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Miesiąc od</Text>
          <TouchableOpacity
            style={styles.fieldBox}
            onPress={() => setShowMonthFromPicker(true)}
          >
            <Text style={styles.fieldValue}>{monthFrom}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Miesiąc do</Text>
          <TouchableOpacity
            style={styles.fieldBox}
            onPress={() => setShowMonthToPicker(true)}
          >
            <Text style={styles.fieldValue}>{monthTo}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.generateButton} onPress={handleAdd}>
            <Text style={styles.generateButtonText}>Dodaj</Text>
          </TouchableOpacity>
          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearOptionalFields}
          >
            <Text style={styles.clearButtonText}>Wyczyść pola opcjonalne</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Day modal */}
        <Modal visible={showDayPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day}
                  onPress={() => {
                    setSelectedDay(day);
                    setShowDayPicker(false);
                  }}
                >
                  <Text style={styles.modalOption}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Month from modal */}
        <Modal visible={showMonthFromPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {months.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  onPress={() => {
                    setMonthFrom(m.value);
                    setShowMonthFromPicker(false);
                  }}
                >
                  <Text style={styles.modalOption}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Month to modal */}
        <Modal visible={showMonthToPicker} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {months.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  onPress={() => {
                    setMonthTo(m.value);
                    setShowMonthToPicker(false);
                  }}
                >
                  <Text style={styles.modalOption}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <BottomNavModerator navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  label: {
    color: "#4a2d0f",
    fontSize: RFValue(14),
    marginTop: RFValue(12),
    marginBottom: RFValue(4),
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 8,
    padding: RFValue(10),
    backgroundColor: "#fff",
    color: "#4a2d0f",
  },
  fieldBox: {
    backgroundColor: "#ffc854",
    borderRadius: 8,
    padding: RFValue(12),
    justifyContent: "center",
    marginBottom: RFValue(10),
  },
  fieldValue: {
    fontSize: RFValue(16),
    color: "#4a2d0f",
    fontWeight: "bold",
  },
  generateButton: {
    backgroundColor: "#ddb66f",
    borderRadius: 8,
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(20),
    alignItems: "center",
    marginTop: RFValue(20),
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
  clearButton: {
    backgroundColor: "#ccc1a1",
    borderRadius: 8,
    paddingVertical: RFValue(10),
    alignItems: "center",
    marginTop: RFValue(10),
  },
  clearButtonText: {
    color: "#4a2d0f",
    fontWeight: "bold",
  },
  errorText: {
    color: "#cc0000",
    fontWeight: "bold",
    marginTop: RFValue(10),
    textAlign: "center",
  },
});
