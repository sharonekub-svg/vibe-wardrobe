import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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

// Updated Stripe payment link as specified
const STRIPE_LINK = "https://buy.stripe.com/test_cNi6oH03Nege3MP20cffy01";

const FEATURES = [
  "Unlock your Personalised Shop after 30 swipes",
  "Direct H&M buy links on every card",
  "Unlimited swipe sessions",
  "Early access to new Divided drops",
];

interface PaywallModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSubscribe: () => void;
}

export function PaywallModal({ visible, onDismiss, onSubscribe }: PaywallModalProps) {
  const insets = useSafeAreaInsets();

  const handleSubscribe = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await Linking.openURL(STRIPE_LINK);
    onSubscribe();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={s.overlay}>
        {/* White/Green theme as spec requires */}
        <View style={[s.sheet, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 20) }]}>
          <View style={s.handle} />

          <View style={s.iconWrap}>
            <LinearGradient colors={["#2ecc71", "#27ae60"]} style={s.iconGradient}>
              <Feather name="star" size={26} color="#ffffff" />
            </LinearGradient>
          </View>

          <Text style={s.title}>
            Unlock <Text style={s.accent}>Pro Vibe</Text>
          </Text>
          <Text style={s.subtitle}>
            You've hit 30 swipes! Unlock your personalised H&M shop and direct buy
            links to keep shopping your style.
          </Text>

          <View style={s.featureList}>
            {FEATURES.map((f) => (
              <View key={f} style={s.featureRow}>
                <View style={s.checkCircle}>
                  <Feather name="check" size={12} color="#2ecc71" />
                </View>
                <Text style={s.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          <View style={s.priceBadge}>
            <Text style={s.priceLabel}>Pro Vibe</Text>
            <Text style={s.priceValue}>
              $4.99<Text style={s.pricePeriod}>/month</Text>
            </Text>
          </View>

          <TouchableOpacity style={s.cta} onPress={handleSubscribe} activeOpacity={0.88}>
            <LinearGradient
              colors={["#2ecc71", "#27ae60"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.ctaGradient}
            >
              <Text style={s.ctaText}>Subscribe Now</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={s.dismissBtn} onPress={onDismiss} activeOpacity={0.7}>
            <Text style={s.dismissText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(44,62,80,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d5f5e3",
    alignSelf: "center",
    marginBottom: 24,
  },
  iconWrap: { alignSelf: "center", marginBottom: 16 },
  iconGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 8,
  },
  accent: { color: "#2ecc71" },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 21,
  },
  featureList: { marginBottom: 24, gap: 12 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#e8f8f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d5f5e3",
  },
  featureText: { fontSize: 14, color: "#2c3e50", fontFamily: "Inter_400Regular", flex: 1 },
  priceBadge: {
    backgroundColor: "#f0faf4",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d5f5e3",
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 11,
    color: "#7f8c8d",
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  priceValue: { fontSize: 30, fontFamily: "Inter_700Bold", color: "#2c3e50" },
  pricePeriod: { fontSize: 14, color: "#7f8c8d", fontFamily: "Inter_400Regular" },
  cta: { borderRadius: 14, overflow: "hidden", marginBottom: 12 },
  ctaGradient: { paddingVertical: 18, alignItems: "center" },
  ctaText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#ffffff", letterSpacing: 0.5 },
  dismissBtn: { paddingVertical: 12, alignItems: "center" },
  dismissText: { fontSize: 13, color: "#bdc3c7", fontFamily: "Inter_400Regular" },
});
