import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

export default function SplashScreen() {


  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer]}>
        <Image source={require("../assets/images/1.jpg")} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Meetly</Text>
        <Text style={styles.subtitle}>
          A place to connect, collaborate, and create amazing events.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: scale(48),
  },
  imageContainer: {
    width: "100%",
    height: verticalScale(300),
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  textContainer: {
    marginTop: scale(36),
  },
  title: {
    fontSize: scale(24),
    fontWeight: "bold",
    marginBottom: scale(16),
  },
  subtitle: {
    fontSize: scale(16),
    color: "#4B5563",
  },
});
