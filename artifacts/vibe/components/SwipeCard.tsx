import { FashionItem } from "@/context/AppContext";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ROTATION_MULTIPLIER = 8;

interface SwipeCardProps {
  item: FashionItem;
  isTop: boolean;
  isSubscribed?: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onBuyRequiresPaywall?: () => void;
}

export function SwipeCard({
  item,
  isTop,
  isSubscribed,
  onSwipeLeft,
  onSwipeRight,
  onBuyRequiresPaywall,
}: SwipeCardProps) {
  const position = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD / 2],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD / 2, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [`-${ROTATION_MULTIPLIER}deg`, "0deg", `${ROTATION_MULTIPLIER}deg`],
    extrapolate: "clamp",
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: SCREEN_WIDTH * 1.5, y: gesture.dy },
              duration: 280,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
          ]).start(() => {
            onSwipeRight();
            position.setValue({ x: 0, y: 0 });
            opacity.setValue(1);
          });
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Animated.parallel([
            Animated.timing(position, {
              toValue: { x: -SCREEN_WIDTH * 1.5, y: gesture.dy },
              duration: 280,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
          ]).start(() => {
            onSwipeLeft();
            position.setValue({ x: 0, y: 0 });
            opacity.setValue(1);
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            friction: 6,
          }).start();
        }
      },
    })
  ).current;

  const cardStyle = isTop
    ? { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }], opacity }
    : {};

  const handleBuy = () => {
    if (!isSubscribed) {
      onBuyRequiresPaywall?.();
      return;
    }
    Linking.openURL(item.buyUrl);
  };

  return (
    <Animated.View
      style={[s.card, cardStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      {/* Image is product-specific — always matches the text below */}
      <Image source={{ uri: item.imageUrl }} style={s.image} resizeMode="cover" />

      <View style={s.infoOverlay}>
        <View style={s.row}>
          <View style={s.nameBlock}>
            <Text style={s.name} numberOfLines={2}>{item.name}</Text>
            <Text style={s.price}>{item.formattedPrice}</Text>
          </View>
          <TouchableOpacity style={s.buyBtn} onPress={handleBuy} activeOpacity={0.85}>
            <Feather name="shopping-bag" size={12} color="#ffffff" />
            <Text style={s.buyText}>Buy</Text>
          </TouchableOpacity>
        </View>
        <Text style={s.category}>{item.category}</Text>
        {item.tags && item.tags.length > 0 && (
          <View style={s.tags}>
            {item.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={s.tagChip}>
                <Text style={s.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* LIKE badge: Emerald Green | NOPE badge: Gray — exact spec colours */}
      {isTop && (
        <>
          <Animated.View style={[s.badge, s.likeBadge, { opacity: likeOpacity }]}>
            <Text style={[s.badgeText, s.likeText]}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[s.badge, s.nopeBadge, { opacity: nopeOpacity }]}>
            <Text style={[s.badgeText, s.nopeText]}>NOPE</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
}

const s = StyleSheet.create({
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#f8fffe",
    ...Platform.select({
      ios: { shadowColor: "#2c3e50", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16 },
      android: { elevation: 8 },
      web: { boxShadow: "0 8px 32px rgba(44,62,80,0.12)" } as {},
    }),
  },
  image: { width: "100%", height: "68%" },
  infoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  nameBlock: { flex: 1, marginRight: 10 },
  name: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#2c3e50", marginBottom: 2 },
  price: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#2ecc71" },
  buyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#2ecc71",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buyText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#ffffff" },
  category: { fontSize: 11, color: "#7f8c8d", fontFamily: "Inter_400Regular", marginBottom: 8 },
  tags: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tagChip: { backgroundColor: "#e8f8f0", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 10, color: "#2ecc71", fontFamily: "Inter_500Medium" },
  badge: {
    position: "absolute",
    top: 28,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
  },
  likeBadge: {
    left: 20,
    borderColor: "#2ecc71",
    backgroundColor: "rgba(46,204,113,0.12)",
    transform: [{ rotate: "-15deg" }],
  },
  nopeBadge: {
    right: 20,
    borderColor: "#95a5a6",
    backgroundColor: "rgba(149,165,166,0.12)",
    transform: [{ rotate: "15deg" }],
  },
  badgeText: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: 2 },
  likeText: { color: "#2ecc71" },
  nopeText: { color: "#95a5a6" },
});
