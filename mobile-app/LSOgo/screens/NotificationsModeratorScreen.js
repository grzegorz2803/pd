import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavModerator from "../components/BottomNavModerator";
import {
  getModeratorNotifications,
  updateJustificationStatus,
  sendModeratorReply,
} from "../utils/api";

export default function NotificationsModeratorScreen({ navigation }) {
  const [excuseRequests, setExcuseRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchNotifications = async () => {
    try {
      const data = await getModeratorNotifications();
      setExcuseRequests(data.excuseRequests || []);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Błąd pobierania powiadomień:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#c4a46d" />
    );
  }
  const handleStatusChange = async (reading_id, card_id, status) => {
    try {
      await updateJustificationStatus({ reading_id, card_id, status });
      Alert.alert(
        "Sukces",
        `Prośba została ${
          status === "accepted" ? "zaakceptowana" : "odrzucona"
        }.`
      );
      fetchNotifications();
    } catch (err) {
      Alert.alert(
        "Błąd",
        err.message || "Nie udało się zaktualizować statusu."
      );
    }
  };
  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    try {
      await sendModeratorReply({
        replyToId: selectedMessage.id,
        card_id: selectedMessage.sender_id, // <-- to było potrzebne!
        body: replyMessage,
      });

      Alert.alert("Sukces", "Odpowiedź została wysłana.");
      setReplyModalVisible(false);
      setReplyMessage("");
      setSelectedMessage(null);
      fetchNotifications(); // odśwież dane
    } catch (error) {
      Alert.alert("Błąd", error.message || "Nie udało się wysłać odpowiedzi.");
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
          <Text style={styles.title}>Powiadomienia</Text>

          {/* Sekcja: Prośby o usprawiedliwienie */}
          <Text style={styles.sectionTitle}>Prośby o usprawiedliwienie</Text>
          {excuseRequests.length === 0 ? (
            <Text style={styles.emptyText}>
              Brak próśb o usprawiedliwienie.
            </Text>
          ) : (
            excuseRequests.map((item) => (
              <View key={item.id} style={styles.box}>
                <Text style={styles.name}>
                  {item.first_name} {item.last_name}
                </Text>
                <Text style={styles.info}>
                  Data: {item.date_read?.split("T")[0]}
                </Text>
                <Text style={styles.reason}>{item.message}</Text>

                <View style={styles.rowButtons}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() =>
                      handleStatusChange(
                        item.reading_id,
                        item.card_id,
                        "accepted"
                      )
                    }
                  >
                    <Text style={styles.buttonText}>Akceptuj</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() =>
                      handleStatusChange(
                        item.reading_id,
                        item.card_id,
                        "rejected"
                      )
                    }
                  >
                    <Text style={styles.buttonText}>Odrzuć</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Sekcja: Wiadomości */}
          <Text style={styles.sectionTitle}>Wiadomości</Text>
          {messages.length === 0 ? (
            <Text style={styles.emptyText}>
              Brak wiadomości od użytkowników.
            </Text>
          ) : (
            messages.map((msg) => (
              <View key={msg.id} style={styles.box}>
                <Text style={styles.name}>
                  {msg.first_name} {msg.last_name}
                </Text>
                <Text style={styles.reason}>{msg.body}</Text>
                <TouchableOpacity
                  style={styles.replyButton}
                  onPress={() => {
                    setSelectedMessage(msg);
                    setReplyModalVisible(true);
                  }}
                >
                  <Text style={styles.buttonText}>Odpowiedz</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
        <Modal visible={replyModalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Odpowiedź do {selectedMessage?.first_name}{" "}
                {selectedMessage?.last_name}
              </Text>
              <TextInput
                style={styles.textArea}
                multiline
                numberOfLines={4}
                placeholder="Wpisz odpowiedź..."
                value={replyMessage}
                onChangeText={setReplyMessage}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  style={[styles.acceptButton, { flex: 1, marginRight: 5 }]}
                  onPress={handleSendReply}
                >
                  <Text style={styles.buttonText}>Wyślij</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.rejectButton, { flex: 1, marginLeft: 5 }]}
                  onPress={() => setReplyModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Anuluj</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  emptyText: {
    fontSize: RFValue(14),
    color: "#666",
    fontStyle: "italic",
    marginBottom: RFValue(12),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff7e1",
    borderRadius: 10,
    padding: RFValue(16),
    width: "85%",
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginBottom: RFValue(10),
  },
  textArea: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: RFValue(10),
    minHeight: RFValue(80),
    textAlignVertical: "top",
    backgroundColor: "#fff",
    color: "#4a2d0f",
  },
});
