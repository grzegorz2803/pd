import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Image,
  CheckBox,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import BottomNavGuest from "../components/BottomNavGuest";
const rememberMe = false;
export default function LoginScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMethod=""
    >
      <SafeAreaView style={{ marginTop: 0 }}>
        <View style={styles.topContent}>
          <Text style={styles.title}>LSOgo</Text>
          <Text style={styles.subtitle}>System rejestracji</Text>
          <Text style={styles.subtitle}>obecności ministrantów</Text>
          <Image source={require("../assets/cross.png")} style={styles.cross} />
        </View>
        <View style={styles.loginBox}>
          <View style={styles.inputContainer}>
            <Image
              source={require("../assets/email.png")}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Login"
              //   value={login}
              placeholderTextColor="#444"
            />
          </View>
          <View style={styles.inputContainer}>
            <Image
              source={require("../assets/password.png")}
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              //   value={login}
              placeholderTextColor="#444"
            />
          </View>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
              <Ionicons
                name={rememberMe ? "checkbox" : "square-outline"}
                size={RFValue(20)}
                color="#000"
              />
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>Zapamiętaj mnie</Text>
          </View>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>Zaloguj się</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Nie pamiętasz hasła?</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {!loggedIn && <BottomNavGuest navigation={navigation} />}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    width: width,
    height: height,
  },
  topContent: {
    alignItems: "center",
    marginTop: RFValue(30),
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
  cross: {
    marginTop: RFValue(20),
  },
  loginBox: {
    marginTop: RFValue(20),
    marginHorizontal: RFValue(20),
    padding: RFValue(20),
    backgroundColor: "#fff9ec",
    borderRadius: RFValue(15),
    elevation: 3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: RFValue(8),
    marginBottom: RFValue(15),
    paddingHorizontal: RFValue(10),
  },
  icon: {
    width: RFValue(20),
    height: RFValue(20),
    resizeMode: "contain",
    marginRight: RFValue(10),
  },
  input: {
    flex: 1,
    height: RFValue(45),
    fontSize: RFValue(14),
    color: "#000",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RFValue(15),
    marginLeft: RFValue(5),
  },
  checkboxLabel: {
    fontSize: RFValue(14),
    color: "#000",
    marginLeft: RFValue(5),
  },
  loginButton: {
    backgroundColor: "#e7c27c",
    paddingVertical: RFValue(12),
    borderRadius: RFValue(8),
    alignItems: "center",
    marginBottom: RFValue(10),
  },
  loginText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#000",
  },
  forgotPassword: {
    fontSize: RFValue(13),
    textAlign: "center",
    color: "#6e4b1f",
    marginTop: RFValue(5),
  },
});
