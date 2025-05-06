import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

const SERVER_URL = "http://192.168.1.193:3000/api/data";

export default function SplashScreen({ navigation }) {
  const intervalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      startCheckingConnection();
    }, 4000);
    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
    };
  }, []);
  const startCheckingConnection = () => {
    checkServerConnection();

    intervalRef.current = setInterval(() => {
      checkServerConnection();
    }, 3000);
  };
  const checkServerConnection = async () => {
    try {
      const response = await fetch(SERVER_URL);
      if (response.ok) {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {
          navigation.replace("Calendar", { loggedIn: true });
        } else {
          navigation.replace("Calendar", { loggedIn: false });
        }
      } else {
        console.log("Server odpowiedział  z błędem", response.status);
      }
    } catch (error) {
      console.log("Brak połączenia z serwerem", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
    >
      <LottieView
        source={require("../assets/loading.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.title}>LSOgo</Text>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    fontSize: 50,
    fontWeight: "bold",
    color: "#6e4b1f",
  },
  animation: {
    width: 220,
    height: 220,
  },
});
