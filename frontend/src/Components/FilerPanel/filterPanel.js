import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React from 'react';
import './filterPanel.css'

const FilterPanel = ({
  priceRange,
  setPriceRange,
  bedroomRange,
  setBedroomRange,
  bathroomRange,
  setBathroomRange,
  applyFilters,
  resetFilters
}) => {
  return (
    <div className="filter-panel">
      <h3>Filter Properties</h3>

      <div className="filter-group">
        <label>Price Range: R{priceRange[0]} - R{priceRange[1]}</label>
        <Slider
          range
          min={500}
          max={10000}
          step={100}
          value={priceRange}
          onChange={setPriceRange}
        />
      </div>

      <div className="filter-group">
        <label>Bedrooms: {bedroomRange}</label>
        <input
          type="range"
          min="0"
          max="10"
          value={bedroomRange}
          onChange={(e) => setBedroomRange(parseInt(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>Bathrooms: {bathroomRange}</label>
        <input
          type="range"
          min="0"
          max="10"
          value={bathroomRange}
          onChange={(e) => setBathroomRange(parseInt(e.target.value))}
        />
      </div>
      <div className='filter-buttons'>
        <button onClick={applyFilters} className='filter-button'>Apply Filters</button><br /><br />
        <button onClick={resetFilters} className="reset-btn">Reset Filters</button>
      </div>
    </div>
  );
};

export default FilterPanel