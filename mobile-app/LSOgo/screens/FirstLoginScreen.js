import React, { useState } from "react";
import {
  View,
  ImageBackground,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { Dimensions } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import {
  handleCancel,
  validateEmail,
  sendEmail,
  verifyCode,
  newPassword,
  validatePassword,
} from "../utils/api";

const { width, height } = Dimensions.get("window");

export default function FirstLoginScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
    >
      <SafeAreaView style={{ marginTop: 0 }}>
        <View style={styles.header}>
          <Text style={styles.title}>LSOgo</Text>
          <Text style={styles.subtitle}>Ekran pierwszego logowania</Text>

          <Image
            source={require("../assets/cross.png")}
            style={styles.crossIcon}
          />
        </View>
        <View style={styles.formBox}>
          {step === 1 && (
            <>
              <Text style={styles.label}>Podaj adres e-mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Podaj email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#555"
              />
              {email !== "" && !validateEmail(email) && (
                <Text style={{ color: "red", marginTop: -10 }}>
                  Niepoprawny adres e-mail
                </Text>
              )}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={async () => {
                  const result = await sendEmail(email);
                  if (result.success) {
                    setStep(2);
                  } else {
                    Alert.alert("Błąd", result.message);
                  }
                }}
              >
                <Text style={styles.buttonText}>Wyślij</Text>
              </TouchableOpacity>
            </>
          )}
          {step === 2 && (
            <>
              <Text style={styles.label}>Kod weryfikacyjny</Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="Wpisz kod z emaila"
                keyboardType="numeric"
                placeholderTextColor="#555"
              />
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={async () => {
                  const result = await verifyCode(code);
                  if (result.success) {
                    setStep(3);
                  } else {
                    Alert.alert("Błąd", result.message);
                  }
                }}
              >
                <Text style={styles.buttonText}>Potwierdź</Text>
              </TouchableOpacity>
            </>
          )}
          {step === 3 && (
            <>
              <Text style={styles.label}>Nowe hasło</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Nowe hasło"
                placeholderTextColor="#555"
              />
              {password !== "" && !validatePassword(password) && (
                <Text style={{ color: "red", marginTop: -10, marginBottom: 5 }}>
                  Hasło musi zawierać 8 znaków w tym: 1 cyfra, 1 duza litera, 1
                  zank specjalny
                </Text>
              )}
              <Text style={styles.label}>Powtórz hasło</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Powtórz hasło"
                placeholderTextColor="#555"
              />
              {confirmPassword !== "" && password !== confirmPassword && (
                <Text style={{ color: "red", marginTop: -10, marginBottom: 5 }}>
                  Hasło nie są zgodne
                </Text>
              )}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => newPassword(password)}
              >
                <Text style={styles.buttonText}>Ustaw hasło</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              handleCancel(navigation);
            }}
          >
            <Text style={styles.buttonText}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginTop: height * 0.08,
  },
  title: {
    fontFamily: "Cinzel-Bold",
    fontSize: RFValue(40),
    color: "#6e4b1f",
    marginTop: RFValue(10),
  },
  subtitle: {
    fontSize: RFValue(18),
    textAlign: "center",
    marginTop: RFValue(5),
    color: "#6e4b1f",
    fontWeight: "bold",
  },
  subsubtitle: {
    fontSize: RFValue(14),
    textAlign: "center",
    marginTop: RFValue(5),
    color: "#6e4b1f",
    fontWeight: "bold",
  },
  crossIcon: {
    marginTop: RFValue(30),
  },
  formBox: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
    padding: RFValue(20),
    backgroundColor: "#fff9ec",
    borderRadius: RFValue(15),
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  label: {
    fontSize: RFValue(14),
    color: "#3a1d00",
    marginBottom: RFValue(6),
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: RFValue(1),
    borderRadius: RFValue(8),
    padding: RFValue(10),
    marginBottom: RFValue(15),
    fontSize: RFValue(14),
    color: "#000",
    marginTop: RFValue(10),
  },
  primaryButton: {
    backgroundColor: "#ddb66f",
    paddingVertical: RFValue(12),
    borderRadius: RFValue(8),
    alignItems: "center",
    marginTop: RFValue(10),
  },
  secondaryButton: {
    backgroundColor: "#ddb66f",
    paddingVertical: RFValue(8),
    borderRadius: RFValue(8),
    alignItems: "center",
    marginTop: RFValue(10),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#000",
  },
});
