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
} from "react-native";
import BottomNavUser from "../components/BottomNavUser";
import { RFValue } from "react-native-responsive-fontsize";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAboutAppData } from "../utils/api";
import Constants from "expo-constants";
import { getProfilData } from "../utils/api";
const { width, height } = Dimensions.get("window");

export default function ProfilScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
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
          <Text style={styles.title}>Jan Kowalski </Text>
          <View style={styles.line} />
          <View style={styles.section}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>jan.kowalski@example.com</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Stopień</Text>
            <Text style={styles.value}>Ministrant</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Login</Text>
            <Text style={styles.value}>jan.kow</Text>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Zmiana hasła</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <View style={styles.section}>
            <Text style={styles.labelHarm}>Harmonogram dyżurów</Text>
            <View style={styles.massBox}>
              <Image
                source={require("../assets/kielich.png")}
                style={[styles.cross]}
              />
              <View style={styles.massTextContainer}>
                <Text style={styles.massTitle}>Dzień powszedni</Text>
                <Text style={styles.massTime}>Piątek godz. 18:00</Text>
              </View>
            </View>
            <View style={styles.massBox}>
              <Image
                source={require("../assets/kielich.png")}
                style={[styles.cross]}
              />
              <View style={styles.massTextContainer}>
                <Text style={styles.massTitle}>Niedziela</Text>
                <Text style={styles.massTime}>Niedziela godz. 9:00</Text>
              </View>
            </View>
          </View>
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
});
