import React, { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scale, verticalScale } from "react-native-size-matters";
import { UserContext, UserLoadedContext } from "../contexts/contexts";
import Loading from "./Loading";
import EventCard from "./EventCard";
import SplashScreen from "./SplashScreen";
import ipaddr from "@/utils/ipaddr";

const ListHeader = () => (
  <View style={styles.headerContainer}>
    <SplashScreen />
    <Text style={styles.header}>Upcoming Events</Text>
  </View>
);

export default function HomeEventListSection() {
  const userContext = useContext(UserContext);
  const userLoadedContext = useContext(UserLoadedContext);
  const userLoaded = userLoadedContext ? userLoadedContext.userLoaded : null;

  if (!userContext)
    throw new Error("Must be used within a UserContext.Provider");

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const limit = 10;

  // Check for stored user in AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      if (user) setUserExists(true);
    });
  }, []);

  // Fetch events function
  const fetchEvents = useCallback(async () => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://${ipaddr}:3000/events?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      setEvents((prevEvents) => [...prevEvents, ...data.events]);
      // If fewer than the limit were returned, there's no more data
      setHasMore(data.events.length === limit);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore]);

  // Fetch events when offset changes
  useEffect(() => {
    fetchEvents();
  }, [offset]);

  // If a user exists but global context isn't loaded, show the loader
  if (userExists && userLoaded && !userLoaded.loaded) {
    return <Loading />;
  }

  // Render each event using the placeholder EventCard
  const renderItem = ({ item }: { item: any }) => <EventCard event={item} />;

  // When end is reached, update the offset to fetch more events
  const handleEndReached = () => {
    if (!loading && hasMore) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <Loading /> : null}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: scale(16), // approximates px-4
    paddingVertical: verticalScale(24), // approximates py-6
  },
  headerContainer: {
    marginBottom: verticalScale(36), // space below the header section
  },
  header: {
    fontSize: scale(36), // adjust as needed
    fontWeight: "bold",
    marginTop: verticalScale(105),
  },
  listContainer: {
    // Additional styling if needed.
  },
});
