import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, Image, Platform } from "react-native";
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

const { width, height } = Dimensions.get("window");
export default function CalendarScreen({ route }) {
  const loggedIn = route?.params?.loggedIn;

  const today = {
    saint: "Święto Świętego Marka ewangelisty",
    color: "Czerwony",
  };

  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);

    return {
      day: date.toLocaleDateString("pl-PL", { weekday: "long" }),
      date: `${date.getDate()} ${date.toLocaleDateString("pl-PL", {
        month: "long",
      })} ${date.getFullYear()}`,
    };
  });

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={{ marginTop: 0 }}>
        <View style={styles.header}>
          <Image
            source={require("../assets/pngwing.com.png")}
            style={styles.ornament}
          />
        </View>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Kalendarz</Text>
          <Text style={styles.title}>Liturgiczny</Text>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.cardToday}>
            <Image
              source={require("../assets/cross.png")}
              style={styles.crossDay}
            />
            <View style={styles.saintCard}>
              <Text style={styles.dayLabel}>Dziś</Text>
              <Text style={styles.saint}>{today.saint}</Text>
              <Text style={styles.colorLabel}>Kolor liturgiczny</Text>
              <Text style={styles.color}>{today.color}</Text>
            </View>
          </View>
          {weekDays.map((item, index) => (
            <View key={index} style={styles.cardDay}>
              <Image
                source={require("../assets/cross.png")}
                style={styles.cross}
              />
              <View>
                <Text style={styles.dayName}>{item.day}</Text>
                <Text style={styles.dayDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      {!loggedIn && (
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../assets/home.png")}
              style={styles.navIcon}
            />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../assets/about.png")}
              style={styles.navIcon}
            />
            <Text style={styles.navText}>O nas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../assets/contact.png")}
              style={styles.navIcon}
            />
            <Text style={styles.navText}>Kontakt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require("../assets/login.png")}
              style={styles.navIcon}
            />
            <Text style={styles.navText}>Log in</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
  },
  side: {
    width: width * 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ornament: {
    width: width * 0.8,
    height: RFValue(60),
    resizeMode: "contain",
  },
  titleWrapper: {
    marginTop: height * 0.001,
    alignItems: "center",
  },
  title: {
    fontFamily: "Cinzel-Bold",
    fontSize: width * 0.09,
    color: "#1a1204",
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: width * 0.1,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollContainer: {
    padding: width * 0.05,
    paddingBottom: RFValue(140),
  },
  cardToday: {
    borderWidth: 1,
    borderColor: "#1a1204",
    flexDirection: "row",
    padding: RFValue(15),
    borderRadius: 20,
    marginBottom: RFValue(20),
    alignItems: "center",
  },
  saintCard: {
    paddingLeft: RFValue(10),
  },
  crossDay: {
    width: RFValue(50),
    height: RFValue(80),
  },
  cross: {
    width: RFValue(24),
    height: RFValue(34),
    marginRight: RFValue(15),
  },
  dayLabel: {
    fontFamily: "Cinzel-Regular",
    fontSize: RFValue(24),
    color: "#1a1204",
  },
  saint: {
    fontSize: RFValue(16),
    marginTop: RFValue(4),
    color: "$1a1204",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: width * 0.7,
  },
  colorLabel: {
    fontSize: RFValue(12),
    marginTop: RFValue(8),
    color: "#444",
  },
  color: {
    fontSize: RFValue(14),
    color: "red",
    fontWeight: "bold",
  },
  cardDay: {
    flexDirection: "row",
    alignItems: "center",
    padding: RFValue(12),
    borderWidth: 1,
    borderColor: "#1a1204",
    borderRadius: 10,
    marginBottom: RFValue(15),
  },
  dayName: {
    fontFamily: "Cinzel-Regular",
    fontSize: RFValue(16),
    color: "#1a1204",
  },
  dayDate: {
    fontFamily: "Cinzel-Regular",
    fontSize: RFValue(14),
    color: "#1a1204",
  },
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
  },
  navText: {
    fontSize: RFValue(12),
    color: "#1a1204",
  },
  navIcon: {
    width: RFValue(15),
    height: RFValue(15),
    resizeMode: "contain",
  },
});
