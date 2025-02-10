import React, { useState } from "react";



type FormData = {
  text: string;
  location: string;
  timestamp: Date| null;
};

const SearchBar: React.FC = () => {

  const [formData, setFormData] = useState<FormData>({
    text: "",
    location: "",
    timestamp: null, // Initial value is null for date
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <div className="flex items-center max-w-4xl mx-auto ">
      <textarea
        name="text"
        value={formData.text}
        onChange={handleChange}
        placeholder="🔍  Search For Anything..."
        className="p-2 w-lg h-12 border border-gray-300 shadow-sm rounded-full mr-[-1px] py-[10px] resize-none"
      />
    </div>
  );
};

export default SearchBar;
