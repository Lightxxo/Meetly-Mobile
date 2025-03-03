import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Header } from "react-native/Libraries/NewAppScreen";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="example" options={{headerShown:false}}/>
        <Stack.Screen name="+not-found" options={{headerShown:false}} />
      </Stack>
      <StatusBar style="light" />
      </>
  );
}