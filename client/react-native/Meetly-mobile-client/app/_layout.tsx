import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    SearchContext,
    UserContext,
    UserLoadedContext,
} from "../contexts/contexts"; // adjust the import path
import { SearchDataType, UserDataType, UserLoadedType } from "../types/types";
import asyncStorageStateSync from "@/utils/asyncStorageStateStync";
import Navbar from "@/components/Navbar";

export default function RootLayout() {
    const [searchData, setSearchData] = useState<SearchDataType>({
        text: "",
        eventTypes: [],
        startTimestamp: "",
        endTimestamp: "",
        results: [],
        loading: false,
    });

    const [userData, setUserData] = useState<UserDataType>({
        token: "",
        userID: "",
        username: "",
        email: "",
    });

    const [userLoaded, setUserLoaded] = useState<UserLoadedType>({
        loaded: false,
    });

    useEffect(() => {
        asyncStorageStateSync(setUserData, setUserLoaded);
    }, []);

    useEffect(() => {
        console.log(userLoaded);
    }, [userLoaded]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            <SearchContext.Provider value={{ searchData, setSearchData }}>
                <UserLoadedContext.Provider value={{ userLoaded, setUserLoaded }}>
                    <Stack>
                        <Stack.Screen name="index" options={{ header:()=>{return <Navbar></Navbar>} }} />
                        <Stack.Screen name="example" options={{ headerBackVisible: false }} />
                        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                        <Stack.Screen name="EventDetails" />
                    </Stack>
                    <StatusBar style="light" />
                </UserLoadedContext.Provider>
            </SearchContext.Provider>
        </UserContext.Provider>
    );
}
