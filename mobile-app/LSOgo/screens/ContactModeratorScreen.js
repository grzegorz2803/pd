import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  ImageBackground,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavModerator from "../components/BottomNavModerator";

const mockUserList = [
  { id: "1050177083521", name: "Piotr Wiśniewski" },
  { id: "1050529798272", name: "Jan Kowalski" },
  { id: "158653716531", name: "Łukasz Dąbrowski" },
];

export default function ContactModeratorScreen({ navigation }) {
  const [recipientId, setRecipientId] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const selectedUser = mockUserList.find((u) => u.id === recipientId);

  const handleSend = () => {
    console.log("Wysyłanie wiadomości...");
    console.log("Tytuł:", messageTitle);
    console.log("Treść:", messageContent);
    console.log("Do:", recipientId || "wszyscy");
    // Tu później dodamy wywołanie API
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Wiadomość do użytkowników</Text>

          {/* Odbiorca */}
          <View style={styles.section}>
            <Text style={styles.label}>Odbiorca</Text>
            <TouchableOpacity
              onPress={() => setShowUserDropdown(true)}
              style={styles.dropdownButton}
            >
              <Text style={styles.dropdownButtonText}>
                {selectedUser ? selectedUser.name : "Wszyscy użytkownicy"}
              </Text>
            </TouchableOpacity>

            <Modal visible={showUserDropdown} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalDropdown}>
                  <FlatList
                    data={mockUserList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setRecipientId(item.id);
                          setShowUserDropdown(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    ListFooterComponent={
                      <TouchableOpacity
                        onPress={() => {
                          setRecipientId(null);
                          setShowUserDropdown(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            { fontWeight: "bold" },
                          ]}
                        >
                          Wszyscy użytkownicy
                        </Text>
                      </TouchableOpacity>
                    }
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
          </View>

          {/* Tytuł */}
          <View style={styles.section}>
            <Text style={styles.label}>Tytuł wiadomości</Text>
            <TextInput
              style={styles.input}
              value={messageTitle}
              onChangeText={setMessageTitle}
              placeholder="Wprowadź tytuł"
              placeholderTextColor="#9f8b63"
            />
          </View>

          {/* Treść */}
          <View style={styles.section}>
            <Text style={styles.label}>Treść wiadomości</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={messageContent}
              onChangeText={setMessageContent}
              multiline
              numberOfLines={5}
              placeholder="Wpisz treść wiadomości"
              placeholderTextColor="#9f8b63"
            />
          </View>

          {/* Przycisk Wyślij */}
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Wyślij wiadomość</Text>
          </TouchableOpacity>
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
    fontSize: RFValue(24),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(20),
  },
  section: {
    marginBottom: RFValue(20),
  },
  label: {
    fontSize: RFValue(16),
    color: "#4a2d0f",
    marginBottom: RFValue(8),
  },
  input: {
    backgroundColor: "#fff3d1",
    borderRadius: 8,
    padding: RFValue(10),
    fontSize: RFValue(14),
    color: "#4a2d0f",
  },
  textArea: {
    height: RFValue(100),
    textAlignVertical: "top",
  },
  dropdownButton: {
    backgroundColor: "#fff3d1",
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(16),
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  dropdownButtonText: {
    fontSize: RFValue(14),
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
    fontSize: RFValue(14),
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
  sendButton: {
    backgroundColor: "#c4a46d",
    paddingVertical: RFValue(12),
    borderRadius: 8,
    marginTop: RFValue(10),
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: RFValue(16),
  },
});
