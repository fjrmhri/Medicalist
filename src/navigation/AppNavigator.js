import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { themeColor, useTheme } from "react-native-rapi-ui";

import TabBarText from "../components/utils/TabBarText";
import { AuthContext } from "../provider/AuthProvider";
// Screen utama
import About from "../screens/About";
import Alat from "../screens/Alat";
import Apotek from "../screens/Apotek";
import ChatAdmin from "../screens/ChatAdmin";
import ChatUsers from "../screens/ChatUsers";
import DetailAlat from "../screens/DetailAlat";
import DetailApotek from "../screens/DetailApotek";
import DetailObat from "../screens/DetailObat";
import DetailPenyakit from "../screens/DetailPenyakit";
import Favorit from "../screens/Favorit";
import Home from "../screens/Home";
import Loading from "../screens/utils/Loading";
import Obat from "../screens/Obat";
import Penyakit from "../screens/Penyakit";
import Profile from "../screens/Profile";
import Setting from "../screens/Setting";
import ErrorBoundary from "../screens/ErrorBoundary";
// Untuk Auth screens
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import ForgetPassword from "../screens/auth/ForgetPassword";
import First from "../screens/blank/First";

const AuthStack = createNativeStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Stack awal untuk autentikasi sebelum pengguna masuk ke aplikasi utama */}
      <AuthStack.Screen name="First" component={First} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen name="ForgetPassword" component={ForgetPassword} />
    </AuthStack.Navigator>
  );
};

const MainStack = createNativeStackNavigator();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Stack utama untuk fitur setelah login, dipisahkan agar alur jelas */}
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="Obat" component={Obat} />
      <MainStack.Screen name="Alat" component={Alat} />
      <MainStack.Screen name="Penyakit" component={Penyakit} />
      <MainStack.Screen name="Apotek" component={Apotek} />
      <MainStack.Screen name="DetailObat" component={DetailObat} />
      <MainStack.Screen name="DetailAlat" component={DetailAlat} />
      <MainStack.Screen name="DetailPenyakit" component={DetailPenyakit} />
      <MainStack.Screen name="DetailApotek" component={DetailApotek} />
      <MainStack.Screen name="About" component={About} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="Chat" component={ChatAdmin} />
      <MainStack.Screen name="Favorit" component={Favorit} />
      <MainStack.Screen name="ChatUsers" component={ChatUsers} />
    </MainStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  const iconSize = 24;
  const penyakitIconSize = 21;
  const apotekIconSize = 22;

  // Konfigurasi tab bawah untuk akses cepat ke menu utama
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Home" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              size={iconSize}
              color={focused ? themeColor.primary : themeColor.gray}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Obat"
        component={Obat}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Obat" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="pill"
              size={iconSize}
              color={focused ? themeColor.primary : themeColor.gray}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Penyakit"
        component={Penyakit}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Penyakit" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="virus"
              size={penyakitIconSize}
              color={focused ? themeColor.primary : themeColor.gray}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Alat"
        component={Alat}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Alat" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="stethoscope"
              size={apotekIconSize}
              color={focused ? themeColor.primary : themeColor.gray}
              top={1}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Profile" />
          ),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              size={iconSize}
              color={focused ? themeColor.primary : themeColor.gray}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  // Error boundary membungkus navigasi agar crash tidak memutus sesi pengguna
  return (
    <ErrorBoundary>
      <NavigationContainer>
        {user === null && <Loading />}
        {user === false && <Auth />}
        {user === true && <Main />}
      </NavigationContainer>
    </ErrorBoundary>
  );
};
