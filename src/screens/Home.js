import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Layout, useTheme } from "react-native-rapi-ui";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { ref, get } from "firebase/database";
import { db } from "./firebaseConfig";
import * as Location from "expo-location";
import haversine from "haversine";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const auth = getAuth();
const firestore = getFirestore();

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();

  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [nearestPharmacies, setNearestPharmacies] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    // Ambil profil pengguna yang sedang login agar sapaan lebih personal
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserName(userData.name || "User");
          setUserPhone(userData.phone || "Unknown");
        } else {
          setUserName("User");
          setUserPhone("Unknown");
        }
      } else {
        setUserName("User");
        setUserPhone("Unknown");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchNearestPharmacies = useCallback(async (userCoords) => {
    try {
      const snapshot = await get(ref(db, "apotek"));
      const apotekData = snapshot.val();

      if (apotekData) {
        const apoteks = Object.values(apotekData);
        const nearest = apoteks
          .map((apotek) => ({
            ...apotek,
            distance: haversine(userCoords, {
              latitude: apotek.latitude,
              longitude: apotek.longitude,
            }),
          }))
          .sort((a, b) => a.distance - b.distance);
        setNearestPharmacies(nearest);
      } else {
        setNearestPharmacies([]);
      }
    } catch (error) {
      console.log("Error fetching apotek", error);
      setNearestPharmacies([]);
      setLocationError("Tidak dapat memuat daftar apotek.");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setIsLoadingLocation(true);
        setLocationError(null);
        // Permintaan izin lokasi dipisahkan agar mudah di-debug bila gagal
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (isMounted) {
            setLocationError(
              "Izin lokasi ditolak. Aktifkan untuk melihat apotek terdekat."
            );
          }
          return;
        }

        // Ambil posisi saat ini lalu hitung jarak ke data apotek
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (isMounted) {
          fetchNearestPharmacies(currentLocation.coords);
        }
      } catch (error) {
        console.log("Location error", error);
        if (isMounted) {
          setLocationError("Gagal mendapatkan lokasi. Coba lagi nanti.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingLocation(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [fetchNearestPharmacies]);

  const openGoogleMaps = useCallback((latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url);
  }, []);

  const quickActions = useMemo(
    () => [
      {
        label: "Obat",
        icon: "pill",
        color: "#34d399",
        action: () => navigation.navigate("Obat"),
      },
      {
        label: "Penyakit",
        icon: "virus",
        color: "#fb7185",
        action: () => navigation.navigate("Penyakit"),
      },
      {
        label: "Alat",
        icon: "stethoscope",
        color: "#60a5fa",
        action: () => navigation.navigate("Alat"),
      },
      {
        label: "Apotek",
        icon: "hospital-building",
        color: "#facc15",
        action: () => navigation.navigate("Apotek"),
      },
    ],
    [navigation]
  );

  const renderPharmacyCard = useCallback(
    (item, index) => (
      <View
        key={`${item.id || item.name}-${index}`}
        style={[
          styles.pharmacyCard,
          {
            backgroundColor: isDarkmode ? "#111827" : "#fff",
            borderColor: isDarkmode ? "#1f2937" : "#e5e7eb",
          },
        ]}
      >
        <View style={styles.pharmacyInfo}>
          <Text
            style={[
              styles.pharmacyTitle,
              { color: isDarkmode ? "#fff" : "#1f2937" },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.pharmacyAddress,
              { color: isDarkmode ? "#d1d5db" : "#4b5563" },
            ]}
            numberOfLines={2}
          >
            {item.address}
          </Text>
          <Text style={{ color: isDarkmode ? "#93c5fd" : "#2563eb" }}>
            {item.distance.toFixed(2)} km dari lokasi Anda
          </Text>
        </View>
        <View style={styles.pharmacyActions}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Lihat detail apotek"
            style={[
              styles.detailButton,
              { backgroundColor: isDarkmode ? "#1f2937" : "#e0f2fe" },
            ]}
            onPress={() => navigation.navigate("DetailApotek", { apotek: item })}
          >
            <Text style={{ color: isDarkmode ? "#fff" : "#0f172a" }}>Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Buka lokasi di Google Maps"
            style={styles.mapButton}
            onPress={() => openGoogleMaps(item.latitude, item.longitude)}
          >
            <Ionicons name="location-sharp" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [isDarkmode, navigation, openGoogleMaps]
  );

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient
          colors={isDarkmode ? ["#0f172a", "#1f2937"] : ["#3b82f6", "#8b5cf6"]}
          style={styles.heroCard}
        >
          <View style={styles.heroContent}>
            <Image
              source={require("../../assets/logohome.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.heroGreeting}>Halo,</Text>
              <Text style={styles.heroName}>{userName}</Text>
              <Text style={styles.heroSubtext}>
                {userPhone !== "Unknown"
                  ? `Kontak daruratmu: ${userPhone}`
                  : "Butuh bantuan kesehatan hari ini?"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.heroChatButton}
            onPress={() => navigation.navigate("Chat")}
          >
            <MaterialCommunityIcons
              name="android-messages"
              size={22}
              color="#1f2937"
            />
            <Text style={styles.heroChatText}>Hubungi Admin</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkmode ? "#f9fafb" : "#111827" },
            ]}
          >
            Menu Pintas
          </Text>
          <View style={styles.quickActionWrapper}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={[
                  styles.quickActionItem,
                  { backgroundColor: `${action.color}1A` },
                ]}
                onPress={action.action}
              >
                <View
                  style={[styles.quickIconWrapper, { backgroundColor: action.color }]}
                >
                  <MaterialCommunityIcons
                    name={action.icon}
                    size={22}
                    color="#fff"
                  />
                </View>
                <Text
                  style={[
                    styles.quickActionLabel,
                    { color: isDarkmode ? "#f9fafb" : "#111827" },
                  ]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkmode ? "#f9fafb" : "#111827" },
            ]}
          >
            Apotek Terdekat
          </Text>
          {isLoadingLocation ? (
            <View style={styles.feedbackCard}>
              <ActivityIndicator color={isDarkmode ? "#fff" : "#2563eb"} />
              <Text
                style={[
                  styles.feedbackText,
                  { color: isDarkmode ? "#e5e7eb" : "#4b5563" },
                ]}
              >
                Mencari lokasi Anda...
              </Text>
            </View>
          ) : locationError ? (
            <View style={styles.feedbackCard}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color="#f97316"
              />
              <Text
                style={[
                  styles.feedbackText,
                  { color: isDarkmode ? "#fcd34d" : "#92400e" },
                ]}
              >
                {locationError}
              </Text>
            </View>
          ) : nearestPharmacies.length > 0 ? (
            <View>
              {nearestPharmacies.slice(0, 3).map(renderPharmacyCard)}
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate("Apotek")}
              >
                <Text style={styles.viewAllButtonText}>Lihat semua apotek</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.feedbackCard}>
              <MaterialCommunityIcons
                name="map-search"
                size={24}
                color="#60a5fa"
              />
              <Text
                style={[
                  styles.feedbackText,
                  { color: isDarkmode ? "#d1d5db" : "#4b5563" },
                ]}
              >
                Belum ada apotek di sekitar lokasi Anda.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    marginTop: -10,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 16,
  },
  heroGreeting: {
    fontSize: 16,
    color: "#e0f2fe",
    fontFamily: "Poppins",
  },
  heroName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Poppins",
  },
  heroSubtext: {
    fontSize: 14,
    color: "#e0e7ff",
    marginTop: 4,
    fontFamily: "Poppins",
  },
  heroChatButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  heroChatText: {
    marginLeft: 8,
    color: "#1f2937",
    fontFamily: "Poppins",
    fontWeight: "600",
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins",
    marginBottom: 12,
  },
  quickActionWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionItem: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  quickIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  quickActionLabel: {
    fontFamily: "Poppins",
    fontWeight: "600",
  },
  feedbackCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  feedbackText: {
    fontFamily: "Poppins",
    textAlign: "center",
  },
  pharmacyCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  pharmacyInfo: {
    flex: 1,
    marginRight: 12,
  },
  pharmacyTitle: {
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "600",
  },
  pharmacyAddress: {
    fontSize: 13,
    fontFamily: "Poppins",
    marginVertical: 4,
  },
  pharmacyActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mapButton: {
    marginTop: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f2937",
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 8,
    gap: 6,
  },
  viewAllButtonText: {
    color: "#fff",
    fontFamily: "Poppins",
    fontWeight: "600",
  },
});
