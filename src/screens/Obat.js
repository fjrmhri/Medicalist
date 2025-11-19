import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Layout, TopNav, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { ref, onValue, set, remove } from "firebase/database";
import { db } from "./firebaseConfig";

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const [obatList, setObatList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritList, setFavoritList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const obatRef = ref(db, "/obat");
    const favoritRef = ref(db, "/favorit");

    const unsubscribeObat = onValue(
      obatRef,
      (snapshot) => {
        const obatArray = [];
        snapshot.forEach((child) => {
          obatArray.push({ id: child.key, ...child.val() });
        });
        setObatList(obatArray);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );

    const unsubscribeFavorit = onValue(favoritRef, (snapshot) => {
      const favoritArray = [];
      snapshot.forEach((child) => {
        favoritArray.push({ id: child.key, ...child.val() });
      });
      setFavoritList(favoritArray);
    });

    return () => {
      unsubscribeObat();
      unsubscribeFavorit();
    };
  }, []);

  const handleSearch = useCallback((queryText) => {
    setSearchQuery(queryText);
  }, []);

  const filteredObat = useMemo(() => {
    if (!searchQuery.trim()) {
      return obatList;
    }

    return obatList.filter((obat) =>
      obat.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [obatList, searchQuery]);

  const isFavorited = useCallback(
    (obatId) => favoritList.some((favorit) => favorit.id === obatId),
    [favoritList]
  );

  const toggleFavorite = useCallback(
    (obat) => {
      if (!obat?.id) return;
      const favoritRef = ref(db, "/favorit/" + obat.id);

      if (isFavorited(obat.id)) {
        remove(favoritRef).catch((error) =>
          alert("Gagal menghapus favorit: " + error.message)
        );
      } else {
        set(favoritRef, { ...obat }).catch((error) =>
          alert("Gagal menambahkan favorit: " + error.message)
        );
      }
    },
    [isFavorited]
  );

  const formatCurrency = useCallback((value) => {
    if (!value) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }, []);

  const renderObatCard = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: isDarkmode ? "#111827" : "#F3F4F6" },
        ]}
        onPress={() => navigation.navigate("DetailObat", { obat: item })}
      >
        <View style={styles.cardHeader}>
          <Text
            style={[
              styles.cardTitle,
              { color: isDarkmode ? "#fff" : "#111827" },
            ]}
          >
            {item.nama}
          </Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item)}
          >
            <Ionicons
              name={isFavorited(item.id) ? "heart" : "heart-outline"}
              size={20}
              color={isFavorited(item.id) ? "#ef4444" : "#9CA3AF"}
            />
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.cardText,
            { color: isDarkmode ? "#d1d5db" : "#4b5563" },
          ]}
          numberOfLines={3}
        >
          {item.deskripsi}
        </Text>
        <Text style={styles.priceLabel}>Harga</Text>
        <Text
          style={[
            styles.priceValue,
            { color: isDarkmode ? "#93c5fd" : "#2563eb" },
          ]}
        >
          {formatCurrency(item.harga)}
        </Text>
      </TouchableOpacity>
    ),
    [formatCurrency, isDarkmode, isFavorited, navigation, toggleFavorite]
  );

  return (
    <Layout>
      <TopNav
        middleContent="Obat"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? "#fff" : "#000"}
          />
        }
        leftAction={() => navigation.goBack()}
      />

      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={18}
          color={isDarkmode ? "#9CA3AF" : "#6B7280"}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Cari nama obat, kegunaan, atau kandungan"
          placeholderTextColor={isDarkmode ? "#9CA3AF" : "#9CA3AF"}
          style={[
            styles.searchInput,
            {
              backgroundColor: isDarkmode ? "#1F2937" : "#E5E7EB",
              color: isDarkmode ? "#fff" : "#111827",
            },
          ]}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredObat}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={renderObatCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <Text style={styles.noResultsText}>
            {isLoading
              ? "Memuat daftar obat..."
              : "Tidak ada obat yang sesuai dengan pencarian."}
          </Text>
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    marginTop: 16,
    paddingHorizontal: 16,
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: 12,
    paddingLeft: 40,
    borderRadius: 12,
    fontFamily: "Poppins",
  },
  searchIcon: {
    position: "absolute",
    top: 26,
    left: 28,
    zIndex: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Poppins",
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  cardText: {
    fontSize: 14,
    fontFamily: "Poppins",
    marginTop: 8,
  },
  priceLabel: {
    marginTop: 16,
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#6B7280",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 40,
    fontFamily: "Poppins",
    color: "#6B7280",
  },
});
