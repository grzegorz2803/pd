import React, { useEffect, useState, version } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Linking,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import BottomNavUser from "../components/BottomNavUser";
import { RFValue } from "react-native-responsive-fontsize";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAboutAppData } from "../utils/api";
import Constants from "expo-constants";
import { getProfilData } from "../utils/api";
import { validatePassword } from "../utils/api";
import { newPassword } from "../utils/api";
const { width, height } = Dimensions.get("window");

export default function ProfilScreen({ navigation }) {
  const { loggedIn, logout } = useContext(AuthContext);
  const [profilData, setProfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  useEffect(() => {
    const loadProfil = async () => {
      try {
        const profil = await getProfilData();
        setProfilData(profil);
      } catch (error) {
        console.error("Błąd pobierana danych ", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfil();
  }, []);
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6e4b1f" />
      </View>
    );
  }
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={{ marginTop: 0 }}>
        <ScrollView contentContainerStyle={styles.contentWrapper}>
          <View style={styles.header}>
            <Image
              source={require("../assets/pngwing.com.png")}
              style={styles.ornament}
            />
          </View>
          <Text style={styles.title}>
            {profilData[0].first_name} {profilData[0].last_name}
          </Text>
          <Text style={styles.parishe}>{profilData[0].parish_name}</Text>
          <Text style={styles.location}>{profilData[0].parish_location}</Text>
          <View style={styles.line} />
          <View style={styles.section}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{profilData[0].email}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Stopień</Text>
            <Text style={styles.value}>{profilData[0].user_function}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Login</Text>
            <Text style={styles.value}>{profilData[0].login}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowPasswordModal(true)}
          >
            <Text style={styles.buttonText}>Zmiana hasła</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <View style={styles.section}>
            <Text style={styles.labelHarm}>Harmonogram dyżurów</Text>
            <Text style={styles.currentWeek}>
              Tydzień roku: {profilData.week_number}
            </Text>
            {profilData.duties.map((item) => {
              const key = `${item.day_of_week}-${item.time}`;
              return (
                <View key={key} style={styles.massBox}>
                  <Image
                    source={require("../assets/kielich.png")}
                    style={[styles.cross]}
                  />
                  <View style={styles.massTextContainer}>
                    <Text style={styles.massTitle}>{item.day_of_week}</Text>
                    <Text style={styles.massTime}>
                      godz. {item.time.slice(0, 5)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <Modal
            visible={showPasswordModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowPasswordModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Nowe hasło</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nowe hasło"
                  secureTextEntry
                  value={password}
                  onChangeText={setNewPassword}
                />
                {password !== "" && !validatePassword(password) && (
                  <Text
                    style={{ color: "red", marginTop: -10, marginBottom: 5 }}
                  >
                    Hasło musi zawierać 8 znaków w tym: 1 cyfra, 1 duza litera,
                    1 zank specjalny
                  </Text>
                )}
                <TextInput
                  style={styles.input}
                  placeholder="Powtórz hasło"
                  secureTextEntry
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={async () => {
                    if (password !== repeatPassword) {
                      alert("Hasła nie są takie same");
                      return;
                    }
                    try {
                      const result = await newPassword(password);

                      if (result?.success) {
                        setShowPasswordModal(false);
                        setNewPassword("");
                        setRepeatPassword("");
                        await logout();
                        navigation.replace("Login");
                      } else {
                        Alert.alert(
                          "Błąd",
                          result?.message || "Nie udało się zmienić hasła"
                        );
                      }
                    } catch (error) {
                      console.error("Błąd zmiany hasła:", error);
                      Alert.alert("Błąd", "Wystąpił błąd serwera");
                    }
                  }}
                >
                  <Text style={styles.saveButtonText}>Zapisz</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowPasswordModal(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Anuluj</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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
  contentWrapper: {
    padding: RFValue(20),
  },
  header: {
    alignItems: "center",
  },
  ornament: {
    width: width * 0.8,
    height: RFValue(60),
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(36),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(10),
  },
  parishe: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(10),
  },
  location: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(10),
  },
  section: {
    marginBottom: RFValue(15),
  },
  label: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginBottom: RFValue(4),
  },
  labelHarm: {
    fontSize: RFValue(22),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginBottom: RFValue(15),
    textAlign: "center",
  },
  currentWeek: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginBottom: RFValue(15),
  },
  value: {
    fontSize: RFValue(18),
    color: "#4a2d0f",
  },
  button: {
    backgroundColor: "#ddb66f",
    paddingVertical: RFValue(12),
    borderRadius: RFValue(8),
    alignItems: "center",
    marginBottom: RFValue(10),
  },
  buttonText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#000",
  },
  massBox: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#1a1204",
    padding: RFValue(15),
    borderRadius: 20,
    marginBottom: RFValue(20),
  },
  massTitle: {
    fontSize: RFValue(20),
    color: "#4a2d0f",
    marginBottom: RFValue(5),
  },
  massTime: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  line: {
    borderBottomColor: "#8B5E3C", // lub inny kolor
    borderBottomWidth: 1,
    marginVertical: 16, // odstęp nad i pod linią
    width: "100%", // rozciąga się przez cały kontener
  },
  cross: {
    width: RFValue(24),
    height: RFValue(34),
    marginRight: RFValue(15),
  },
  massTextContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    marginBottom: RFValue(10),
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4caf50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#777",
    fontSize: 14,
  },
});
