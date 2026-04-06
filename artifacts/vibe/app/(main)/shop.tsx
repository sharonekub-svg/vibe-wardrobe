import { PaywallModal } from "@/components/PaywallModal";
import { FashionItem, useApp } from "@/context/AppContext";
import { getCollectionLabel, mapApiItem } from "@/utils/fashion";
import { useColors } from "@/hooks/useColors";
import { useGetFashionItems } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProfile, likedItems, likedTags, isSubscribed, setIsSubscribed } = useApp();
  const [paywallVisible, setPaywallVisible] = useState(!isSubscribed);

  const age = userProfile?.age;

  const { data, isLoading } = useGetFashionItems(
    age !== undefined ? { age } : {},
    { query: { staleTime: 5 * 60 * 1000 } }
  );

  useEffect(() => {
    if (!isSubscribed) setPaywallVisible(true);
  }, [isSubscribed]);

  const allItems: FashionItem[] = useMemo(
    () => (data?.items ?? []).map(mapApiItem),
    [data]
  );

  const recommendedItems: FashionItem[] = useMemo(() => {
    const likedIds = new Set(likedItems.map((i) => i.id));
    const tagSet = new Set(likedTags.slice(0, 10)); // top 10 liked tags

    if (tagSet.size === 0) {
      // No likes yet — return full shuffled pool
      return allItems.filter((i) => !likedIds.has(i.id)).slice(0, 20);
    }

    return allItems
      .filter((i) => !likedIds.has(i.id))
      .map((item) => {
        const score = (item.tags ?? []).filter((t) => tagSet.has(t)).length;
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
      .slice(0, 20);
  }, [allItems, likedTags, likedItems]);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setPaywallVisible(false);
  };

  const topTag = likedTags[0] ?? null;
  const collectionLabel = getCollectionLabel(age);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + (Platform.OS === "web" ? 60 : 14) }]}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
          <View style={s.headerText}>
            <Text style={[s.title, { color: colors.foreground }]}>My Shop</Text>
            <Text style={[s.subtitle, { color: colors.mutedForeground }]}>
              {topTag
                ? `Because you liked "${topTag}" styles`
                : `Personalised ${collectionLabel} picks`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(main)/wardrobe")}
            style={[s.wardrobeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Feather name="heart" size={14} color={colors.primary} />
            <Text style={[s.wardrobeBtnText, { color: colors.foreground }]}>
              {likedItems.length}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tag pills showing what drove the recommendations */}
        {likedTags.length > 0 && (
          <View style={s.tagRow}>
            {likedTags.slice(0, 5).map((tag) => (
              <View key={tag} style={[s.tagPill, { backgroundColor: colors.accent, borderColor: colors.border }]}>
                <Text style={[s.tagPillText, { color: colors.primary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {isLoading ? (
        <View style={s.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[s.loadingText, { color: colors.mutedForeground }]}>Building your shop…</Text>
        </View>
      ) : (
        <FlatList
          data={recommendedItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={[
            s.grid,
            { paddingBottom: insets.bottom + (Platform.OS === "web" ? 40 : 20) },
          ]}
          columnWrapperStyle={s.row}
          ListEmptyComponent={
            <View style={s.centered}>
              <Feather name="shopping-bag" size={40} color={colors.mutedForeground} />
              <Text style={[s.emptyText, { color: colors.mutedForeground }]}>
                Keep swiping to unlock more recommendations!
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[s.card, s.cardShadow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image
                source={{ uri: item.imageUrl }}
                style={s.cardImage}
                resizeMode="cover"
              />
              <View style={s.cardInfo}>
                <Text style={[s.cardName, { color: colors.foreground }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[s.cardPrice, { color: colors.primary }]}>
                  {item.formattedPrice}
                </Text>
                <Text style={[s.cardCategory, { color: colors.mutedForeground }]}>
                  {item.category}
                </Text>
                <TouchableOpacity
                  style={[s.buyBtn, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    if (!isSubscribed) { setPaywallVisible(true); return; }
                    Linking.openURL(item.buyUrl);
                  }}
                  activeOpacity={0.85}
                >
                  <Feather name="shopping-bag" size={12} color="#ffffff" />
                  <Text style={s.buyText}>Shop H&M</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <PaywallModal
        visible={paywallVisible}
        onDismiss={() => {
          setPaywallVisible(false);
          router.back();
        }}
        onSubscribe={handleSubscribe}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0faf4",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  wardrobeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  wardrobeBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  tagRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  tagPill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  tagPillText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  grid: { paddingHorizontal: 14, paddingTop: 8 },
  row: { gap: 12, marginBottom: 12 },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardShadow: Platform.select({
    ios: { shadowColor: "#2c3e50", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 },
    android: { elevation: 4 },
    web: { boxShadow: "0 4px 16px rgba(44,62,80,0.08)" } as {},
  }) ?? {},
  cardImage: { width: "100%", height: 160 },
  cardInfo: { padding: 12 },
  cardName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4, lineHeight: 18 },
  cardPrice: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 2 },
  cardCategory: { fontSize: 10, fontFamily: "Inter_400Regular", marginBottom: 10 },
  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 12,
    paddingVertical: 8,
  },
  buyText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#ffffff" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 40 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
});
