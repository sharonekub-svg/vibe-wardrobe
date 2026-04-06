import { PaywallModal } from "@/components/PaywallModal";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WardrobeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { likedItems, likedTags, isSubscribed, setIsSubscribed, userProfile } = useApp();
  const [paywallVisible, setPaywallVisible] = useState(false);

  const totalCost = likedItems.reduce((sum, i) => sum + i.price, 0);

  const handleBuy = (url: string) => {
    if (!isSubscribed) { setPaywallVisible(true); return; }
    Linking.openURL(url);
  };

  // Sidebar navigation tabs
  const navItems = [
    { icon: "layers" as const, label: "Swipe", route: "/(main)/swipe" },
    { icon: "heart" as const, label: "Matches", route: "/(main)/wardrobe" },
    { icon: "shopping-bag" as const, label: "Shop", route: "/(main)/shop" },
  ];

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      {/* Blur-effect sidebar navigation */}
      <View style={[s.sidebar, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <BlurView
          intensity={Platform.OS === "web" ? 0 : 60}
          tint="light"
          style={[StyleSheet.absoluteFillObject, { backgroundColor: "rgba(255,255,255,0.85)" }]}
        />
        <Text style={s.sidebarLogo}>V</Text>
        <View style={s.navList}>
          {navItems.map((nav) => {
            const isActive = nav.route === "/(main)/wardrobe";
            return (
              <TouchableOpacity
                key={nav.route}
                style={[s.navItem, isActive && s.navItemActive]}
                onPress={() => router.replace(nav.route as any)}
                activeOpacity={0.7}
              >
                <Feather name={nav.icon} size={20} color={isActive ? "#2ecc71" : "#7f8c8d"} />
                <Text style={[s.navLabel, { color: isActive ? "#2ecc71" : "#7f8c8d" }]}>
                  {nav.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {likedTags.length > 0 && (
          <View style={s.sidebarTags}>
            <Text style={s.sidebarTagsTitle}>Your Vibes</Text>
            {likedTags.slice(0, 5).map((tag) => (
              <View key={tag} style={s.sidebarTagPill}>
                <Text style={s.sidebarTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Main content */}
      <View style={s.main}>
        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + (Platform.OS === "web" ? 60 : 14) }]}>
          <Text style={[s.title, { color: colors.foreground }]}>My Matches</Text>
          <Text style={[s.subtitle, { color: colors.mutedForeground }]}>
            {likedItems.length} items liked this session
          </Text>
          {/* Stats row */}
          <View style={s.statsRow}>
            <View style={[s.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.statLabel, { color: colors.mutedForeground }]}>Items</Text>
              <Text style={[s.statValue, { color: colors.primary }]}>{likedItems.length}</Text>
            </View>
            <View style={[s.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.statLabel, { color: colors.mutedForeground }]}>Total</Text>
              <Text style={[s.statValue, { color: colors.foreground }]}>${totalCost.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[s.shopBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(main)/shop")}
              activeOpacity={0.85}
            >
              <Feather name="shopping-bag" size={14} color="#ffffff" />
              <Text style={s.shopBtnText}>My Shop</Text>
            </TouchableOpacity>
          </View>
        </View>

        {likedItems.length === 0 ? (
          <View style={s.emptyContainer}>
            <View style={[s.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="heart" size={32} color={colors.mutedForeground} />
            </View>
            <Text style={[s.emptyTitle, { color: colors.foreground }]}>No matches yet</Text>
            <Text style={[s.emptySubtitle, { color: colors.mutedForeground }]}>
              Swipe right on styles you love to save them here.
            </Text>
            <TouchableOpacity
              style={[s.swipeAgainBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.replace("/(main)/swipe")}
              activeOpacity={0.85}
            >
              <Text style={s.swipeAgainText}>Start Swiping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={likedItems}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              s.list,
              { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20) },
            ]}
            columnWrapperStyle={s.gridRow}
            renderItem={({ item }) => (
              <View style={[s.itemCard, s.itemCardShadow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Image source={{ uri: item.imageUrl }} style={s.itemImage} resizeMode="cover" />
                <View style={s.itemInfo}>
                  <Text style={[s.itemName, { color: colors.foreground }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={[s.itemPrice, { color: colors.primary }]}>
                    {item.formattedPrice}
                  </Text>
                  <TouchableOpacity
                    style={[s.buyBtn, { backgroundColor: colors.primary }]}
                    onPress={() => handleBuy(item.buyUrl)}
                    activeOpacity={0.85}
                  >
                    <Feather name="shopping-bag" size={11} color="#ffffff" />
                    <Text style={s.buyText}>Buy on H&M</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <PaywallModal
        visible={paywallVisible}
        onDismiss={() => setPaywallVisible(false)}
        onSubscribe={() => { setIsSubscribed(true); setPaywallVisible(false); }}
      />
    </View>
  );
}

const SIDEBAR_WIDTH = 72;

const s = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  // Blur sidebar
  sidebar: {
    width: SIDEBAR_WIDTH,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#d5f5e3",
    overflow: "hidden",
    zIndex: 10,
  },
  sidebarLogo: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#2ecc71",
    marginBottom: 28,
  },
  navList: { gap: 6, width: "100%", alignItems: "center" },
  navItem: {
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 12,
    gap: 4,
  },
  navItemActive: { backgroundColor: "rgba(46,204,113,0.1)" },
  navLabel: { fontSize: 9, fontFamily: "Inter_500Medium", textAlign: "center" },
  sidebarTags: { flex: 1, justifyContent: "flex-end", gap: 6, paddingHorizontal: 8, width: "100%" },
  sidebarTagsTitle: { fontSize: 8, color: "#bdc3c7", fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  sidebarTagPill: { backgroundColor: "#e8f8f0", borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3 },
  sidebarTagText: { fontSize: 9, color: "#2ecc71", fontFamily: "Inter_500Medium" },
  // Main
  main: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#d5f5e3" },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 2 },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  statCard: { flex: 1, borderRadius: 12, padding: 10, borderWidth: 1, alignItems: "center" },
  statLabel: { fontSize: 9, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 1 },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  shopBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 12,
    paddingVertical: 10,
  },
  shopBtnText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#ffffff" },
  list: { padding: 12 },
  gridRow: { gap: 10, marginBottom: 10 },
  itemCard: { flex: 1, borderRadius: 20, overflow: "hidden", borderWidth: 1 },
  itemCardShadow: Platform.select({
    ios: { shadowColor: "#2c3e50", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 },
    android: { elevation: 3 },
    web: { boxShadow: "0 4px 12px rgba(44,62,80,0.08)" } as {},
  }) ?? {},
  itemImage: { width: "100%", aspectRatio: 3 / 4 },
  itemInfo: { padding: 10 },
  itemName: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 4, lineHeight: 17 },
  itemPrice: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 8 },
  buyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 10, paddingVertical: 7 },
  buyText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#ffffff" },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 14 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptySubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  swipeAgainBtn: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 6 },
  swipeAgainText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#ffffff" },
});
