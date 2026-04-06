import { PaywallModal } from "@/components/PaywallModal";
import { SwipeCard } from "@/components/SwipeCard";
import { FashionItem, useApp } from "@/context/AppContext";
import { getCollectionLabel, mapApiItem } from "@/utils/fashion";
import { useColors } from "@/hooks/useColors";
import { useGetFashionItems } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SHOP_TRIGGER = 30;

export default function SwipeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    userProfile,
    addLikedItem,
    likedItems,
    isSubscribed,
    setIsSubscribed,
  } = useApp();

  const age = userProfile?.age;

  // Pass age so the server returns the right collection (Divided vs full women's)
  const { data, isLoading, isError, refetch } = useGetFashionItems(
    age !== undefined ? { age } : {},
    { query: { staleTime: 0 } } // staleTime:0 → always re-fetch on mount (new session)
  );

  // Server shuffles on every request (staleTime:0 forces re-fetch per session)
  const shuffledItems: FashionItem[] = useMemo(
    () => (data?.items ?? []).map(mapApiItem),
    [data]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const shopTriggered = useRef(false);

  // Reset index when a new shuffled deck arrives
  useEffect(() => {
    setCurrentIndex(0);
    setSwipeCount(0);
    shopTriggered.current = false;
  }, [shuffledItems]);

  const advanceSwipe = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setSwipeCount((c) => {
      const next = c + 1;
      if (next >= SHOP_TRIGGER && !shopTriggered.current) {
        shopTriggered.current = true;
        if (!isSubscribed) setPaywallVisible(true);
        else setTimeout(() => router.push("/(main)/shop"), 400);
      }
      return next;
    });
  }, [isSubscribed]);

  const handleSwipeLeft = useCallback(() => {
    advanceSwipe();
  }, [advanceSwipe]);

  const handleSwipeRight = useCallback(() => {
    const item = shuffledItems[currentIndex];
    if (item) addLikedItem(item);
    advanceSwipe();
  }, [currentIndex, shuffledItems, advanceSwipe]);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setPaywallVisible(false);
    router.push("/(main)/shop");
  };

  const displayItems = shuffledItems.slice(currentIndex, currentIndex + 3).reverse();
  const allDone = currentIndex >= shuffledItems.length;

  const collectionLabel = getCollectionLabel(age);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12) }]}>
        <View style={s.headerRow}>
          <Text style={[s.appName, { color: colors.foreground }]}>
            Vibe<Text style={{ color: colors.primary }}> Fit</Text>
          </Text>
          <TouchableOpacity
            style={[s.wardrobeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push("/(main)/wardrobe")}
            activeOpacity={0.7}
          >
            <Feather name="heart" size={14} color={colors.primary} />
            <Text style={[s.wardrobeBtnText, { color: colors.foreground }]}>
              {likedItems.length} liked
            </Text>
          </TouchableOpacity>
        </View>

        {/* Swipe progress bar */}
        <View style={s.progressRow}>
          <View style={[s.progressTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                s.progressFill,
                {
                  width: `${Math.min((swipeCount / SHOP_TRIGGER) * 100, 100)}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
          <Text style={[s.progressLabel, { color: colors.mutedForeground }]}>
            {swipeCount}/{SHOP_TRIGGER}
          </Text>
        </View>

        <Text style={[s.collectionBadge, { color: colors.primary }]}>
          {collectionLabel}
          {age !== undefined ? ` · ${age}yo` : ""}
        </Text>
      </View>

      {/* Card deck */}
      <View style={s.deck}>
        {isLoading ? (
          <View style={s.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[s.emptySubtitle, { color: colors.mutedForeground }]}>
              Loading your picks…
            </Text>
          </View>
        ) : isError ? (
          <View style={s.centered}>
            <Feather name="alert-circle" size={40} color="#e74c3c" />
            <Text style={[s.emptyTitle, { color: colors.foreground }]}>Couldn't load items</Text>
            <TouchableOpacity style={[s.retryBtn, { backgroundColor: colors.primary }]} onPress={() => refetch()}>
              <Text style={s.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : allDone ? (
          <View style={s.centered}>
            <Feather name="check-circle" size={48} color={colors.primary} />
            <Text style={[s.emptyTitle, { color: colors.foreground }]}>All done!</Text>
            <Text style={[s.emptySubtitle, { color: colors.mutedForeground }]}>
              {likedItems.length > 0
                ? `You liked ${likedItems.length} items. Check your matches!`
                : "Swipe again to explore more styles."}
            </Text>
            <TouchableOpacity
              style={[s.retryBtn, { backgroundColor: colors.primary, marginTop: 8 }]}
              onPress={() => router.replace("/(main)/wardrobe")}
            >
              <Text style={s.retryText}>My Matches</Text>
            </TouchableOpacity>
          </View>
        ) : (
          displayItems.map((item, idx) => {
            const absoluteIndex = currentIndex + (displayItems.length - 1 - idx);
            const isTop = absoluteIndex === currentIndex;
            return (
              <View key={item.id} style={[s.cardWrapper, { zIndex: idx }]}>
                <SwipeCard
                  item={item}
                  isTop={isTop}
                  isSubscribed={isSubscribed}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onBuyRequiresPaywall={() => setPaywallVisible(true)}
                />
              </View>
            );
          })
        )}
      </View>

      {/* Action buttons */}
      {!allDone && !isLoading && !isError && (
        <>
          <Text style={[s.hintText, { color: colors.mutedForeground }]}>
            Swipe right to like · left to skip
          </Text>
          <View style={[s.actions, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20) }]}>
            <TouchableOpacity
              style={[s.actionBtn, s.nopeBtn]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); handleSwipeLeft(); }}
              activeOpacity={0.7}
            >
              <Feather name="x" size={26} color="#95a5a6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, s.likeBtn, { borderColor: colors.primary, shadowColor: colors.primary }]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); handleSwipeRight(); }}
              activeOpacity={0.7}
            >
              <Feather name="heart" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </>
      )}

      <PaywallModal
        visible={paywallVisible}
        onDismiss={() => setPaywallVisible(false)}
        onSubscribe={handleSubscribe}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 10 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  appName: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  wardrobeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  wardrobeBtnText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 },
  progressTrack: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", width: 36, textAlign: "right" },
  collectionBadge: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 0.5 },
  deck: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 8,
    position: "relative",
  },
  cardWrapper: { position: "absolute", width: "100%", height: "100%" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  emptySubtitle: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 20 },
  retryBtn: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  retryText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#ffffff" },
  hintText: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", marginBottom: 4 },
  actions: { flexDirection: "row", justifyContent: "center", gap: 28, paddingTop: 12 },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: "#FFFFFF",
  },
  nopeBtn: { borderColor: "#bdc3c7", shadowColor: "#bdc3c7" },
  likeBtn: {},
});
