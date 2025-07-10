// HistoryModeratorScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Modal,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavModerator from "../components/BottomNavModerator";
import { getRecentReadings } from "../utils/api";
import { getUserRecentReadings } from "../utils/api";
import { getReadingsByDate } from "../utils/api";

const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function HistoryModeratorScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [recentReadings, setRecentReadings] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userReadings, setUserReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const { readings, users } = await getRecentReadings();
        setRecentReadings(readings);
        setUserList(users);
      } catch (error) {
        console.error("Błąd pobierania odczytów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  const selectedUser = userList.find((u) => u.id === selectedUserId);
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Historia Odczytów</Text>

          {/* Sekcja 1 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Filtruj po dacie i godzinie</Text>
            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              style={styles.dateDisplay}
            >
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isPickerVisible}
              mode="date"
              onConfirm={async (date) => {
                setSelectedDate(date);
                setSelectedHour(null);
                setPickerVisible(false);
                const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD

                try {
                  const result = await getReadingsByDate(formattedDate);
                  const uniqueHours = [...new Set(result.map((r) => r.time))];

                  setAvailableHours(uniqueHours.sort());
                  setFilteredReadings(result);
                } catch (err) {
                  console.error("Błąd przy pobieraniu odczytów:", err);
                }
              }}
              onCancel={() => setPickerVisible(false)}
              date={selectedDate}
            />
            <View style={styles.hourFilterContainer}>
              {availableHours.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  onPress={() =>
                    setSelectedHour(hour === selectedHour ? null : hour)
                  }
                  style={[
                    styles.hourChip,
                    selectedHour === hour && styles.hourChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.hourChipText,
                      selectedHour === hour && styles.hourChipTextSelected,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {filteredReadings
              .filter((r) => !selectedHour || r.time === selectedHour)
              .map((r, index) => (
                <View key={index} style={styles.entryBox}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.dateDay}>{r.name}</Text>
                    <Text style={styles.time}>{r.time}</Text>
                  </View>
                  <Text style={styles.serviceName}>{r.service}</Text>
                </View>
              ))}
          </View>

          {/* Sekcja 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historia użytkownika</Text>
            <TouchableOpacity
              onPress={() => setShowUserDropdown(true)}
              style={styles.dropdownButton}
            >
              <Text style={styles.dropdownButtonText}>
                {selectedUser ? selectedUser.name : "Wybierz użytkownika"}
              </Text>
            </TouchableOpacity>

            <Modal visible={showUserDropdown} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalDropdown}>
                  <FlatList
                    data={userList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedUserId(item.id);
                          setShowUserDropdown(false);
                          getUserRecentReadings(item.id)
                            .then((readings) => {
                              setUserReadings(readings);
                            })
                            .catch((err) => {
                              console.error("Błąd odczytu użytkownika:", err);
                            });
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowUserDropdown(false)}
                    style={styles.dropdownCancel}
                  >
                    <Text style={styles.dropdownCancelText}>Anuluj</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {userReadings.map((r, index) => (
              <View key={index} style={styles.entryBox}>
                <Text style={styles.dateDay}>
                  {r.date} • {r.weekday} • {r.time}
                </Text>
                <Text style={styles.serviceName}>{r.service}</Text>
              </View>
            ))}
          </View>

          {/* Sekcja 3 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ostatnie 30 odczytów</Text>
            {recentReadings.map((r, index) => (
              <View key={index} style={styles.entryBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.dateDay}>{r.name}</Text>
                </View>
                <Text style={styles.serviceName}>{r.service}</Text>
                <Text style={styles.time}>
                  {r.weekday} {r.date} {r.time}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <BottomNavModerator navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: RFValue(16), paddingBottom: RFValue(80) },
  title: {
    fontSize: RFValue(28),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(20),
  },
  section: {
    borderTopWidth: 1,
    borderColor: "#c4a46d",
    paddingVertical: RFValue(10),
    marginBottom: RFValue(16),
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
    textAlign: "center",
    marginBottom: RFValue(10),
  },
  dateDisplay: {
    backgroundColor: "#fff3d1",
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(10),
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: RFValue(12),
  },
  dateText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  entry: {
    fontSize: RFValue(14),
    color: "#4a2d0f",
    marginBottom: RFValue(4),
    textAlign: "left",
    paddingHorizontal: RFValue(10),
  },
  dropdownButton: {
    backgroundColor: "#fff3d1",
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(16),
    marginBottom: RFValue(10),
    borderRadius: 6,
    alignSelf: "center",
  },
  dropdownButtonText: {
    fontSize: RFValue(16),
    color: "#4a2d0f",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: RFValue(16),
    width: "80%",
    maxHeight: "60%",
  },
  dropdownItem: {
    paddingVertical: RFValue(10),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: RFValue(16),
    color: "#4a2d0f",
  },
  dropdownCancel: {
    marginTop: RFValue(10),
    alignItems: "center",
  },
  dropdownCancelText: {
    fontWeight: "bold",
    color: "#cc0000",
  },
  entryBox: {
    borderWidth: 1,
    borderColor: "#c4a46d",
    borderRadius: 10,
    padding: RFValue(8),
    marginBottom: RFValue(10),
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateDay: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: "#3d2b1f",
  },
  serviceName: {
    fontSize: RFValue(12),
    color: "#3d2b1f",
    marginTop: RFValue(4),
  },
  time: {
    fontSize: RFValue(12),
    color: "#3d2b1f",
    marginTop: RFValue(3),
    fontWeight: "bold",
  },
  hourFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginVertical: 10,
  },
  hourChip: {
    backgroundColor: "#eee0b8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    margin: 4,
  },
  hourChipSelected: {
    backgroundColor: "#c4a46d",
  },
  hourChipText: {
    color: "#4a2d0f",
    fontWeight: "bold",
  },
  hourChipTextSelected: {
    color: "#fff",
  },
});
