import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Platform } from "react-native";
import {
  View,
  ScrollView,
  ImageBackground,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavGuest from "../components/BottomNavGuest";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchTodayLiturgicalData } from "../utils/api";
import { fetchWeekLiturgicalData } from "../utils/api";
import { RectButton } from "react-native-gesture-handler";
import { withDecay } from "react-native-reanimated";
const { width, height } = Dimensions.get("window");

export default function FirstLoginScreen() {
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
    >
      <Text style={styles.title}>FIRST LOGIN</Text>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: RFValue(20),
  },
});
