import React from 'react';
import { View, StyleSheet } from 'react-native';
import HomeEventListSection from '@/components/HomeEventListSection';

export default function Index() {
  return (
    <View style={styles.container}>
      <HomeEventListSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
