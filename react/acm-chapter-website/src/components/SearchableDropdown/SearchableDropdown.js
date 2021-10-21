import React from "react";

const SearchableDropdown = ({ data, inputPlaceholder, inputName }) => {
  function onSelect(major) {
    this.selectedMajor = major;
  }

  function filter(event) {
    if (event.target.value === "") {
      return (this.filteredYears = []);
    }
    this.filteredYears = this.seriesYears?.filter((series) => {
      return series.name
        .toLowerCase()
        .startsWith(event.target.value.toLowerCase());
    });
  }
  return (
    <div class="search-input">
      <input
        class="input"
        id="txt-input"
        type="text"
        placeholder={inputPlaceholder}
        name={inputName}
        required
        onChange={filter}
      />
      <div class="autocom-box">
        {data.map((item) => {
          <li>{{ item }}</li>;
        })}
      </div>
      <div class="icon">
        <i class="fas fa-search"></i>
      </div>
    </div>
  );
};

export default SearchableDropdown;
