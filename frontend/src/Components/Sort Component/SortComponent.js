import './SortComponent.css'

const SortComponent = ({ handleSort }) => {
  return (
    <div className="sort-container">
      <label htmlFor="sort">Sort by:</label>
      <select id="sort" onChange={handleSort}>
        <option value="default">Default</option>
        <option value="lowToHigh">Price (Low to High)</option>
        <option value="highToLow">Price (High to Low)</option>
      </select>
    </div>
  );
};

export default SortComponent;
