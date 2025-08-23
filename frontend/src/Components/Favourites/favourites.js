import React, { useState, useEffect, useContext } from "react";
import Logout from "../Logout/logout";
import Redirect from "../Reroute/redirect";
import "./favourites.css";
import SortComponent from "../Sort Component/SortComponent";
import { Link } from "react-router-dom";
import Footer from "../Footer/footer";
import { LikedPropertiesContext } from "../LikedPropertiesContext/LikedPropertiesContext";


const image2 = require('../Images/red-heart-icon.png')

/*const Favourites = () => {
    const [usersData, setUsersData] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    //const [, setLikedProperties] = useState([]);
    const [favoriteProperties, setFavoriteProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { likedProperties } = useContext(LikedPropertiesContext);
    const itemsPerPage = 6;
    
    

    /*useEffect(() => {
        // Retrieve liked properties from localStorage
        const storedLikes = JSON.parse(localStorage.getItem("likedProperties")) || [];
        setLikedProperties(storedLikes);

        // Fetch all properties from backend
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetch("http://localhost:3001/property"/*`${process.env.REACT_APP_API_URL}/property`*, 
                    {
                        headers: {
                            'Content-type': 'application/json',
                            Accept: 'application/json',
                            Authorization: `Bearer ${token.trim()}`
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch properties");
                }
                const data = await response.json();
                const processedUsersData = data.map((user) => ({
                    ...user,
                    image_url: user.image_url.split(","), // Convert the comma-separated string to an array
                }));

                setUsersData(processedUsersData);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchData();
    }, []);*

    useEffect(() => {
        const fetchFavoriteProperties = async () => {
            try {
                // If no liked properties, set empty array and return
                if (likedProperties.length === 0) {
                    setFavoriteProperties([]);
                    return;
                }

                const token = localStorage.getItem("token");
                const ids = likedProperties.join(',');
                
                const response = await fetch(`http://localhost:3001/properties-by-ids?ids=${ids}`, {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token.trim()}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch favorite properties");
                }

                const data = await response.json();
                const processedData = data.map((user) => ({
                    ...user,
                    image_url: user.image_url.split(","),
                }));

                setFavoriteProperties(processedData);
            } catch (error) {
                console.error("Error fetching favorite properties:", error);
            }
        };

        fetchFavoriteProperties();
    }, [likedProperties]); // Re-fetch when likedProperties changes

    // Filter properties to show only favorites
    const favoritePropertiess = usersData.filter(user => likedProperties.includes(user.id));

    const handlePrevImage = (userId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [userId]:
                (prevState[userId] - 1 +
                    favoriteProperties.find((users) => users.id === userId).image_url.length) %
                favoriteProperties.find((users) => users.id === userId).image_url.length,
        }));
    };

    const handleNextImage = (userId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [userId]:
                ((prevState[userId] || 0) + 1) %
                favoriteProperties.find((user) => user.id === userId).image_url.length,
        }));
    };


    const openModal = (property) => {
        setSelectedProperty(property);
    };

    const closeModal = () => {
        setSelectedProperty(null);
    };

    const handleSort = (e) => {
        const value = e.target.value;
        let sorted = [...usersData];
    
        if (value === "lowToHigh") {
          sorted.sort((a, b) => a.price - b.price);
        } else if (value === "highToLow") {
          sorted.sort((a, b) => b.price - a.price);
        }
    
        setUsersData(value === "default" ? usersData : sorted);
        setCurrentPage(1);
    };
    
    const totalPages = Math.ceil(usersData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = usersData.slice(indexOfFirstItem, indexOfLastItem);
 
    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to top on page change
    }; 


    return (
        <>
        {/*<div>
            {/* Sort by dropdown *}
            <div className="sort-container">
                <SortComponent handleSort={handleSort} />
            </div>
            <div className="cards-containers">
                {currentItems.length > 0 ? (
                    currentItems.map((property) => (
                        <div key={property.id} className="card">
                            <div className="carousel">
                                <button
                                    className="prev"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevImage(property.id);
                                    }}
                                >
                                    ❮
                                </button>
                                <img
                                    src={property.image_url[currentImageIndex[property.id] || 0]}
                                    alt="Property"
                                    className="property_image"
                                    onClick={() => openModal(property)}
                                />
                                <button className="next" onClick={() => handleNextImage(property.id)}>
                                    ❯
                                </button>
                            </div>
                            <div className="card-content">
                                <div className="liked_one">
                                    <img src={image2} alt='white-logo-heart' id="favourites-image"/>
                                </div>
                                <div className="property_price">R {property.price}</div>
                                <div className="property_address">{property.address}</div>
                                <div className="property_description">{property.description}</div>
                                <div className="property_details">
                                    <div className="property_detail_item">
                                        <i className="property_detail_icon">🛏️</i>
                                        {property.bedrooms} Bedrooms
                                    </div>
                                    <div className="property_detail_item">
                                        <i className="property_detail_icon">🛁</i>
                                        {property.bathrooms} Bathrooms
                                    </div>
                                </div>
                                <div className='property_contact'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>{property.name}</svg>
                                    {property.name}
                                </div>
                                <div className="property_contact">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='icon'><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                                    {property.phone_number}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No properties found.</p>
                )}
            </div>
            <div className="paginations-container">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        style={{
                            margin: "0 5px",
                            padding: "8px 12px",
                            backgroundColor: currentPage === page ? "#333" : "#ccc",
                            color: currentPage === page ? "#fff" : "#000",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                    {page}
                    </button>
                ))}
            </div>
            {/* Modal Component *}
            {selectedProperty && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <div className="modal-carousel">
                            <button className="prev" onClick={() => handlePrevImage(selectedProperty.id)}>
                                ❮
                            </button>
                            <img
                                src={selectedProperty.image_url[currentImageIndex[selectedProperty.id] || 0]}
                                alt="Property"
                                className="modal-property-image"
                            />
                            <button className="next" onClick={() => handleNextImage(selectedProperty.id)}>
                                ❯
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>*}
        <div>
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-sa-green">Rentekasi</h1>
                                <p className="text-xs text-gray-600">Trusted Township Rentals</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/home" class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Find Homes</Link>
                                <Link to='/list_properties' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">List Property</Link>
                                <Link to='/properties' class="av-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                                <Link to='/favourites' class="nav-link bg-sa-green text-white px-3 py-2 rounded-md text-sm font-medium relative">Saved Properties
                                    {likedProperties.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {likedProperties.length}
                                        </span>)}
                                </Link>
                                <Link to='/financing' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Financing</Link>
                                <Link to='/about' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">About</Link>
                                <Link to="/login" className="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Sign In</Link>
                                <Logout />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Saved Properties</h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        All your saved properties - ready when you are to make your move
                    </p>
                </div>
            </section>
            {/* Sort Component *}
            <div className="mb-6">
                <SortComponent handleSort={handleSort} />
            </div>

            {/* Properties Grid *}
            {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentItems.length > 0 ? (
                    currentItems.map((property) => (
                        <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                            {/* Carousel *}
                            <div className="relative h-64 overflow-hidden">
                                <button
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevImage(property.id);
                                    }}
                                >
                                    ❮
                                </button>
                                <img
                                    src={property.image_url[currentImageIndex[property.id] || 0]}
                                    alt="Property"
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => openModal(property)}
                                />
                                <button 
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                                    onClick={() => handleNextImage(property.id)}
                                >
                                    ❯
                                </button>
                            </div>

                            {/* Property Details *}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-2xl font-bold text-sa-green">R {property.price}</div>
                                    <div className="liked_one">
                                        <img src={image2} alt="white-logo-heart" className="w-8 h-8" />
                                    </div>
                                </div>
            
                                <div className="text-gray-600 mb-2">{property.address}</div>
                                <p className="text-gray-600 text-sm mb-4">{property.description}</p>
            
                                <div className="flex space-x-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <span className="mr-1">🛏️</span>
                                        {property.bedrooms} Bedrooms
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">🛁</span>
                                        {property.bathrooms} Bathrooms
                                    </div>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 mr-2">
                                        <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
                                    </svg>
                                    {property.name}
                                </div>
            
                                <div className="flex items-center text-sm text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 mr-2">
                                        <path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
                                    </svg>
                                    {property.phone_number}
                                </div>
                            </div>
                        </div>
                    ))
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            <p className="text-gray-600 text-xl">No properties found</p>
                        </div>
                )}
            </div>*}
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-8">
                {currentItems.length > 0 ? (
                    currentItems.map((user) => (
                        <div key={user.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            {/* Image Carousel Section *}
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
          
                                {/* Like Button *}
                                {/*<div 
                                    className={`absolute top-2 right-2 ${likedProperties.includes(user.id) ? 'text-red-500' : 'text-white'}`}
                                    onClick={(e) => { e.stopPropagation(); toggleLike(user.id); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </div>*}
                            </div>

                            {/* Property Details Section *}
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

            {/* Pagination *}
            <div className="flex justify-center space-x-2 mt-8">
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

            {/* Modal *}
            {selectedProperty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="relative">
                            <button 
                                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-opacity-70"
                                onClick={closeModal}
                            >
                                &times;
                            </button>
          
                            <div className="relative h-96 overflow-hidden">
                                <button 
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                                    onClick={() => handlePrevImage(selectedProperty.id)}
                                >
                                    ❮
                                </button>
            
                                <img
                                    src={selectedProperty.image_url[currentImageIndex[selectedProperty.id] || 0]}
                                    alt="Property"
                                    className="w-full h-full object-contain"
                                />
            
                                <button 
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                                    onClick={() => handleNextImage(selectedProperty.id)}
                                >
                                    ❯
                                </button>
                            </div>
          
                            <div className="p-6">
                                <div className="text-2xl font-bold text-sa-green mb-2">R {selectedProperty.price}</div>
                                <div className="text-gray-600 mb-2">{selectedProperty.address}</div>
                                <p className="text-gray-600 text-sm mb-4">{selectedProperty.description}</p>
            
                                <div className="flex space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="mr-1">🛏️</span>
                                        {selectedProperty.bedrooms} Bedrooms
                                    </div>
                                    <div className="flex items-center">
                                        <span className="mr-1">🛁</span>
                                        {selectedProperty.bathrooms} Bathrooms
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footer />
        </>
    );
};*/
const Favourites = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [favoriteProperties, setFavoriteProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const { likedProperties } = useContext(LikedPropertiesContext);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchFavoriteProperties = async () => {
            try {
                // If no liked properties, set empty array and return
                if (likedProperties.length === 0) {
                    setFavoriteProperties([]);
                    return;
                }

                const token = localStorage.getItem("token");
                const ids = likedProperties.join(',');
                
                const response = await fetch(`http://localhost:3001/properties-by-ids?ids=${ids}`, {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token.trim()}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch favorite properties");
                }

                const data = await response.json();
                const processedData = data.map((user) => ({
                    ...user,
                    image_url: user.image_url.split(","),
                }));

                setFavoriteProperties(processedData);
            } catch (error) {
                console.error("Error fetching favorite properties:", error);
            }
        };

        fetchFavoriteProperties();
    }, [likedProperties]);

    const handlePrevImage = (userId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [userId]: (prevState[userId] - 1 + 
                      favoriteProperties.find(user => user.id === userId).image_url.length) % 
                      favoriteProperties.find(user => user.id === userId).image_url.length,
        }));
    };

    const handleNextImage = (userId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [userId]: ((prevState[userId] || 0) + 1) % 
                      favoriteProperties.find(user => user.id === userId).image_url.length,
        }));
    };

    const openModal = (property) => {
        setSelectedProperty(property);
    };

    const closeModal = () => {
        setSelectedProperty(null);
    };

    const handleSort = (e) => {
        const value = e.target.value;
        let sorted = [...favoriteProperties]; // Use favoriteProperties instead of usersData
    
        if (value === "lowToHigh") {
            sorted.sort((a, b) => a.price - b.price);
        } else if (value === "highToLow") {
            sorted.sort((a, b) => b.price - a.price);
        }
    
        setFavoriteProperties(value === "default" ? favoriteProperties : sorted);
        setCurrentPage(1);
    };
    
    // Pagination for FAVORITE properties, not usersData
    const totalPages = Math.ceil(favoriteProperties.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = favoriteProperties.slice(indexOfFirstItem, indexOfLastItem);
 
    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div>
                <nav className="bg-white shadow-lg sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <h1 className="text-2xl font-bold text-sa-green">Rentekasi</h1>
                                    <p className="text-xs text-gray-600">Trusted Township Rentals</p>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link to="/home" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Find Homes</Link>
                                    <Link to='/list_properties' className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">List Property</Link>
                                    <Link to='/properties' className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                                    <Link to='/favourites' className="nav-link bg-sa-green text-white px-3 py-2 rounded-md text-sm font-medium relative">Saved Properties
                                        {likedProperties.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {likedProperties.length}
                                            </span>)}
                                    </Link>
                                    <Link to='/financing' className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Financing</Link>
                                    <Link to='/about' className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">About</Link>
                                    <Link to="/login" className="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Sign In</Link>
                                    <Logout />
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Saved Properties</h1>
                        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                            All your saved properties - ready when you are to make your move
                        </p>
                    </div>
                </section>

                {/* Sort Component - Only show if there are favorites */}
                {favoriteProperties.length > 0 && (
                    <div className="mb-6">
                        <SortComponent handleSort={handleSort} />
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                                                setFavoriteProperties(prev => 
                                                    prev.map(prop => 
                                                        prop.id === user.id 
                                                        ? {...prop, showDetails: !prop.showDetails}
                                                        : prop
                                                    )
                                                );
                                            }}
                                        >
                                            {user.showDetails ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-10">
                                <p className="text-gray-600 text-xl">
                                    {likedProperties.length === 0 ? 'No saved properties yet' : 'No properties found'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination - Only show if there are multiple pages */}
                    {favoriteProperties.length > itemsPerPage && (
                        <div className="flex justify-center space-x-2 mt-8">
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

                {/* Modal */}
                {selectedProperty && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                            <div className="relative">
                                <button 
                                    className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-opacity-70"
                                    onClick={closeModal}
                                >
                                    &times;
                                </button>
              
                                <div className="relative h-96 overflow-hidden">
                                    <button 
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                                        onClick={() => handlePrevImage(selectedProperty.id)}
                                    >
                                        ❮
                                    </button>
                
                                    <img
                                        src={selectedProperty.image_url[currentImageIndex[selectedProperty.id] || 0]}
                                        alt="Property"
                                        className="w-full h-full object-contain"
                                    />
                
                                    <button 
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                                        onClick={() => handleNextImage(selectedProperty.id)}
                                    >
                                        ❯
                                    </button>
                                </div>
              
                                <div className="p-6">
                                    <div className="text-2xl font-bold text-sa-green mb-2">R {selectedProperty.price}</div>
                                    <div className="text-gray-600 mb-2">{selectedProperty.address}</div>
                                    <p className="text-gray-600 text-sm mb-4">{selectedProperty.description}</p>
                
                                    <div className="flex space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <span className="mr-1">🛏️</span>
                                            {selectedProperty.bedrooms} Bedrooms
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-1">🛁</span>
                                            {selectedProperty.bathrooms} Bathrooms
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <br />
            <br />
            <Footer />
        </>
    );
};

export default Favourites;


