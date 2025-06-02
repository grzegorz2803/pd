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
export default function RankingScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
  const [mode, setMode] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState(null);
  useEffect(() => {
    const loadRanking = async () => {
      try {
        const ranking = await getRankingData();
        setRankingData(ranking);
      } catch (error) {
        console.error("Błąd pobierana danych ", error);
      } finally {
        setLoading(false);
      }
    };
    loadRanking();
  }, []);
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6e4b1f" />
      </View>
    );
  }
  if (!rankingData || !rankingData.month || !rankingData.year) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#4a2d0f", fontSize: RFValue(18) }}>
          Brak danych rankingowych do wyświetlenia.
        </Text>
      </View>
    );
  }
  const currentData = mode === "monthly" ? rankingData.month : rankingData.year;

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.contentWrapper}>
          <Text style={styles.title}>Ranking</Text>

          {/* Przełącznik */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "monthly" && styles.activeToggle,
              ]}
              onPress={() => setMode("monthly")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "monthly" && styles.activeToggleText,
                ]}
              >
                Miesięczny
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "yearly" && styles.activeToggle,
              ]}
              onPress={() => setMode("yearly")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "yearly" && styles.activeToggleText,
                ]}
              >
                Roczny
              </Text>
            </TouchableOpacity>
          </View>

          {/* Punkty */}
          <View style={styles.pointsWrapper}>
            <View style={styles.pointsBox}>
              <View style={styles.pointsItem}>
                <Text style={styles.pointsLabel}>Służba</Text>
                <Text style={styles.pointsValue}>{currentData.points}</Text>
              </View>
              <View style={styles.pointsItem}>
                <Text style={styles.pointsLabel}>Zbiórki</Text>
                <Text style={styles.pointsValue}>
                  {currentData.points_meating}
                </Text>
              </View>
              <View style={styles.pointsItem}>
                <Text style={styles.pointsLabel}>Suma</Text>
                <Text style={styles.pointsValue}>{currentData.sum}</Text>
              </View>
            </View>
          </View>
          {/* Herb z miejscem */}
          <View style={styles.shieldContainer}>
            <Image
              source={require("../assets/tarcza.png")}
              style={styles.shieldImage}
            />
            <View style={styles.shieldTextOverlay}>
              <Text style={styles.positionNumber}>{currentData.ranking}</Text>
              <Text style={styles.positionLabel}>AKTUALNE{"\n"}MIEJSCE</Text>
            </View>
          </View>

          {/* Informacje o różnicy punktowej */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Zestawienie punktowe:</Text>
            <Text style={styles.infoText}>
              Strata do 1. miejsca: {currentData.strata_do_lidera} pkt
            </Text>
            <Text style={styles.infoText}>
              Strata do {currentData.ranking - 1}. miejsca:{" "}
              {currentData.strata_do_poprzedzajacego} pkt
            </Text>
            <Text style={styles.infoText}>
              Przewaga nad {currentData.ranking + 1}. miejscem:{" "}
              {currentData.przewaga_nad_nastepnym} pkt
            </Text>
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
    alignItems: "center",
  },
  title: {
    fontSize: RFValue(32),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginBottom: RFValue(20),
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: RFValue(20),
  },
  toggleButton: {
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(20),
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 8,
    marginHorizontal: RFValue(5),
  },
  toggleText: {
    color: "#4a2d0f",
    fontSize: RFValue(14),
    fontWeight: "bold",
  },
  activeToggle: {
    backgroundColor: "#ddb66f",
  },
  activeToggleText: {
    color: "#000",
  },
  pointsWrapper: {
    borderWidth: 1,
    borderColor: "#4a2d0f",
    borderRadius: 10,
    padding: RFValue(10),
    marginBottom: RFValue(20),
  },
  pointsBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  pointsItem: {
    alignItems: "center",
    flex: 1,
  },
  pointsLabel: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  pointsValue: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  shieldContainer: {
    position: "relative",
    width: RFValue(200),
    height: RFValue(220),
    alignItems: "center",
    justifyContent: "center",
  },
  shieldImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  shieldTextOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  positionNumber: {
    fontSize: RFValue(48),
    fontWeight: "bold",
    color: "#4a2d0f",
  },
  positionLabel: {
    fontSize: RFValue(14),
    fontWeight: "600",
    textAlign: "center",
    color: "#4a2d0f",
    marginTop: RFValue(5),
  },
  infoBox: {
    marginTop: RFValue(10),
  },
  infoText: {
    fontSize: RFValue(16),
    fontWeight: "bold",
    color: "#4a2d0f",
    marginVertical: RFValue(4),
  },
  infoLabel: {
    textAlign: "center",
    fontSize: RFValue(20),
    fontWeight: "bold",
    marginBottom: RFValue(5),
  },
});
