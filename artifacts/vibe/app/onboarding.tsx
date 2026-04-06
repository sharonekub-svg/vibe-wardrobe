import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
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
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setUserProfile } = useApp();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 16 || ageNum > 99)
      e.age = "Enter a valid age (16–99)";
    const budgetNum = parseFloat(budget);
    if (!budget || isNaN(budgetNum) || budgetNum < 10)
      e.budget = "Enter a budget of at least $10";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStart = async () => {
    if (!validate()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setUserProfile({
      name: name.trim(),
      age: parseInt(age),
      budget: parseFloat(budget),
    });
    router.replace("/(main)/swipe");
  };

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    inner: {
      paddingHorizontal: 28,
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 40),
      paddingBottom: insets.bottom + 40,
    },
    tagline: {
      fontSize: 13,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 12,
    },
    headline: {
      fontSize: 36,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      lineHeight: 44,
      marginBottom: 8,
    },
    subheadline: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 22,
      marginBottom: 48,
    },
    neonAccent: {
      color: colors.primary,
    },
    fieldLabel: {
      fontSize: 12,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      marginBottom: 6,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    inputError: {
      borderColor: colors.destructive,
    },
    errorText: {
      fontSize: 12,
      color: colors.destructive,
      fontFamily: "Inter_400Regular",
      marginBottom: 20,
    },
    fieldGroup: {
      marginBottom: 4,
    },
    cta: {
      marginTop: 36,
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: "center",
    },
    ctaText: {
      fontSize: 16,
      fontFamily: "Inter_700Bold",
      color: "#0a0a0a",
      letterSpacing: 0.5,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 32,
    },
    featuresRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    featureItem: {
      alignItems: "center",
      gap: 6,
    },
    featureDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    featureText: {
      fontSize: 11,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.tagline}>Your Style. Curated.</Text>
        <Text style={s.headline}>
          Discover{"\n"}Your{" "}
          <Text style={s.neonAccent}>Vibe</Text>
        </Text>
        <Text style={s.subheadline}>
          Swipe through premium men's fashion picks tailored exactly to your
          budget and taste.
        </Text>

        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Your Name</Text>
          <TextInput
            style={[
              s.input,
              focusedField === "name" && s.inputFocused,
              errors.name && s.inputError,
            ]}
            placeholder="e.g. James"
            placeholderTextColor={colors.mutedForeground}
            value={name}
            onChangeText={setName}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            autoCapitalize="words"
            returnKeyType="next"
          />
          {errors.name ? (
            <Text style={s.errorText}>{errors.name}</Text>
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>

        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Age</Text>
          <TextInput
            style={[
              s.input,
              focusedField === "age" && s.inputFocused,
              errors.age && s.inputError,
            ]}
            placeholder="e.g. 28"
            placeholderTextColor={colors.mutedForeground}
            value={age}
            onChangeText={setAge}
            onFocus={() => setFocusedField("age")}
            onBlur={() => setFocusedField(null)}
            keyboardType="number-pad"
            returnKeyType="next"
          />
          {errors.age ? (
            <Text style={s.errorText}>{errors.age}</Text>
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>

        <View style={s.fieldGroup}>
          <Text style={s.fieldLabel}>Monthly Budget (USD)</Text>
          <TextInput
            style={[
              s.input,
              focusedField === "budget" && s.inputFocused,
              errors.budget && s.inputError,
            ]}
            placeholder="e.g. 200"
            placeholderTextColor={colors.mutedForeground}
            value={budget}
            onChangeText={setBudget}
            onFocus={() => setFocusedField("budget")}
            onBlur={() => setFocusedField(null)}
            keyboardType="decimal-pad"
            returnKeyType="done"
            onSubmitEditing={handleStart}
          />
          {errors.budget ? (
            <Text style={s.errorText}>{errors.budget}</Text>
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>

        <TouchableOpacity
          style={s.cta}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={s.ctaText}>Start Swiping</Text>
        </TouchableOpacity>

        <View style={s.divider} />

        <View style={s.featuresRow}>
          {["Personalized", "Budget-Smart", "Premium Picks"].map((f) => (
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
