import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavUser from "../components/BottomNavUser";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function NotificationsScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
  // Przykładowe dane statyczne:
  const justifications = [
    {
      id: 1,
      date: "02.06.2025",
      service: "Brak służby w niedzielę",
      message: "Byłem chory",
      status: "pending",
    },
    {
      id: 2,
      date: "26.05.2025",
      service: "Brak służby w tygodniu",
      message: "Wyjazd klasowy",
      status: "accepted",
    },
  ];

  const sentMessages = [
    {
      id: 101,
      subject: "Pytanie o grafik",
      body: "Czy mogę być w sobotę zwolniony?",
      reply: "Tak, jesteś już zaznaczony jako nieobecny.",
    },
  ];

  const modMessages = [
    {
      id: 201,
      subject: "Zbiórka",
      body: "Przypominam o zbiórce w czwartek o 18:00.",
    },
  ];

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Powiadomienia</Text>

          {/* Sekcja 1: Usprawiedliwienia */}
          <Text style={styles.sectionHeader}>Prośby o usprawiedliwienie</Text>
          {justifications.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.dateLine}>
                {item.date} – {item.service}
              </Text>
              <Text style={styles.bodyText}>Powód: {item.message}</Text>
              <Text style={[styles.statusText, getStatusStyle(item.status)]}>
                Status: {getStatusLabel(item.status)}
              </Text>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteText}>Usuń</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Sekcja 2: Wiadomości użytkownika */}
          <Text style={styles.sectionHeader}>Wysłane wiadomości</Text>
          {sentMessages.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.subjectText}>{item.subject}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>
              {item.reply && (
                <View style={styles.replyBox}>
                  <Text style={styles.replyLabel}>Odpowiedź moderatora:</Text>
                  <Text style={styles.bodyText}>{item.reply}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteText}>Usuń</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Sekcja 3: Wiadomości od moderatora */}
          <Text style={styles.sectionHeader}>Wiadomości od moderatora</Text>
          {modMessages.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.subjectText}>{item.subject}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteText}>Usuń</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      {loggedIn && <BottomNavUser navigation={navigation} />}
    </ImageBackground>
  );
}

// Helper do statusu
const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Oczekuje";
    case "accepted":
      return "Zaakceptowano";
    case "rejected":
      return "Odrzucono";
    default:
      return "";
  }
};

const getStatusStyle = (status) => {
  switch (status) {
    case "accepted":
      return { color: "#118800" };
    case "rejected":
      return { color: "#c00000" };
    default:
      return { color: "#aa8000" };
  }
};

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
  sectionHeader: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    marginBottom: RFValue(10),
    color: "#4a2d0f",
  },
  card: {
    backgroundColor: "#fff8e1",
    borderWidth: 1,
    borderColor: "#c4a46d",
    borderRadius: 10,
    padding: RFValue(12),
    marginBottom: RFValue(12),
  },
  dateLine: {
    fontWeight: "bold",
    fontSize: RFValue(15),
    marginBottom: RFValue(4),
    color: "#3d2b1f",
  },
  subjectText: {
    fontWeight: "bold",
    fontSize: RFValue(16),
    marginBottom: RFValue(4),
    color: "#3d2b1f",
  },
  bodyText: {
    fontSize: RFValue(15),
    color: "#3d2b1f",
  },
  statusText: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    marginTop: RFValue(6),
  },
  replyBox: {
    marginTop: RFValue(8),
    backgroundColor: "#f1e3b0",
    padding: RFValue(8),
    borderRadius: 8,
  },
  replyLabel: {
    fontWeight: "bold",
    marginBottom: RFValue(4),
    color: "#4a2d0f",
  },
  deleteButton: {
    alignSelf: "flex-end",
    marginTop: RFValue(10),
    backgroundColor: "#ddb66f",
    paddingVertical: RFValue(6),
    paddingHorizontal: RFValue(12),
    borderRadius: 8,
  },
  deleteText: {
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  divider: {
    height: 1,
    backgroundColor: "#c4a46d",
    marginVertical: RFValue(16),
  },
});
