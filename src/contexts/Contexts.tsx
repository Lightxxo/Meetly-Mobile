import { createContext } from "react";
import { SearchDataType } from "../types/search";

export type SearchContextType = {
  searchData: SearchDataType;
  setSearchData: React.Dispatch<React.SetStateAction<SearchDataType>>;
};

export const SearchContext = createContext<SearchContextType | null>(null);
