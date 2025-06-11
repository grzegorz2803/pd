import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function BottomNavGuest({ navigation }) {
  const { logout } = useContext(AuthContext);
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
        onPress={() => navigation.navigate("RankingM")}
      >
        <Image
          source={require("../assets/ranking.png")}
          style={styles.navIcon}
        />
        <Text style={styles.navText}>Rankingi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("HistoryM")}
      >
        <Image
          source={require("../assets/history.png")}
          style={styles.navIcon}
        />
        <Text style={styles.navText}>Historia</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Zbiorki")}
      >
        <Image
          source={require("../assets/zbiorki.png")}
          style={styles.navIcon}
        />
        <Text style={styles.navText}>Zbiórki</Text>
      </TouchableOpacity>

      {/*  */}
      {/*  */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("MoreModerator")}
      >
        <Image source={require("../assets/more.png")} style={styles.navIcon} />
        <Text style={styles.navText}>Więcej</Text>
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
