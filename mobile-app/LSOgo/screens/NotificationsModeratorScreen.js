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
import BottomNavModerator from "../components/BottomNavModerator";

export default function NotificationsModeratorScreen({ navigation }) {
  // Przykładowe dane
  const excuses = [
    {
      id: 1,
      name: "Jan Kowalski",
      date: "2025-08-25",
      reason: "Byłem chory i miałem gorączkę",
    },
    {
      id: 2,
      name: "Adam Nowak",
      date: "2025-08-28",
      reason: "Rodzinna uroczystość",
    },
  ];

  const messages = [
    {
      id: 1,
      name: "Karol Malec",
      content: "Czy można się zapisać na sobotę?",
    },
    {
      id: 2,
      name: "Piotr Wiśniewski",
      content: "Dziękuję za pomoc przy zbiórce.",
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

          {/* Sekcja: Prośby o usprawiedliwienie */}
          <Text style={styles.sectionTitle}>Prośby o usprawiedliwienie</Text>
          {excuses.map((item) => (
            <View key={item.id} style={styles.box}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.info}>Data: {item.date}</Text>
              <Text style={styles.reason}>{item.reason}</Text>
              <View style={styles.rowButtons}>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.buttonText}>Akceptuj</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={styles.buttonText}>Odrzuć</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Sekcja: Wiadomości */}
          <Text style={styles.sectionTitle}>Wiadomości</Text>
          {messages.map((msg) => (
            <View key={msg.id} style={styles.box}>
              <Text style={styles.name}>{msg.name}</Text>
              <Text style={styles.reason}>{msg.content}</Text>
              <TouchableOpacity style={styles.replyButton}>
                <Text style={styles.buttonText}>Odpowiedz</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
    fontSize: RFValue(26),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(16),
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginVertical: RFValue(10),
    borderBottomWidth: 1,
    borderBottomColor: "#c4a46d",
    paddingBottom: 4,
  },
  box: {
    backgroundColor: "#fff7e1",
    borderRadius: 10,
    padding: RFValue(12),
    marginBottom: RFValue(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginBottom: RFValue(4),
  },
  info: {
    fontSize: RFValue(14),
    color: "#4a2d0f",
    marginBottom: RFValue(4),
  },
  reason: {
    fontSize: RFValue(14),
    color: "#3d2b1f",
    marginBottom: RFValue(10),
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  acceptButton: {
    backgroundColor: "#7bc47f",
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(16),
    borderRadius: 8,
  },
  rejectButton: {
    backgroundColor: "#d96464",
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(16),
    borderRadius: 8,
  },
  replyButton: {
    backgroundColor: "#c4a46d",
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(16),
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
