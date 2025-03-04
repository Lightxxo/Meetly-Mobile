import React from "react";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";

export default function Loading() {
  // On Android you can set a numeric size (32); on iOS, use "small" or "large"
  const spinnerSize = Platform.OS === "android" ? 32 : "small";

  return (
    <View style={styles.container}>
      <ActivityIndicator size={spinnerSize} color="#111827" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
