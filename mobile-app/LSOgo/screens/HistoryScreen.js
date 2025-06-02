import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { RFValue } from "react-native-responsive-fontsize";
import BottomNavUser from "../components/BottomNavUser";
import { getRankingData } from "../utils/api";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { getHistoryData } from "../utils/api";

export default function HistoryScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState(null);
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getHistoryData();
        setHistoryData(history);
      } catch (error) {
        console.error("Błąd pobierana danych ", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6e4b1f" />
      </View>
    );
  }
  if (!historyData) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#4a2d0f", fontSize: RFValue(18) }}>
          Brak danych rankingowych do wyświetlenia.
        </Text>
      </View>
    );
  }
  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMethod=""
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Historia</Text>

          {historyData.map((entry, index) => (
            <View key={index} style={styles.entryBox}>
              <View style={styles.rowBetween}>
                <Text style={styles.dateDay}>
                  {entry.day} {entry.date}
                </Text>
                <Text
                  style={[
                    styles.points,
                    entry.points < 0 ? styles.negative : styles.positive,
                  ]}
                >
                  {entry.points > 0 ? `+${entry.points}` : entry.points} pkt
                </Text>
              </View>

              <Text style={styles.serviceName}>{entry.name}</Text>
              <Text style={styles.time}>{entry.time}</Text>

              {entry.points < 0 && (
                <TouchableOpacity style={styles.justifyButton}>
                  <Text style={styles.justifyText}>USPRAWIEDLIWIJ</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
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
  scrollContent: {
    padding: RFValue(16),
  },
  title: {
    fontSize: RFValue(32),
    fontWeight: "bold",
    color: "#4a2d0f",
    textAlign: "center",
    marginBottom: RFValue(20),
  },
  entryBox: {
    borderWidth: 1,
    borderColor: "#c4a46d",
    borderRadius: 10,
    padding: RFValue(12),
    marginBottom: RFValue(14),
    backgroundColor: "#fff8e1",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateDay: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#3d2b1f",
  },
  serviceName: {
    fontSize: RFValue(15),
    color: "#3d2b1f",
    marginTop: RFValue(4),
  },
  time: {
    fontSize: RFValue(16),
    color: "#3d2b1f",
    marginTop: RFValue(3),
    fontWeight: "bold",
  },
  points: {
    fontSize: RFValue(18),
    fontWeight: "bold",
  },
  negative: {
    color: "#c00000",
  },
  positive: {
    color: "#118800",
  },
  justifyButton: {
    marginTop: RFValue(10),
    alignSelf: "flex-end",
    paddingVertical: RFValue(6),
    paddingHorizontal: RFValue(12),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a2d0f",
    backgroundColor: "#f6deb0",
  },
  justifyText: {
    color: "#4a2d0f",
    fontWeight: "bold",
  },
});
