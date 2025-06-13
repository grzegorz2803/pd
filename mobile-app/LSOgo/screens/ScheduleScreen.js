import React, { useState, useEffect } from "react";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getSchedules } from "../utils/api";
import { sendSchedule } from "../utils/api";

export default function ScheduleScreen({ navigation }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUsersMap, setSelectedUsersMap] = useState({});
  const [currentSelection, setCurrentSelection] = useState({
    day: null,
    time: null,
  });
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(() => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    return nextMonth;
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState("from");
  const [massSchedule, setMassSchedule] = useState({});
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const data = await getSchedules();

        const grouped = {};
        data.massTimes.forEach((entry) => {
          if (!grouped[entry.day_of_week]) {
            grouped[entry.day_of_week] = [];
          }
          grouped[entry.day_of_week].push(entry.time.slice(0, 5));
        });

        setMassSchedule(grouped);
        setUserList(
          data.users.map((u) => ({
            id: u.card_id,
            name: `${u.first_name} ${u.last_name}`,
          }))
        );
      } catch (err) {
        console.error("Błąd wczytywania danych harmonogramu", err);
      }
    };

    fetchScheduleData();
  }, []);
  const toggleDay = (day) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  const toggleUser = (userId) => {
    const key = `${currentSelection.day}_${currentSelection.time}`;
    const current = selectedUsersMap[key] || [];
    const updated = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    setSelectedUsersMap({ ...selectedUsersMap, [key]: updated });
  };

  const getSelectedUsers = () => {
    const key = `${currentSelection.day}_${currentSelection.time}`;
    return selectedUsersMap[key] || [];
  };
  const openModal = (day, time) => {
    setCurrentSelection({ day, time });
    setShowModal(true);
  };

  const showPicker = (mode) => {
    setPickerMode(mode);
    setDatePickerVisible(true);
  };

  const hidePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    if (pickerMode === "from") {
      if (date > dateTo) {
        alert("Data początkowa nie może być późniejsza niż końcowa");
      } else {
        setDateFrom(date);
      }
    } else {
      if (date < dateFrom) {
        alert("Data końcowa nie może być wcześniejsza niż początkowa");
      } else {
        setDateTo(date);
      }
    }
    hidePicker();
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
            <TouchableOpacity onPress={() => showPicker("from")}>
              <Text style={styles.dateLabel}>
                Od: {dateFrom.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => showPicker("to")}>
              <Text style={styles.dateLabel}>
                Do: {dateTo.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hidePicker}
              date={pickerMode === "from" ? dateFrom : dateTo}
            />
          </View>

          {Object.entries(massSchedule).map(([day, times]) => (
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
                          {assignedUsers.map((userId) => {
                            const user = userList.find((u) => u.id === userId);
                            return user ? (
                              <Text key={user.id} style={styles.assignedUser}>
                                {user.name}
                              </Text>
                            ) : null;
                          })}
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
            onPress={async () => {
              if (!dateFrom || !dateTo || dateFrom > dateTo) {
                alert("Zakres dat jest nieprawidłowy.");
                return;
              }
              try {
                await sendSchedule({
                  dateFrom: dateFrom.toISOString().split("T")[0],
                  dateTo: dateTo.toISOString().split("T")[0],
                  selectedUsersMap,
                });
                setSelectedUsersMap({});
                setExpandedDay(null);

                const today = new Date();
                const nextMonth = new Date(today);
                nextMonth.setMonth(today.getMonth() + 1);
                setDateFrom(today);
                setDateTo(nextMonth);
                alert("Harmonogram został zapisany!");
              } catch (err) {
                alert("Błąd zapisu: " + err.message);
              }
            }}
          >
            <Text style={styles.saveButtonText}>Zapisz harmonogram</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={showModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Wybierz osoby</Text>
              <FlatList
                data={userList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => toggleUser(item.id)}
                    style={styles.checkboxRow}
                  >
                    <View style={styles.checkbox}>
                      {getSelectedUsers().includes(item.id) && (
                        <View style={styles.checkboxSelected} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{item.name}</Text>
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
    backgroundColor: "#fff3d1",
    padding: RFValue(8),
    borderRadius: 6,
    marginBottom: RFValue(10),
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
