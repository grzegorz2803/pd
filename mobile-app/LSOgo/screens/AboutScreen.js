import React from "react";
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

const { width, height } = Dimensions.get("window");
export default function AboutScreen({ navigation }) {
  const { loggedIn } = useContext(AuthContext);
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>O aplikacji</Text>
            <Text style={styles.sectionText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Autor</Text>
            <Text style={styles.sectionText}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </Text>
          </View>
          <View style={styles.linkBox}>
            <Text style={styles.linkBoxText}>
              Zapraszamy na stronę oficjalną, gdzie można znaleźć więcej
              informacji o LSOgo oraz związane z nim oferty.
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL("http://www.google.pl")}
            >
              <Text style={styles.linkButtonTexx}>Zobacz więcej</Text>
            </TouchableOpacity>
          </View>
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
});
