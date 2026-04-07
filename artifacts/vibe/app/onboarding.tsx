import { useApp } from "@/context/AppContext";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setUserProfile, resetSession } = useApp();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Please enter your name";
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 99)
      e.age = "Enter a valid age (10–99)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStart = async () => {
    if (!validate()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setUserProfile({ name: name.trim(), age: parseInt(age) });
    // Clear previous session so every login gets a fresh shuffled deck
    resetSession();
    router.replace("/(main)/swipe");
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.inner, { paddingTop: insets.top + (Platform.OS === "web" ? 60 : 48) }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.badge}>
          <Text style={s.badgeText}>H&M Divided · Women's</Text>
        </View>

        <Text style={s.headline}>
          Find Your{"\n"}<Text style={s.accent}>Vibe</Text> Style
        </Text>
        <Text style={s.subheadline}>
          Swipe through curated women's fashion personalised to your age. Like
          what you love — skip the rest.
        </Text>

        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Your Name</Text>
          <TextInput
            style={[s.input, focusedField === "name" && s.inputFocused, errors.name && s.inputError]}
            placeholder="e.g. Sarah"
            placeholderTextColor="#bdc3c7"
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            autoCapitalize="words"
            returnKeyType="next"
          />
          {errors.name ? <Text style={s.errorText}>{errors.name}</Text> : <View style={{ height: 20 }} />}
        </View>

        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Age</Text>
          <TextInput
            style={[s.input, focusedField === "age" && s.inputFocused, errors.age && s.inputError]}
            placeholder="e.g. 16"
            placeholderTextColor="#bdc3c7"
            value={age}
            onChangeText={setAge}
            onFocus={() => setFocusedField("age")}
            onBlur={() => setFocusedField(null)}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />
          {errors.age ? <Text style={s.errorText}>{errors.age}</Text> : <View style={{ height: 20 }} />}
        </View>

        <TouchableOpacity style={s.cta} onPress={handleStart} activeOpacity={0.88}>
          <View style={s.ctaGradient}>
            <Text style={s.ctaText}>Get Started</Text>
          </View>
        </TouchableOpacity>

        <Text style={s.hint}>Under 20? You'll get the exclusive H&M Divided collection</Text>

        <View style={s.divider} />

        <View style={s.featuresRow}>
          {["Personalised\nPicks", "30-Swipe\nShop", "Pro Vibe\nUnlock"].map((f) => (
            <View key={f} style={s.featureItem}>
              <View style={s.featureDot} />
              <Text style={s.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flex: 1 },
  inner: { paddingHorizontal: 28, paddingBottom: 40 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e8f8f0",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#2ecc71",
    fontFamily: "Inter_600SemiBold",
  },
  headline: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    color: "#2c3e50",
    lineHeight: 46,
    marginBottom: 10,
  },
  accent: { color: "#2ecc71" },
  subheadline: {
    fontSize: 15,
    color: "#7f8c8d",
    fontFamily: "Inter_400Regular",
    lineHeight: 23,
    marginBottom: 44,
  },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#7f8c8d",
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8fffe",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#d5f5e3",
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
    color: "#2c3e50",
    fontFamily: "Inter_400Regular",
    marginBottom: 6,
  },
  inputFocused: { borderColor: "#2ecc71", backgroundColor: "#f0fdf8" },
  inputError: { borderColor: "#e74c3c" },
  errorText: { fontSize: 12, color: "#e74c3c", fontFamily: "Inter_400Regular", marginBottom: 20 },
  fieldGroup: { marginBottom: 4 },
  cta: { marginTop: 36, borderRadius: 16, overflow: "hidden" },
  ctaGradient: { paddingVertical: 18, alignItems: "center", backgroundColor: "#2ecc71", borderRadius: 16 },
  ctaText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#ffffff", letterSpacing: 0.5 },
  hint: { fontSize: 12, color: "#bdc3c7", fontFamily: "Inter_400Regular", textAlign: "center", marginTop: 14 },
  divider: { height: 1, backgroundColor: "#d5f5e3", marginVertical: 32 },
  featuresRow: { flexDirection: "row", justifyContent: "space-around" },
  featureItem: { alignItems: "center", gap: 8 },
  featureDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2ecc71" },
  featureText: { fontSize: 12, color: "#7f8c8d", fontFamily: "Inter_400Regular", textAlign: "center" },
});
