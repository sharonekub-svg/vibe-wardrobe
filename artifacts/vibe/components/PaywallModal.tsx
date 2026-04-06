import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import React from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STRIPE_LINK = "https://buy.stripe.com/test_4gM5kD03N0poert7kwffy00";

const FEATURES = [
  "Unlimited swipe sessions",
  "See your full wardrobe matches",
  "Exclusive budget optimization tips",
  "Early access to new drops",
];

interface PaywallModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubscribe: () => void;
}

export function PaywallModal({
  visible,
  onDismiss,
  onSubscribe,
}: PaywallModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Linking.openURL(STRIPE_LINK);
    onSubscribe();
  };

  const s = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: "#141414",
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 28,
      paddingTop: 28,
      paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20),
      borderTopWidth: 1,
      borderTopColor: "rgba(0,191,255,0.2)",
    },
    glowBar: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.primary,
      alignSelf: "center",
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
    },
    lockIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "rgba(0,191,255,0.12)",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 16,
      borderWidth: 1,
      borderColor: "rgba(0,191,255,0.3)",
    },
    title: {
      fontSize: 26,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      marginBottom: 28,
      lineHeight: 20,
    },
    highlight: { color: colors.primary },
    featureList: { marginBottom: 28, gap: 12 },
    featureRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "rgba(0,191,255,0.15)",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(0,191,255,0.4)",
    },
    featureText: {
      fontSize: 14,
      color: "#e5e5e5",
      fontFamily: "Inter_400Regular",
    },
    priceBadge: {
      backgroundColor: "rgba(0,191,255,0.08)",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(0,191,255,0.2)",
      paddingVertical: 16,
      alignItems: "center",
      marginBottom: 16,
    },
    priceLabel: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    priceValue: {
      fontSize: 32,
      fontFamily: "Inter_700Bold",
      color: "#ffffff",
    },
    pricePeriod: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
    cta: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: "center",
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
    },
    ctaText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#0a0a0a",
      letterSpacing: 0.5,
    },
    dismissBtn: { paddingVertical: 12, alignItems: "center" },
    dismissText: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.glowBar} />
          <View style={s.lockIcon}>
            <Feather name="lock" size={24} color={colors.primary} />
          </View>
          <Text style={s.title}>
            Subscribe to <Text style={s.highlight}>Vibe Pro</Text>
          </Text>
          <Text style={s.subtitle}>
            Your timer is up. Unlock your full wardrobe and keep discovering
            premium styles.
          </Text>
          <View style={s.featureList}>
            {FEATURES.map((f) => (
              <View key={f} style={s.featureRow}>
                <View style={s.checkCircle}>
                  <Feather name="check" size={12} color={colors.primary} />
                </View>
                <Text style={s.featureText}>{f}</Text>
              </View>
            ))}
          </View>
          <View style={s.priceBadge}>
            <Text style={s.priceLabel}>Vibe Pro</Text>
            <Text style={s.priceValue}>
              ₪29.90<Text style={s.pricePeriod}>/month</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={s.cta}
            onPress={handleSubscribe}
            activeOpacity={0.85}
          >
            <Text style={s.ctaText}>Subscribe Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.dismissBtn}
            onPress={onDismiss}
            activeOpacity={0.7}
          >
            <Text style={s.dismissText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
