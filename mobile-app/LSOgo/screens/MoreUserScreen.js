import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Dimensions } from "react-native";
import BottomNavUser from "../components/BottomNavUser";
export default function MoreScreen({ navigation }) {
  const { loggedIn, logout } = useContext(AuthContext);
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.contentWrapper}>
          <Text style={styles.title}>Więcej opcji</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Notification")}
          >
            <View style={styles.optionContent}>
              <Image
                source={require("../assets/powiadomienia.png")}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Powiadomienia</Text>
            </View>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Kontakt")}
          >
            <View style={styles.optionContent}>
              <Image
                source={require("../assets/contact.png")}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Kontakt</Text>
            </View>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={async () => {
              const result = await logout();
              if (!result) {
                return;
              } else {
                navigation.replace("Login");
              }
            }}
          >
            <View style={styles.optionContent}>
              <Image
                source={require("../assets/logout.png")}
                style={styles.icon}
              />
              <Text style={styles.optionText}>Wyloguj</Text>
            </View>
            <Text style={styles.arrow}>{">"}</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    textAlign: "center",
    color: "#4a2d0f",
    marginBottom: RFValue(30),
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: RFValue(15),
    borderBottomColor: "#4a2d0f",
    borderBottomWidth: 1,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: RFValue(24),
    height: RFValue(24),
    marginRight: RFValue(12),
    resizeMode: "contain",
  },
  optionText: {
    fontSize: RFValue(18),
    color: "#4a2d0f",
  },
  arrow: {
    fontSize: RFValue(20),
    color: "#4a2d0f",
  },
});
