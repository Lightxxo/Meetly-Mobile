import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDataType } from "../types/types";

const asyncStorageStateSync = async (
  setUserData: (userData: UserDataType) => void,
  setUserLoaded: (state: { loaded: boolean }) => void
): Promise<void> => {
  try {
    const userStorage = await AsyncStorage.getItem("user");

    if (userStorage) {
      const parsedUserStorage: UserDataType = JSON.parse(userStorage);
      setUserData(parsedUserStorage);
      setUserLoaded({ loaded: true });
      console.log("SET USERDATA VIA SYNC");
    } else {
      setUserLoaded({ loaded: true });
      console.log("NO USERDATA TO SYNC");
    }
  } catch (error) {
    console.error("Error retrieving user from AsyncStorage:", error);
  }
};

export default asyncStorageStateSync;
