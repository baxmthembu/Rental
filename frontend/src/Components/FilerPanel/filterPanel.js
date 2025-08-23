import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React from 'react';
import './filterPanel.css'

/*const FilterPanel = ({
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
};*/

/*const FilterPanel = ({
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Filter Properties</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Price Range Dropdown *}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Price Range</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
            value={priceRange[1]} // Using the upper bound as the selected value
            onChange={(e) => {
              const selectedPrice = parseInt(e.target.value);
              // Set price range based on selection
              if (selectedPrice === 1000) setPriceRange([500, 1000]);
              else if (selectedPrice === 2500) setPriceRange([1000, 2500]);
              else if (selectedPrice === 5000) setPriceRange([2500, 5000]);
              else if (selectedPrice === 10000) setPriceRange([5000, 10000]);
              else setPriceRange([500, 10000]); // Any Price
            }}
          >
            <option value="10000">Any Price</option>
            <option value="1000">R500 - R1,000</option>
            <option value="2500">R1,000 - R2,500</option>
            <option value="5000">R2,500 - R5,000</option>
            <option value="10000">R5,000+</option>
          </select>
        </div>

        {/* Bedrooms Dropdown *}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Bedrooms</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
            value={bedroomRange}
            onChange={(e) => setBedroomRange(parseInt(e.target.value))}
          >
            <option value="0">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms Dropdown *}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Bathrooms</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
            value={bathroomRange}
            onChange={(e) => setBathroomRange(parseInt(e.target.value))}
          >
            <option value="0">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Action Buttons *}
        <div className="flex items-end space-x-2">
          <button 
            onClick={applyFilters}
            className="w-full bg-sa-gold text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            Apply Filters
          </button>
          <button 
            onClick={resetFilters}
            className="w-full border border-sa-green text-sa-green font-bold py-2 px-4 rounded-md hover:bg-sa-green hover:text-white transition duration-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};*/

const FilterPanel = ({
  priceRange,
  setPriceRange,
  bedroomRange,
  setBedroomRange,
  bathroomRange,
  setBathroomRange,
  propertyType,
  setPropertyType,
  applyFilters,
  resetFilters
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Filter Properties</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Price Range Dropdown */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Price Range</label>
          <select 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
            value={priceRange[1]} // Using the upper bound as the selected value
            onChange={(e) => {
              const selectedPrice = parseInt(e.target.value);
              // Set price range based on selection
              if (selectedPrice === 1000) setPriceRange([500, 1000]);
              else if (selectedPrice === 2500) setPriceRange([1000, 2500]);
              else if (selectedPrice === 5000) setPriceRange([2500, 5000]);
              else if (selectedPrice === 10000) setPriceRange([5000, 10000]);
              else setPriceRange([500, 10000]); // Any Price
            }}
          >
            <option value="10000">Any Price</option>
            <option value="1000">R500 - R1,000</option>
            <option value="2500">R1,000 - R2,500</option>
            <option value="5000">R2,500 - R5,000</option>
            <option value="10000">R5,000+</option>
          </select>
        </div>

        {/* Bedrooms Dropdown */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Bedrooms</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
            value={bedroomRange}
            onChange={(e) => setBedroomRange(parseInt(e.target.value))}
          >
            <option value="0">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        {/* Bathrooms Dropdown */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Bathrooms</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
            value={bathroomRange}
            onChange={(e) => setBathroomRange(parseInt(e.target.value))}
          >
            <option value="0">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Property Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="any">Any Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="room">Room</option>
            <option value="backroom">Backroom</option>
          </select>
        </div>

        {/* Action Buttons - Moved to new row */}
        <div className="md:col-span-4 flex items-end space-x-2">
          <button 
            onClick={applyFilters}
            className="w-full bg-sa-gold text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300"
          >
            Apply Filters
          </button>
          <button 
            onClick={resetFilters}
            className="w-full border border-sa-green text-sa-green font-bold py-2 px-4 rounded-md hover:bg-sa-green hover:text-white transition duration-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel