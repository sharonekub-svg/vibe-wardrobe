import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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
  const { likedItems, userProfile } = useApp();

  const totalCost = likedItems.reduce((sum, i) => sum + i.price, 0);
  const budget = userProfile?.budget ?? 0;

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: insets.top + (Platform.OS === "web" ? 67 : 16),
      paddingHorizontal: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 22,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
      flex: 1,
    },
    statsRow: {
      flexDirection: "row",
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statLabel: {
      fontSize: 10,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
      marginBottom: 4,
    },
    statValue: {
      fontSize: 20,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    statAccent: {
      color: colors.primary,
    },
    list: {
      padding: 16,
    },
    row: {
      justifyContent: "space-between",
    },
    itemCard: {
      width: "48%",
      marginBottom: 16,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemImage: {
      width: "100%",
      aspectRatio: 3 / 4,
    },
    itemInfo: {
      padding: 10,
    },
    itemBrand: {
      fontSize: 9,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
      marginBottom: 2,
    },
    itemName: {
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
      color: colors.foreground,
      marginBottom: 4,
    },
    itemPrice: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      gap: 16,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: colors.card,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      color: colors.foreground,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
    },
    swipeAgainBtn: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
      marginTop: 8,
    },
    swipeAgainText: {
      fontSize: 14,
      fontFamily: "Inter_700Bold",
      color: "#0a0a0a",
    },
    budgetStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 4,
    },
    overBudget: {
      color: "#ef4444",
      fontSize: 11,
      fontFamily: "Inter_500Medium",
    },
    underBudget: {
      color: "#22c55e",
      fontSize: 11,
      fontFamily: "Inter_500Medium",
    },
  });

  return (
    <View style={s.container}>
      <View style={s.header}>
        <View style={s.headerRow}>
          <TouchableOpacity
            style={s.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={s.title}>My Wardrobe</Text>
        </View>

        <View style={s.statsRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Items Saved</Text>
            <Text style={[s.statValue, s.statAccent]}>
              {likedItems.length}
            </Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>Total Cost</Text>
            <Text style={s.statValue}>${totalCost}</Text>
            {budget > 0 && (
              <View style={s.budgetStatus}>
                <Feather
                  name={totalCost > budget ? "alert-circle" : "check-circle"}
                  size={10}
                  color={totalCost > budget ? "#ef4444" : "#22c55e"}
                />
                <Text
                  style={
                    totalCost > budget ? s.overBudget : s.underBudget
                  }
                >
                  {totalCost > budget
                    ? `$${totalCost - budget} over budget`
                    : `$${budget - totalCost} under budget`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {likedItems.length === 0 ? (
        <View style={s.emptyContainer}>
          <View style={s.emptyIcon}>
            <Feather name="grid" size={32} color={colors.mutedForeground} />
          </View>
          <Text style={s.emptyTitle}>No matches yet</Text>
          <Text style={s.emptySubtitle}>
            Swipe right on items you love to build your wardrobe.
          </Text>
          <TouchableOpacity
            style={s.swipeAgainBtn}
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
          columnWrapperStyle={s.row}
          scrollEnabled={likedItems.length > 0}
          renderItem={({ item }) => (
            <View style={s.itemCard}>
              <Image
                source={{ uri: item.imageUrl }}
                style={s.itemImage}
                resizeMode="cover"
              />
              <View style={s.itemInfo}>
                <Text style={s.itemBrand}>{item.brand}</Text>
                <Text style={s.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={s.itemPrice}>${item.price}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
