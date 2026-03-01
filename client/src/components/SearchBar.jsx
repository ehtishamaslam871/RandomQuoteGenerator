import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";

function SearchBar({ value, onSearch }) {
  const [input, setInput] = useState(value);

  // Sync input when parent value changes (e.g., category clicks)
  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <div className="search">
      <form className="search__form" onSubmit={handleSubmit}>
        <input
          className="search__input"
          type="text"
          placeholder="Search for beautiful images..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="search__btn" type="submit">
          <FiSearch size={18} />
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
