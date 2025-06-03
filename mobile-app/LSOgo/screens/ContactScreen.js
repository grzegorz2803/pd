import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavUser from "../components/BottomNavUser";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { sendMessage } from "../utils/api";

export default function ContactScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Błąd", "Uzupełnij temat i wiadomość.");
      return;
    }
    try {
      await sendMessage(subject, message);
      Alert.alert("Sukces", "Wiadomość wysłana");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Błąd", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Kontakt z moderatorem</Text>

          <Text style={styles.label}>Temat</Text>
          <TextInput
            style={styles.input}
            placeholder="Wpisz temat..."
            value={subject}
            onChangeText={setSubject}
          />

          <Text style={styles.label}>Treść wiadomości</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Wpisz treść wiadomości..."
            value={message}
            onChangeText={setMessage}
            multiline
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Wyślij wiadomość</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      {loggedIn && <BottomNavUser navigation={navigation} />}
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
    color: "#4a2d0f",
    textAlign: "center",
    marginBottom: RFValue(20),
  },
  label: {
    fontSize: RFValue(16),
    color: "#4a2d0f",
    marginBottom: RFValue(6),
    marginTop: RFValue(12),
  },
  input: {
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 8,
    padding: RFValue(10),
    backgroundColor: "#fff",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 8,
    padding: RFValue(10),
    height: RFValue(120),
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#ddb66f",
    borderRadius: 8,
    marginTop: RFValue(20),
    paddingVertical: RFValue(10),
    alignItems: "center",
  },
  sendText: {
    color: "#4a2d0f",
    fontWeight: "bold",
    fontSize: RFValue(16),
  },
});
