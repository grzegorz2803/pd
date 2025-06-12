import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavModerator from "../components/BottomNavModerator";
import { getUsersForMeating } from "../utils/api";
const staticUsers = [
  { id: 1, name: "Jan Kowalski" },
  { id: 2, name: "Adam Nowak" },
  { id: 3, name: "Krzysztof Wiśniowski" },
  { id: 4, name: "Tomasz Zieliński" },
];

const STATUS = {
  OBECNY: "obecny",
  USPRAWIEDLIWIONY: "usprawiedliwiony",
  NIEOBECNY: "nieobecny",
};

export default function MeatingScreen({ navigation }) {
  const [statuses, setStatuses] = useState({});
  const [points, setPoints] = useState("0");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsersForMeating();
        setUsers(data.users || []);
      } catch (error) {
        Alert.alert("Błąd", "Nie udało się pobrać użytkowników");
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleStatusSelect = (userId, status) => {
    setStatuses((prev) => ({ ...prev, [userId]: status }));
  };
  const handleSave = () => {
    const value = parseInt(points);
    if (isNaN(value)) {
      Alert.alert("Błąd", "Wprowadź poprawną liczbę punktów");
      return;
    }

    const results = users.map((user) => {
      const status = statuses[user.card_id];
      let score = 0;
      if (status === STATUS.OBECNY) score = value;
      else if (status === STATUS.NIEOBECNY) score = -value;
      return {
        card_id: user.card_id,
        status: status || null,
        points: score,
      };
    });

    console.log("Zapisane dane:", results);
  };
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Zbiórka</Text>

          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { flex: 3 }]}>
              Imię i nazwisko
            </Text>
            <Text style={styles.headerCell}>Obec.</Text>
            <Text style={styles.headerCell}>Uspr.</Text>
            <Text style={styles.headerCell}>N.ob.</Text>
          </View>

          {staticUsers.map((user) => (
            <View key={user.id} style={styles.userRow}>
              <Text style={[styles.name, { flex: 3 }]}>{user.name}</Text>
              {[STATUS.OBECNY, STATUS.USPRAWIEDLIWIONY, STATUS.NIEOBECNY].map(
                (statusKey) => (
                  <TouchableOpacity
                    key={statusKey}
                    style={[
                      styles.circle,
                      statuses[user.id] === statusKey &&
                        styles[`${statusKey}Circle`],
                    ]}
                    onPress={() => handleStatusSelect(user.id, statusKey)}
                  />
                )
              )}
            </View>
          ))}

          <View style={styles.pointsWrapper}>
            <Text style={styles.label}>Punkty za zbiórkę:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={points}
              onChangeText={setPoints}
            />
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Zapisz</Text>
          </TouchableOpacity>
        </ScrollView>

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
    fontSize: RFValue(32),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(20),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(8),
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#4a2d0f",
    fontSize: RFValue(14),
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(12),
  },
  name: {
    color: "#4a2d0f",
    fontSize: RFValue(16),
  },
  circle: {
    width: RFValue(20),
    height: RFValue(20),
    borderRadius: RFValue(10),
    borderWidth: 1,
    borderColor: "#4a2d0f",
    marginHorizontal: RFValue(12),
  },
  obecnyCircle: {
    backgroundColor: "#2e7d32",
  },
  usprawiedliwionyCircle: {
    backgroundColor: "#888",
  },
  nieobecnyCircle: {
    backgroundColor: "#c62828",
  },
  pointsWrapper: {
    marginTop: RFValue(20),
    alignItems: "center",
  },
  label: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginBottom: RFValue(6),
  },
  input: {
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 8,
    padding: RFValue(10),
    width: RFValue(120),
    fontSize: RFValue(14),
    textAlign: "center",
    color: "#4a2d0f",
  },
  saveButton: {
    marginTop: RFValue(20),
    backgroundColor: "#ddb66f",
    borderRadius: 8,
    paddingVertical: RFValue(10),
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
});
