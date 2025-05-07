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
import { RectButton } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("window");
export default function CalendarScreen({ route, navigation }) {
  const { loggedIn } = useContext(AuthContext);
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadToday = async () => {
      const data = await fetchTodayLiturgicalData();
      setTodayData(data);
      setLoading(false);
    };
    loadToday();
  }, []);
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6e4b1f" />
      </View>
    );
  }
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
              <Text style={styles.dayLabel}>{todayData.dayName}</Text>
              <Text style={styles.todayDate}>
                {todayData.date}
                {todayData.celebrations.map((item, index) => (
                  <View key={index} style={styles.celebrationBlock}>
                    <Text style={styles.celebrationName}>{item.name}</Text>
                    {item.color && (
                      <Text style={[styles.litugicalColor]}>
                        {capitalize(item.color)}
                      </Text>
                    )}
                    {item.sigla && (
                      <Text style={styles.sigla}>{item.sigla}</Text>
                    )}
                  </View>
                ))}
              </Text>
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
      {!loggedIn && <BottomNavGuest navigation={navigation} />}
    </ImageBackground>
  );
}
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

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
  todayDate: {
    fontFamily: "Cinzel-Bold",
    fontSize: RFValue(14),
  },
  celebrationBlock: {
    marginBottom: RFValue(10),
  },
  celebrationName: {
    fontSize: RFValue(16),
    marginTop: RFValue(10),
    color: "$1a1204",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: width * 0.65,
    fontWeight: "bold",
  },
  litugicalColor: {
    fontSize: RFValue(14),
    marginVertical: RFValue(5),
  },
  sigla: {
    fontSize: RFValue(13),
    marginVertical: RFValue(5),
    color: "$1a1204",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: width * 0.65,
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
});
