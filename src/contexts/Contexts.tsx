import { createContext } from "react";
import { SearchDataType, UserDataType } from "../types/search";

export type SearchContextType = {
  searchData: SearchDataType;
  setSearchData: React.Dispatch<React.SetStateAction<SearchDataType>>;
};



export type UserContextType = {
  userData: UserDataType,
  setUserData: React.Dispatch<React.SetStateAction<UserDataType>>;
}
export const SearchContext = createContext<SearchContextType | null>(null);
export const UserContext = createContext<UserContextType | null>(null);
