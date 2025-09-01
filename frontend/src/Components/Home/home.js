import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logout from '../Logout/logout';
import 'rc-slider/assets/index.css';
import FilterPanel from '../FilerPanel/filterPanel';
import 'react-pro-sidebar/dist/css/styles.css';
import Modal from '../Modal/modal';
import Features from '../Features/featurs';
import Footer from '../Footer/footer';
import { LikedPropertiesContext } from '../LikedPropertiesContext/LikedPropertiesContext';



const Home = () => {
    const [usersData, setUsersData] = useState([]);
    const [originalUsersData, setOriginalUsersData] = useState([]);
    const {likedProperties, toggleLike} = useContext(LikedPropertiesContext);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [priceRange, setPriceRange] = useState([500, 10000]);
    const [bedroomRange, setBedroomRange] = useState(0);
    const [bathroomRange, setBathroomRange] = useState(0);
    const [showFilter, setShowFilter] = useState(false);
    const toggleFilter = () => setShowFilter(!showFilter);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                /*const token = localStorage.getItem("token");
                if (!token) return;*/

                const params = new URLSearchParams(location.search);
                const address = params.get("address") || "";

                /*const response = await fetch(`http://localhost:3001/property?address=${address}`*/
                const response = await fetch(`${process.env.REACT_APP_API_URL}/property?address=${address}`, {
                    headers: {
                        "Content-type": "application/json",
                        /*Accept: "application/json",
                        Authorization: `Bearer ${token.trim()}`*/
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch data");

                const usersJson = await response.json();
                const processedData = usersJson.map(user => ({
                    ...user,
                    image_url: user.image_url.split(","),
                }));

                setUsersData(processedData);
                setOriginalUsersData(processedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [location.search]);

    const handleSearch = (e) => {
        //e.preventDefault()
        navigate(`/home?address=${encodeURIComponent(searchQuery)}`);
    };

    const handleSort = (option) => {
        setSortOption(option);
        let sortedData = [...usersData];
        if (option === "low-to-high") {
            sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (option === "high-to-low") {
            sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        setUsersData(sortedData);
        setCurrentPage(1);
    };

    const handleNextImage = (userId) => {
        setCurrentImageIndex((prev) => ({
            ...prev,
            [userId]: ((prev[userId] || 0) + 1) % usersData.find(u => u.id === userId).image_url.length,
        }));
    };

    const handlePrevImage = (userId) => {
        setCurrentImageIndex((prev) => {
            const length = usersData.find(u => u.id === userId).image_url.length;
            return {
                ...prev,
                [userId]: (prev[userId] - 1 + length) % length,
            };
        });
    };

    const applyFilters = () => {
        const filtered = usersData.filter(user =>
            user.price >= priceRange[0] &&
            user.price <= priceRange[1] &&
            user.bedrooms >= bedroomRange &&
            user.bathrooms >= bathroomRange
        );
        setUsersData(filtered);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setPriceRange([500, 10000]);
        setBedroomRange(0);
        setBathroomRange(0);
        setUsersData(originalUsersData);
        setCurrentPage(1);
    };

    const openModal = (property) => setSelectedProperty(property);

    // Pagination logic
    const totalPages = Math.ceil(usersData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = usersData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to top on page change
    };

    const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

    return (
        <>
            <nav class="bg-white shadow-lg sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <h1 class="text-2xl font-bold text-sa-green">Rentekasi</h1>
                                <p class="text-xs text-gray-600">Trusted Township Rentals</p>
                            </div>
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <Link to="/home" class="nav-link bg-sa-green text-white px-3 py-2 rounded-md text-sm font-medium">Find Homes</Link>
                                <Link to='/list_properties' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">List Property</Link>
                                <Link to='/properties' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                                <Link to='/favourites' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium relative">
                                Saved Properties {likedProperties.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform transition-all duration-300 scale-100 hover:scale-110">
                                        {likedProperties.length}
                                </span> )}</Link>
                                <Link to='/financing' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Financing</Link>
                                <Link to='/about' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">About</Link>
                                <button class="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"><Link to="/">Sign In</Link></button>
                                <Logout />
                            </div>
                        </div>
                        <div className="md:hidden">
                            <button 
                                id="mobile-menu-btn" 
                                className="text-gray-700 hover:text-sa-green focus:outline-none"
                                onClick={toggleMobileMenu}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                 <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        <Link to="/home" className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">Find Homes</Link>
                        <Link to='/list_properties' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">List Property</Link>
                        <Link to='/properties' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">Listed Properties</Link>
                        <Link to='/favourites' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md flex items-center">
                            Saved Properties
                            {likedProperties.length > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {likedProperties.length}
                                </span> 
                            )}
                        </Link>
                        <Link to='/financing' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">Financing</Link>
                        <Link to='/about' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">About</Link>
                        <div className="pt-2 border-t border-gray-200">
                            <button className="w-20 text-left px-3 py-2 bg-sa-green text-white rounded-md hover:bg-green-700">
                                <Link to="/login" className="block">Sign In</Link>
                            </button>
                            <div className="mt-2">
                                <Logout />/
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Home in South African Townships</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Verified listings, instant screening, and trusted financing. Connecting landlords and tenants safely across SA's townships.</p>

                        {/* Search Bar Container */}
                        <div className="max-w-2xl mx-auto flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
                            <input
                                type="text"
                                placeholder="Search by location (e.g. KwaMashu G)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                id="search"
                                className="flex-grow px-4 py-3 text-gray-800 focus:outline-none"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button 
                                onClick={handleSearch}
                                className="bg-sa-gold hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 transition duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* Filter Toggle Button (mobile only) */}
                        <button 
                            onClick={toggleFilter}
                            className="md:hidden mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                        >
                            {showFilter ? 'Hide Filters' : 'Show Filters'}
                        </button>

                        {/* Filter Panel */}
                        <div className={`mt-6 transition-all duration-300 ${showFilter ? "block" : "hidden md:block"}`}>
                            <FilterPanel
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                bedroomRange={bedroomRange}
                                setBedroomRange={setBedroomRange}
                                bathroomRange={bathroomRange}
                                setBathroomRange={setBathroomRange}
                                applyFilters={applyFilters}
                                resetFilters={resetFilters}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <div className="sort-container">
                <label htmlFor="sort" id='sort-label'>Sort by:</label>
                <select id="sort" value={sortOption} onChange={(e) => handleSort(e.target.value)}>
                    <option value="">Select</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                </select>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-8">
                    {currentItems.length > 0 ? (
                        currentItems.map((user) => (
                            <div key={user.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                {/* Image Carousel Section */}
                                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
                                    <button 
                                        className="prev absolute left-2 text-white text-2xl z-10 hover:text-gray-200"
                                        onClick={(e) => { e.stopPropagation(); handlePrevImage(user.id); }}
                                    >
                                        ❮
                                    </button>
          
                                    <img
                                        src={user.image_url[currentImageIndex[user.id] || 0]}
                                        alt="Property"
                                        className="h-full w-full object-cover cursor-pointer"
                                        onClick={() => openModal(user)}
                                        title='click image to enlarge'
                                    />
          
                                    <button 
                                        className="next absolute right-2 text-white text-2xl z-10 hover:text-gray-200"
                                        onClick={(e) => { e.stopPropagation(); handleNextImage(user.id); }}
                                    >
                                        ❯
                                    </button>
          
                                    {/* Like Button */}
                                    <div 
                                        className={`absolute top-2 right-2 ${likedProperties.includes(user.id) ? 'text-red-500' : 'text-white'}`}
                                        onClick={(e) => { e.stopPropagation(); toggleLike(user.id); }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Property Details Section */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold">
                                            {user.bedrooms}BR {user.property_type || 'Property'}
                                        </h3>
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                            Verified
                                        </span>
                                    </div>
          
                                    <p className="text-gray-600 mb-2">📍 {user.address}</p>
                                    <p className="text-2xl font-bold text-sa-green mb-4">R {user.price}/month</p>
                                    <p className="text-gray-600 text-sm mb-4">{user.description}</p>
          
                                    {user.showDetails && (
                                        <div className="details-section">
                                            <div className="property_details flex mb-4">
                                                <div className="property_detail_item mr-4">
                                                    <span className="mr-1">🛏️</span>
                                                    {user.bedrooms} Bedrooms
                                                </div>
                                                <div className="property_detail_item">
                                                    <span className="mr-1">🛁</span>
                                                    {user.bathrooms} Bathrooms
                                                </div>
                                            </div>
              
                                            <div className="property_contact flex items-center mb-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 mr-2">
                                                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
                                                </svg>
                                                {user.name}
                                            </div>
              
                                            <div className="property_contact flex items-center mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 mr-2">
                                                    <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                                                </svg>
                                                {user.phone_number}
                                            </div>
                                        </div>
                                    )}

                                    <button 
                                        className="w-full bg-sa-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
                                        onClick={() => {
                                            // Toggle the showDetails state for this specific property
                                            const updatedItems = currentItems.map(item => 
                                                item.id === user.id 
                                                ? {...item, showDetails: !item.showDetails} 
                                                : item
                                            );
                                            setUsersData(updatedItems);
                                        }}
                                    >
                                        {user.showDetails ? 'Hide Details' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            <p className="text-gray-600 text-xl">No Properties found</p>
                        </div>
                    )}
                </div>
                {currentItems.length > 0 && (
                    <div className= "flex justify-center space-x-2 mt-8">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-sa-green text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <Modal
                isOpen={!!selectedProperty}
                onClose={() => setSelectedProperty(null)}
                property={selectedProperty}
            />
            <Features />
            <Footer />
        </>
    );
};

export default Home;
