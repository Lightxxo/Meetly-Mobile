import React from "react";
import { Pressable, Text, Image, StyleSheet } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { scale } from "react-native-size-matters";
import replaceLocalhost from "@/utils/replaceLocalHost";
import ipaddr from "@/utils/ipaddr";

interface EventCardProps {
    event: any;
    flag?: boolean;
}

export default function EventCard({ event, flag = false }: EventCardProps) {
    const navigation = useNavigation<any>();
    event.thumbnail = replaceLocalhost(event.thumbnail, ipaddr);

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                {
                    transform: [{ scale: pressed ? 1.1 : 1 }],
                },
                pressed && styles.pressed,
            ]}
            onPress={() =>
                navigation.navigate("EventDetails", { eventId: event.eventID })
            }
        >
            <Image source={{ uri: event.thumbnail }} style={styles.thumbnail} />
            <Text style={styles.title}>{event.eventTitle}</Text>
            <Text style={styles.date}>
                📅 {new Date(event.eventDate).toLocaleDateString()}
            </Text>
            <Text style={styles.location}>📍 {event.location}</Text>
            <Text style={styles.description} numberOfLines={3}>
                {event.description}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        margin: 8,
        overflow: "hidden",
        // iOS shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Android elevation
        elevation: 2,
        paddingBottom: 16,
    },
    pressed: {
        opacity: 0.8,
    },

    thumbnail: {
        width: "100%",
        height: 192, //  height (32px * 6);
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",

        paddingLeft: scale(12),
        marginTop: 16,
        marginBottom: 12,
    },
    date: {
        color: "#4B5563",
        fontSize: 14,
        paddingHorizontal: scale(16),
    },
    location: {
        color: "#374151",
        fontSize: 14,
        paddingHorizontal: scale(16),
        marginTop: 4,
    },
    description: {
        color: "#6B7280",
        fontSize: 14,
        paddingHorizontal: scale(16),
        marginTop: 8,
    },
});
