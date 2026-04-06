import { FashionItem } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ROTATION_MULTIPLIER = 8;

interface SwipeCardProps {
  item: FashionItem;
  isTop: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function SwipeCard({
  item,
  isTop,
  onSwipeLeft,
  onSwipeRight,
}: SwipeCardProps) {
  const colors = useColors();
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
    outputRange: [
      `-${ROTATION_MULTIPLIER}deg`,
      "0deg",
      `${ROTATION_MULTIPLIER}deg`,
    ],
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
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
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
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
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
    ? {
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate },
        ],
        opacity,
      }
    : {};

  const s = StyleSheet.create({
    card: {
      position: "absolute",
      width: "100%",
      height: "100%",
      borderRadius: 20,
      overflow: "hidden",
      backgroundColor: colors.card,
    },
    image: {
      width: "100%",
      height: "72%",
    },
    gradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "50%",
      justifyContent: "flex-end",
      padding: 20,
    },
    infoOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: "rgba(10,10,10,0.85)",
    },
    brand: {
      fontSize: 11,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 4,
    },
    name: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      marginBottom: 4,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    price: {
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      color: "#ffffff",
    },
    category: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    badge: {
      position: "absolute",
      top: 24,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 3,
    },
    likeBadge: {
      left: 20,
      borderColor: "#00BFFF",
      backgroundColor: "rgba(0,191,255,0.15)",
    },
    nopeBadge: {
      right: 20,
      borderColor: "#ef4444",
      backgroundColor: "rgba(239,68,68,0.15)",
    },
    badgeText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      letterSpacing: 1,
    },
    likeText: {
      color: "#00BFFF",
    },
    nopeText: {
      color: "#ef4444",
    },
  });

  return (
    <Animated.View
      style={[s.card, cardStyle]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={s.image}
        resizeMode="cover"
      />
      <View style={s.infoOverlay}>
        <Text style={s.brand}>{item.brand}</Text>
        <View style={s.row}>
          <Text style={s.name}>{item.name}</Text>
        </View>
        <View style={s.row}>
          <Text style={s.price}>${item.price}</Text>
          <Text style={s.category}>{item.category}</Text>
        </View>
      </View>

      {isTop && (
        <>
          <Animated.View
            style={[s.badge, s.likeBadge, { opacity: likeOpacity }]}
          >
            <Text style={[s.badgeText, s.likeText]}>VIBE</Text>
          </Animated.View>
          <Animated.View
            style={[s.badge, s.nopeBadge, { opacity: nopeOpacity }]}
          >
            <Text style={[s.badgeText, s.nopeText]}>SKIP</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
}
