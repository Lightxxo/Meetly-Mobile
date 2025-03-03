import { createContext } from "react";
import { SearchDataType, UserDataType, UserLoadedType } from "../types/types";

export type SearchContextType = {
  searchData: SearchDataType;
  setSearchData: React.Dispatch<React.SetStateAction<SearchDataType>>;
};



export type UserContextType = {
  userData: UserDataType,
  setUserData: React.Dispatch<React.SetStateAction<UserDataType>>;
}


export type UserLoadedContextType = {
  userLoaded: UserLoadedType;
  setUserLoaded: React.Dispatch<React.SetStateAction<UserLoadedType>>;
};

export const SearchContext = createContext<SearchContextType | null>(null);
export const UserContext = createContext<UserContextType | null>(null);
export const UserLoadedContext = createContext<UserLoadedContextType | null>(null);
