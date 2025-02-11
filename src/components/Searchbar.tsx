import React, { useContext } from "react";
import { SearchContext} from "../contexts/Contexts";
import { useNavigate } from "react-router-dom";


const SearchBar: React.FC = () => {
  
  const context = useContext(SearchContext);

  
  if (!context) {
    throw new Error("SearchBar must be used within a SearchContext.Provider");
  }

  const { searchData, setSearchData } = context;
  const navigate = useNavigate();
  const handleSearchBarClick = () =>{
    navigate('/search');
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center max-w-4xl mx-auto " onClick={handleSearchBarClick}>
      <textarea
        name="text"
        value={searchData.text}
        onChange={handleChange}
        placeholder="🔍  Search For Anything..."
        className="p-2 w-lg h-12 border border-gray-300 shadow-sm rounded-full mr-[-1px] py-[10px] resize-none"
      />

    </div>
  );
};

export default SearchBar;
