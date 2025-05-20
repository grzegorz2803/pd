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
const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  return (
    <ImageBackground
      source={require("../assets/background_login.png")}
      style={styles.container}
      resizeMethod="cover"
    >
      <SafeAreaView style={{ marginTop: 0 }}>
        <View style={styles.topContent}>
          <Text style={styles.title}>LSOgo</Text>
          <Text style={styles.subtitle}>
            System rejestracji obecności ministrantów
          </Text>
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
              placeholder="Login"
              //   value={login}
              placeholderTextColor="#444"
            />
          </View>
          <View style={styles.checkboxContainer}>
            {/* <CheckBox /> */}
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
    </ImageBackground>
  );
}
const styles = StyleSheet.create({});
