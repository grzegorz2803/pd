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

const formatDate = (date) => {
  const d = new Date(date);
  const day = `0${d.getDate()}`.slice(-2);
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const mockReadings = [
  {
    id: 1,
    name: "Jan Kowalski",
    time: "06:30",
    date: "2025-07-01",
    mass: "Msza poranna",
  },
  {
    id: 2,
    name: "Adam Nowak",
    time: "07:00",
    date: "2025-07-01",
    mass: "Msza szkolna",
  },
  {
    id: 3,
    name: "Zofia Wiśniewska",
    time: "08:00",
    date: "2025-07-01",
    mass: "Msza dziękczynna",
  },
];
const userList = [
  { id: "1050177083521", name: "Piotr Wiśniewski" },
  { id: "1050529798272", name: "Jan Kowalski" },
  { id: "158653716531", name: "Łukasz Dąbrowski" },
];

export default function HistoryModeratorScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [recentReadings, setRecentReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const readings = await getRecentReadings();
        setRecentReadings(readings);
      } catch (error) {
        console.error("Błąd pobierania odczytów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);
  const filteredByDate = mockReadings.filter(
    (r) =>
      r.date === selectedDate.toISOString().split("T")[0] &&
      (!selectedHour || r.time === selectedHour)
  );

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
              onConfirm={(date) => {
                setSelectedDate(date);
                setSelectedHour(null);
                setPickerVisible(false);
              }}
              onCancel={() => setPickerVisible(false)}
              date={selectedDate}
            />
            {filteredByDate.map((r) => (
              <View key={r.id} style={styles.entryBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.dateDay}>{r.name}</Text>
                </View>
                <Text style={styles.serviceName}>{r.mass}</Text>
                <Text style={styles.time}>{r.time}</Text>
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

            {selectedUserId &&
              mockUserHistory.map((r, i) => (
                <View key={i} style={styles.entryBox}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.dateDay}>{r.date}</Text>
                  </View>
                  <Text style={styles.serviceName}>{r.mass}</Text>
                  <Text style={styles.time}>{r.time}</Text>
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
});
