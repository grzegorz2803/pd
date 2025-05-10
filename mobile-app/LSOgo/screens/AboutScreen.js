import React, { useEffect, useState, version } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Linking,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import BottomNavGuest from "../components/BottomNavGuest";
import { RFValue } from "react-native-responsive-fontsize";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchAboutAppData } from "../utils/api";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");
export default function AboutScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
  const [appAbout, setAppAbout] = useState(null);
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAboutAppData(Constants.expoConfig.version);
      console.log(data);
      if (data) {
        setAppAbout(data);
      }
    };
    loadData();
  }, []);
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
          <Text style={styles.title}>LSOgo</Text>
        </View>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
        >
          {appAbout && appAbout[0] && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>O aplikacji</Text>
                <Text style={styles.version}>Wersja: </Text>
                <Text style={styles.sectionText}>
                  {appAbout[0].description_app}
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Autor</Text>

                <Text style={styles.sectionText}>
                  {appAbout[0].description_author}
                </Text>
              </View>
              <View style={styles.linkBox}>
                <Text style={styles.linkBoxText}>
                  {appAbout[0].website_note}
                </Text>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => Linking.openURL(appAbout[0].website_url)}
                >
                  <Text style={styles.linkButtonTexx}>Zobacz więcej</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
      {!loggedIn && <BottomNavGuest navigation={navigation} />}
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
  section: {
    marginBottom: RFValue(20),
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#1a1204",
    marginBottom: RFValue(6),
    textAlign: "left",
  },
  sectionText: {
    fontSize: RFValue(14),
    color: "#1a1204",
    lineHeight: RFValue(20),
    textAlign: "left",
  },
  linkBox: {
    borderWidth: 1,
    borderColor: "#1a1204",
    borderRadius: RFValue(8),
    padding: RFValue(10),
    marginTop: RFValue(20),
    alignItems: "center",
  },
  linkBoxText: {
    fontSize: RFValue(14),
    textAlign: "center",
    marginBottom: RFValue(10),
    color: "#1a1204",
  },
  linkButton: {
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(8),
    borderWidth: 1,
    borderColor: "#1a1204",
    borderRadius: RFValue(6),
  },
  linkButtonTexx: {
    fontSize: RFValue(14),
    color: "#1a1204",
    fontWeight: "bold",
  },
  version: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    marginVertical: RFValue(5),
  },
});
