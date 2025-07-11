import React, { useState, useEffect } from "react";
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
import { getUsersForMeating } from "../utils/api";
import { sendModeratorMessage } from "../utils/api";

export default function ContactModeratorScreen({ navigation }) {
  const [recipientId, setRecipientId] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsersForMeating();
        setUserList(users.users);
      } catch (err) {
        console.error("Błąd ładowania listy użytkowników:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSend = async () => {
    const odbiorca = selectedUserId
      ? userList.find((u) => u.card_id === selectedUserId)
      : null;

    try {
      await sendModeratorMessage(messageTitle, messageContent, selectedUserId);
      console.log("✅ Wiadomość wysłana pomyślnie");
      setMessageTitle("");
      setMessageContent("");
      setSelectedUserId(null);
    } catch (err) {
      console.error("❌ Błąd przy wysyłaniu:", err);
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
          <Text style={styles.title}>Wiadomość do użytkowników</Text>

          {/* Odbiorca */}
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>Wybierz odbiorcę:</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowUserDropdown(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {selectedUserId
                  ? userList.find((u) => u.card_id === selectedUserId)
                      ?.first_name +
                    " " +
                    userList.find((u) => u.card_id === selectedUserId)
                      ?.last_name
                  : "Wszyscy użytkownicy"}
              </Text>
            </TouchableOpacity>

            <Modal visible={showUserDropdown} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalDropdown}>
                  <FlatList
                    data={[
                      {
                        card_id: null,
                        first_name: "",
                        last_name: "Wszyscy użytkownicy",
                      },
                      ...(Array.isArray(userList) ? userList : []),
                    ]}
                    keyExtractor={(item) => item.card_id ?? "all"}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedUserId(item.card_id);
                          setShowUserDropdown(false);
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>
                          {item.card_id
                            ? `${item.first_name} ${item.last_name}`
                            : item.last_name}
                        </Text>
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
