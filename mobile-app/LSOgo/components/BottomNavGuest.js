import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export default function BottomNavGuest({ navigation }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Calendar")}
      >
        <Image source={require("../assets/home.png")} style={styles.navIcon} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("About")}
      >
        <Image source={require("../assets/about.png")} style={styles.navIcon} />
        <Text style={styles.navText}>O nas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Image source={require("../assets/login.png")} style={styles.navIcon} />
        <Text style={styles.navText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: RFValue(10),
    paddingLeft: RFValue(10),
    paddingRight: RFValue(10),
    paddingBottom: RFValue(15),
    borderColor: "#1a1204",
    backgroundColor: "#FDE09F",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: RFValue(12),
    color: "#1a1204",
    marginTop: RFValue(2),
  },
  navIcon: {
    width: RFValue(15),
    height: RFValue(15),
    resizeMode: "contain",
  },
});
