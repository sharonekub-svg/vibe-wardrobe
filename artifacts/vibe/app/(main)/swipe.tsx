import { PaywallModal } from "@/components/PaywallModal";
import { SwipeCard } from "@/components/SwipeCard";
import { useApp } from "@/context/AppContext";
import { FashionItem } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useGetFashionItems } from "@workspace/api-client-react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SESSION_DURATION = 30;
const PAYWALL_TRIGGER = 20;
const MAX_SWIPES = 30;

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
    resetSession,
  } = useApp();

  const budget = userProfile?.budget;

  const { data, isLoading, isError, refetch } = useGetFashionItems(
    budget !== undefined ? { budget } : {},
    { query: { staleTime: 5 * 60 * 1000 } }
  );

  const items: FashionItem[] = (data?.items ?? []).map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    formattedPrice: i.formattedPrice,
    imageUrl: i.imageUrl,
    category: i.category,
    buyUrl: i.buyUrl,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerAnimation = useRef(new Animated.Value(1)).current;
  const timerStarted = useRef(false);

  useEffect(() => {
    resetSession();
  }, []);

  useEffect(() => {
    if (!isLoading && items.length > 0 && !timerStarted.current) {
      timerStarted.current = true;
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, items.length]);

  const triggerPaywall = useCallback(() => {
    if (!isSubscribed) setPaywallVisible(true);
  }, [isSubscribed]);

  const startTimer = () => {
    let remaining = SESSION_DURATION;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      Animated.timing(timerAnimation, {
        toValue: remaining / SESSION_DURATION,
        duration: 900,
        useNativeDriver: false,
      }).start();

      if (remaining === PAYWALL_TRIGGER) triggerPaywall();
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setSessionEnded(true);
        if (!isSubscribed) setPaywallVisible(true);
        else router.replace("/(main)/wardrobe");
      }
    }, 1000);
  };

  const handleSwipeLeft = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setSwipeCount((c) => {
      const next = c + 1;
      if (next >= MAX_SWIPES) {
        if (timerRef.current) clearInterval(timerRef.current);
        setSessionEnded(true);
        setTimeout(() => router.replace("/(main)/wardrobe"), 400);
      }
      return next;
    });
  }, []);

  const handleSwipeRight = useCallback(() => {
    const item = items[currentIndex];
    if (item) addLikedItem(item);
    setCurrentIndex((i) => i + 1);
    setSwipeCount((c) => {
      const next = c + 1;
      if (next >= MAX_SWIPES) {
        if (timerRef.current) clearInterval(timerRef.current);
        setSessionEnded(true);
        setTimeout(() => router.replace("/(main)/wardrobe"), 400);
      }
      return next;
    });
  }, [currentIndex, items]);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setPaywallVisible(false);
    if (sessionEnded) router.replace("/(main)/wardrobe");
  };

  const timerColor = timerAnimation.interpolate({
    inputRange: [0, 0.33, 1],
    outputRange: ["#ef4444", "#f59e0b", "#00BFFF"],
  });

  const timerWidth = timerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const displayItems = items
    .slice(currentIndex, currentIndex + 3)
    .reverse();
  const allDone =
    currentIndex >= items.length || swipeCount >= MAX_SWIPES;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 12),
      paddingHorizontal: 24,
      paddingBottom: 12,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    appName: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      letterSpacing: -0.5,
    },
    appAccent: { color: colors.primary },
    wardrobeBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    wardrobeBtnText: {
      fontSize: 12,
      color: colors.foreground,
      fontFamily: "Inter_500Medium",
    },
    timerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 4,
    },
    timerLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
      width: 48,
    },
    timerTrack: {
      flex: 1,
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      overflow: "hidden",
    },
    timerFill: { height: "100%", borderRadius: 2 },
    timerCountdown: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      width: 28,
      textAlign: "right",
    },
    swipeCounter: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      marginTop: 2,
    },
    budgetTag: {
      alignSelf: "center",
      backgroundColor: "rgba(0,191,255,0.08)",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: "rgba(0,191,255,0.2)",
      marginBottom: 8,
    },
    budgetTagText: {
      fontSize: 11,
      color: colors.primary,
      fontFamily: "Inter_500Medium",
    },
    deck: {
      flex: 1,
      marginHorizontal: 24,
      marginVertical: 8,
      position: "relative",
    },
    cardWrapper: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    actions: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 24,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20),
      paddingTop: 12,
    },
    actionBtn: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    skipBtn: {
      backgroundColor: "#1e1e1e",
      borderWidth: 1,
      borderColor: "#ef4444",
      shadowColor: "#ef4444",
    },
    likeBtn: {
      backgroundColor: "#1e1e1e",
      borderWidth: 1,
      borderColor: "#00BFFF",
      shadowColor: "#00BFFF",
    },
    hintText: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      marginBottom: 4,
    },
    retryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    retryText: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
      color: "#0a0a0a",
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.appName}>
            Vi<Text style={s.appAccent}>be</Text>
          </Text>
          <TouchableOpacity
            style={s.wardrobeBtn}
            onPress={() => router.push("/(main)/wardrobe")}
            activeOpacity={0.7}
          >
            <Feather name="grid" size={14} color={colors.primary} />
            <Text style={s.wardrobeBtnText}>{likedItems.length} saved</Text>
          </TouchableOpacity>
        </View>

        <View style={s.timerRow}>
          <Text style={s.timerLabel}>
            {timeLeft > 0 ? "Time" : "Done"}
          </Text>
          <View style={s.timerTrack}>
            <Animated.View
              style={[
                s.timerFill,
                { width: timerWidth, backgroundColor: timerColor },
              ]}
            />
          </View>
          <Animated.Text style={[s.timerCountdown, { color: timerColor }]}>
            {Math.max(0, timeLeft)}s
          </Animated.Text>
        </View>

        <Text style={s.swipeCounter}>
          {swipeCount}/{MAX_SWIPES} swipes •{" "}
          {isLoading ? "loading..." : `${items.length} items in budget`}
        </Text>
      </View>

      <View style={s.budgetTag}>
        <Text style={s.budgetTagText}>
          Budget: {budget !== undefined ? `$${budget}` : "Any"}
        </Text>
      </View>

      <View style={s.deck}>
        {isLoading ? (
          <View style={s.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={s.emptySubtitle}>Loading your picks...</Text>
          </View>
        ) : isError ? (
          <View style={s.centered}>
            <Feather name="alert-circle" size={40} color="#ef4444" />
            <Text style={s.emptyTitle}>Couldn't load items</Text>
            <TouchableOpacity style={s.retryBtn} onPress={() => refetch()}>
              <Text style={s.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : allDone ? (
          <View style={s.centered}>
            <Feather name="check-circle" size={48} color={colors.primary} />
            <Text style={s.emptyTitle}>All done!</Text>
            <Text style={s.emptySubtitle}>
              Check your wardrobe to see your matches.
            </Text>
            <TouchableOpacity
              style={[s.retryBtn, { marginTop: 8 }]}
              onPress={() => router.replace("/(main)/wardrobe")}
            >
              <Text style={s.retryText}>View Wardrobe</Text>
            </TouchableOpacity>
          </View>
        ) : (
          displayItems.map((item, idx) => {
            const absoluteIndex =
              currentIndex + (displayItems.length - 1 - idx);
            const isTop = absoluteIndex === currentIndex;
            return (
              <View key={item.id} style={[s.cardWrapper, { zIndex: idx }]}>
                <SwipeCard
                  item={item}
                  isTop={isTop}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              </View>
            );
          })
        )}
      </View>

      {!allDone && !isLoading && !isError && (
        <>
          <Text style={s.hintText}>Swipe right to save • left to skip</Text>
          <View style={s.actions}>
            <TouchableOpacity
              style={[s.actionBtn, s.skipBtn]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleSwipeLeft();
              }}
              activeOpacity={0.7}
            >
              <Feather name="x" size={26} color="#ef4444" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, s.likeBtn]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleSwipeRight();
              }}
              activeOpacity={0.7}
            >
              <Feather name="heart" size={24} color="#00BFFF" />
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
