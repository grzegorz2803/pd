import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavModerator from "../components/BottomNavModerator";

const staticMassSchedule = {
  Niedziela: ["06:30", "08:00", "09:30", "11:00", "13:00", "17:00"],
  Poniedziałek: ["06:30", "07:00", "08:00", "18:00"],
  Wtorek: ["06:30", "07:00", "08:00", "18:00"],
  Środa: ["06:30", "07:00", "08:00", "18:00"],
  Czwartek: ["06:30", "07:00", "08:00", "18:00"],
  Piątek: ["06:30", "07:00", "08:00", "18:00"],
  Sobota: ["06:30", "07:00", "08:00", "18:00"],
};

const staticUsers = [
  "Jan Kowalski",
  "Adam Nowak",
  "Zofia Wiśniewska",
  "Piotr Mazur",
];

export default function ScheduleScreen({ navigation }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsersMap, setSelectedUsersMap] = useState({});
  const [currentSelection, setCurrentSelection] = useState({
    day: null,
    time: null,
  });
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState({
    visible: false,
    mode: "from",
  });

  const toggleDay = (day) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  const toggleUser = (user) => {
    const key = `${currentSelection.day}_${currentSelection.time}`;
    const current = selectedUsersMap[key] || [];
    const updated = current.includes(user)
      ? current.filter((u) => u !== user)
      : [...current, user];
    setSelectedUsersMap({ ...selectedUsersMap, [key]: updated });
  };

  const openModal = (day, time) => {
    setCurrentSelection({ day, time });
    setShowModal(true);
  };

  const getSelectedUsers = () => {
    const key = `${currentSelection.day}_${currentSelection.time}`;
    return selectedUsersMap[key] || [];
  };

  const onDateChange = (event, selectedDate) => {
    if (!selectedDate)
      return setShowDatePicker({ visible: false, mode: "from" });
    if (showDatePicker.mode === "from") {
      if (selectedDate > dateTo) {
        alert("Data początkowa nie może być późniejsza niż data końcowa");
        return;
      }
      setDateFrom(selectedDate);
    } else {
      if (selectedDate < dateFrom) {
        alert("Data końcowa nie może być wcześniejsza niż data początkowa");
        return;
      }
      setDateTo(selectedDate);
    }
    setShowDatePicker({ visible: false, mode: "from" });
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Tworzenie harmonogramu</Text>

          <View style={styles.dateRangeContainer}>
            <View>
              <Text style={styles.dateLabel}>Od:</Text>
              <TextInput
                style={styles.input}
                placeholder="RRRR-MM-DD"
                value={dateFrom}
                onChangeText={setDateFrom}
              />
            </View>
            <View>
              <Text style={styles.dateLabel}>Do:</Text>
              <TextInput
                style={styles.input}
                placeholder="RRRR-MM-DD"
                value={dateTo}
                onChangeText={setDateTo}
              />
            </View>
          </View>

          {Object.entries(staticMassSchedule).map(([day, times]) => (
            <View key={day} style={styles.card}>
              <TouchableOpacity onPress={() => toggleDay(day)}>
                <Text style={styles.dayHeader}>{day}</Text>
              </TouchableOpacity>
              {expandedDay === day && (
                <View style={styles.timesContainer}>
                  {times.map((time, idx) => {
                    const key = `${day}_${time}`;
                    const assignedUsers = selectedUsersMap[key] || [];
                    return (
                      <View key={time}>
                        <View style={styles.timeRow}>
                          <View style={styles.timeRowInner}>
                            <Text style={styles.timeText}>{time}</Text>
                            <TouchableOpacity
                              style={styles.addButton}
                              onPress={() => openModal(day, time)}
                            >
                              <Text style={styles.addButtonText}>
                                Dodaj osobę
                              </Text>
                            </TouchableOpacity>
                          </View>
                          {assignedUsers.map((user, i) => (
                            <Text key={i} style={styles.assignedUser}>
                              {user}
                            </Text>
                          ))}
                        </View>
                        {idx < times.length - 1 && (
                          <View style={styles.divider} />
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              if (!dateFrom || !dateTo || dateFrom > dateTo) {
                alert("Zakres dat jest nieprawidłowy.");
                return;
              }
              console.log("Zapisujemy harmonogram:", {
                dateFrom,
                dateTo,
                selectedUsersMap,
              });
              alert("Harmonogram zapisany (symulacja)");
            }}
          >
            <Text style={styles.saveButtonText}>Zapisz harmonogram</Text>
          </TouchableOpacity>
        </ScrollView>

        {showDatePicker.visible && (
          <DateTimePicker
            value={showDatePicker.mode === "from" ? dateFrom : dateTo}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Wybierz osoby</Text>
              <FlatList
                data={staticUsers}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => toggleUser(item)}
                  >
                    <View style={styles.checkbox}>
                      {getSelectedUsers().includes(item) && (
                        <View style={styles.checkboxSelected} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.confirmButtonText}>Zatwierdź</Text>
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
  dateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: RFValue(20),
  },
  dateLabel: {
    fontSize: RFValue(16),
    color: "#4a2d0f",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffeca8",
    borderRadius: 10,
    marginBottom: RFValue(10),
    padding: RFValue(12),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayHeader: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  timesContainer: {
    marginTop: RFValue(8),
  },
  timeRow: {
    marginBottom: RFValue(10),
  },
  timeRowInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontWeight: "bold",
    color: "#4a2d0f",
    fontSize: RFValue(16),
  },
  divider: {
    height: 1,
    backgroundColor: "#c4a46d",
    marginVertical: RFValue(6),
  },
  addButton: {
    backgroundColor: "#ddb66f",
    borderRadius: 6,
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(10),
  },
  addButtonText: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  assignedUser: {
    fontSize: RFValue(14),
    color: "#4a2d0f",
    paddingLeft: RFValue(10),
    marginTop: RFValue(4),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: RFValue(20),
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(10),
    color: "#4a2d0f",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(10),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#4a2d0f",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxSelected: {
    width: 12,
    height: 12,
    backgroundColor: "#4a2d0f",
  },
  checkboxLabel: {
    fontSize: RFValue(14),
    color: "#4a2d0f",
  },
  confirmButton: {
    backgroundColor: "#ddb66f",
    borderRadius: 6,
    paddingVertical: RFValue(10),
    alignItems: "center",
    marginTop: RFValue(10),
  },
  confirmButtonText: {
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  input: {
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 8,
    padding: RFValue(8),
    width: RFValue(130),
    textAlign: "center",
    color: "#4a2d0f",
    backgroundColor: "#fff",
    marginBottom: RFValue(10),
  },
  saveButton: {
    backgroundColor: "#ddb66f",
    borderRadius: 8,
    paddingVertical: RFValue(12),
    alignItems: "center",
    marginTop: RFValue(20),
  },
  saveButtonText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
});
