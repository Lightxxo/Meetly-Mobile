import React, { useState, useRef } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window"); 

export default function Navbar() {
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH * 0.7)).current;
    const searchBarFlex = useRef(new Animated.Value(1)).current;

    // Toggle menu visibility with smooth animation
    const toggleMenu = () => {
        const newState = !menuVisible;
        setMenuVisible(newState);

        // Slide in or out animation for the menu
        Animated.timing(slideAnim, {
            toValue: newState ? 0 : SCREEN_WIDTH * 0.7, 
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();

        // Animate search bar flex (smaller when menu is open)
        Animated.timing(searchBarFlex, {
            toValue: newState ? 0.6 : 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: false,
        }).start();
    };

    // Close menu when tapping outside
    const closeMenu = () => {
        if (menuVisible) {
            toggleMenu();
        }
    };

    return (
        <SafeAreaView style={styles.navbar}>
            {menuVisible && (
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>

                <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                    <Ionicons name="close" size={moderateScale(24)} color="#111827" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                    <Text style={styles.menuText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                    <Text style={styles.menuText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={closeMenu}>
                    <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
            </Animated.View>

        
            <View style={styles.logoContainer}>
                <Text style={styles.logo}>MEETLY</Text>
            </View>

        
            <Animated.View style={[styles.searchContainer, { flex: searchBarFlex }]}>
                <Ionicons name="search-outline" size={moderateScale(14)} color="#666" />
                <Text style={styles.searchText}>Search For Event Title or Event Venue...</Text>
            </Animated.View>

            
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                <Ionicons name={menuVisible ? "close" : "menu"} size={moderateScale(24)} color="#111827" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(10), 
        backgroundColor: "#ffffff",
        position: "relative",
    },
    logoContainer: {
        backgroundColor: "#111827",
        borderRadius: moderateScale(25), 
        padding: moderateScale(8), 
        width: moderateScale(70), 
    },
    logo: {
        color: "white",
        fontSize: moderateScale(12), 
        fontWeight: "bold",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        padding: moderateScale(8), 
        borderRadius: moderateScale(15), 
        marginHorizontal: moderateScale(5), 
    },
    searchText: {
        color: "#666",
        marginLeft: moderateScale(5),
        fontSize: moderateScale(12), 
    },
    menuButton: {
        width: moderateScale(40), 
        alignItems: "flex-end", 
    },
    // Sidebar styles
    menuContainer: {
        position: "absolute",
        top: 0,
        right: 0,
        width: SCREEN_WIDTH * 0.7, 
        height: "1100%",
        backgroundColor: "#ffffff",
        paddingTop: verticalScale(60),
        paddingLeft: scale(20),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,

        elevation: 5,
        zIndex: 1, 
    },
    menuItem: {
        paddingVertical: verticalScale(12), 
    },
    menuText: {
        fontSize: moderateScale(14),
        color: "#111827",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0, 
    },
    closeButton: {
        position: "absolute",
        top: verticalScale(10),
        right: scale(10),
        zIndex: 2, 
    },
});