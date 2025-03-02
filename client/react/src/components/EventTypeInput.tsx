import { useState, useEffect } from 'react';

interface EventTypeInputProps {
  onAdd: (eventType: string) => void;
  existingEventTypes?: string[];
}

const EventTypeInput: React.FC<EventTypeInputProps> = ({ onAdd, existingEventTypes = [] }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedValue, setDebouncedValue] = useState('');

  // Debounce input value by 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Function to fetch suggestions based on the current input value
  const fetchSuggestions = () => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }
    fetch(`http://localhost:3000/search-event-type?name=${inputValue}`)
      .then((res) => res.json())
      .then((data: string[]) => setSuggestions(data))
      .catch(() => setSuggestions([]));
  };

  // Fetch suggestions when the debounced value changes
  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSuggestions([]);
      return;
    }
    fetchSuggestions();
  }, [debouncedValue]);

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !existingEventTypes.includes(trimmed)) {
      onAdd(trimmed);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAdd(suggestion);
    setInputValue('');
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="relative w-full flex flex-col">
      <div className="flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim()) {
              fetchSuggestions();
            }
          }}
          placeholder="Search event type"
          className="p-3 w-full border border-gray-300 rounded-l-lg shadow-sm"
          // Use a short timeout so that onMouseDown of suggestions can fire before blur
          onBlur={() => setTimeout(() => setSuggestions([]), 100)}
        />
        <button
          type="button" // Prevents form submission
          onClick={handleAdd}
          className="px-4 py-2 bg-gray-600 text-white rounded-r-lg transition hover:bg-gray-700"
        >
          Add
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-full mt-1 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTypeInput;
