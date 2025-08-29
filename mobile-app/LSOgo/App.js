import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import CalendarScreen from "./screens/CalendarScreen";
import LoginScreen from "./screens/LoginScreen";
import AboutScreen from "./screens/AboutScreen";
import FirstLoginScreen from "./screens/FirstLoginScreen";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { AuthProvider } from "./context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProfilScreen from "./screens/ProfilScreen";
import MoreUserScreen from "./screens/MoreUserScreen";
import RankingScreen from "./screens/RankingScreen";
import HistoryScreen from "./screens/HistoryScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import ContactScreen from "./screens/ContactScreen";
import MoreModeratorScreen from "./screens/MoreModeratorScreen";
import RankingModeratorScreen from "./screens/RankingModeratorScreen";
import MeatingScreen from "./screens/MeatingScreen";
import ScheduleScreen from "./screens/ScheduleScreen";
import HistoryModeratorScreen from "./screens/HistoryModeratorScreen";
import ContactModeratorScreen from "./screens/ContactModeratorScreen";
import RaportsScreen from "./screens/ReportsScreen";
import AddMassScreen from "./screens/AddMassScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Cinzel-Regular": require("./assets/fonts/Cinzel-Regular.ttf"),
    "Cinzel-Bold": require("./assets/fonts/Cinzel-Bold.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="FirstLogin" component={FirstLoginScreen} />
            <Stack.Screen name="Profil" component={ProfilScreen} />
            <Stack.Screen name="MoreUser" component={MoreUserScreen} />
            <Stack.Screen name="Ranking" component={RankingScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Notification" component={NotificationsScreen} />
            <Stack.Screen name="Contact" component={ContactScreen} />
            <Stack.Screen name="RankingM" component={RankingModeratorScreen} />
            <Stack.Screen name="Meating" component={MeatingScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="ContactM" component={ContactModeratorScreen} />
            <Stack.Screen name="Raport" component={RaportsScreen} />
            <Stack.Screen name="Service" component={AddMassScreen} />
            <Stack.Screen
              name="MoreModerator"
              component={MoreModeratorScreen}
            />
            <Stack.Screen name="HistoryM" component={HistoryModeratorScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
