import React from "react";

const SearchBar = ({ onSearch, initialValue }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const city = e.target.elements.cityInput.value.trim();
    if (city) onSearch(city);
  };

  return (
    <section className="search-section">
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          name="cityInput"
          placeholder="Search location eg: Ranchi"
          defaultValue={initialValue}
          autoComplete="off"
          aria-label="City Name Search"
        />
        <button type="submit">Search</button>
      </form>
    </section>
  );
};

export default SearchBar;
