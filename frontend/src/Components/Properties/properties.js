import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import './properties.css';
import { Link } from 'react-router-dom';
import Logout from '../Logout/logout';
import SortComponent from '../Sort Component/SortComponent';
import Footer from '../Footer/footer';
import { LikedPropertiesContext } from '../LikedPropertiesContext/LikedPropertiesContext';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const { likedProperties } = useContext(LikedPropertiesContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    


    useEffect(() => {
        const fetchProperties = async () => {
            const userId = localStorage.getItem('userId'); // Get the logged-in user's ID
           try{
                const token = localStorage.getItem("token")
                console.log("Token before API call:", token)
                const response = await fetch(`${process.env.REACT_APP_API_URL}/properties/${userId}`, {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token.trim()}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const usersJson = await response.json();
                const processedUsersData = usersJson.map(user => ({
                    ...user,
                    image_url: user.image_url.split(','), // Convert the comma-separated string to an array
                }));

                setProperties(processedUsersData);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }


        };

        fetchProperties();
    }, []);

    const handleDelete = async (propertyId) => {
        try {
            // Send delete request to your backend API
            const response = await Axios.delete(`${process.env.REACT_APP_API_URL}/properties/${propertyId}`)
            
            if (response.status === 200) {
                // Remove the deleted property from the local state
                setProperties(prevProperties => prevProperties.filter(property => property.id !== propertyId));
            } else {
                console.error('Failed to delete property');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    const handleSort = (e) => {
        const value = e.target.value;
        let sorted = [...properties];
    
        if (value === "lowToHigh") {
          sorted.sort((a, b) => a.price - b.price);
        } else if (value === "highToLow") {
          sorted.sort((a, b) => b.price - a.price);
        }
    
        setProperties(value === "default" ? properties : sorted);
        setCurrentPage(1);
      };


    const handleNextImage = (userId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [userId]: ((prevState[userId] || 0) + 1) % properties.find(user => user.id === userId).image_url.length,
        }));
    };

    const handlePrevImage = (userId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [userId]: (prevState[userId] - 1 + properties.find(user => user.id === userId).image_url.length) 
            % properties.find(user => user.id === userId).image_url.length,
        }));
    };

     // Pagination logic
    const totalPages = Math.ceil(properties.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = properties.slice(indexOfFirstItem, indexOfLastItem);
 
    const handlePageClick = (pageNum) => {
        setCurrentPage(pageNum);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to top on page change
    }; 


    return (
        <>
        {/*<div className='properties-container'>
            <div id='home-back'>
                <Link to='/card'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id='home-back-logo'><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/></svg></Link>
            </div>
        <header>
          <div className="header">
                <img src={image} alt="rental" id="header-img"/>
            </div>
        </header>
        <div id='property-logout'>
        <Logout id="property-logout" />
        </div>
        <div>
        <div id='properties-redirect'>
            <Redirect id='property-redirect'/><br />
        </div><br />
            <h1 id='properties-header'>Your Listed Properties</h1>
            <div className="sort-container">
                <SortComponent handleSort={handleSort} />
            </div>
            <div className="cards-container">
                {currentItems.length > 0 ? (
                    currentItems.map(property => (
                        <div key={property.id} className="cards">
                            <div className="carouselss">
                                <button className="prev" onClick={() => handlePrevImage(property.id)}>❮</button>
                                <img
                                    src={property.image_url[currentImageIndex[property.id] || 0]}
                                    alt="Property"
                                    className="property_images"
                                />
                                <button className="next" onClick={() => handleNextImage(property.id)}>❯</button>
                            </div>
                            <div className="cards-content">
                            <div className="property_prices">R {property.price}</div>
                            <div className="property_addresses">{property.address}</div>
                            <div className="property_descriptions">{property.description}</div>
                            <div className="property_detail">
                                <div className="property_detail_item">
                                    <i className="property_detail_icons">🛏️</i>{property.bedrooms} Bedrooms
                                </div>
                                <div className="property_detail_item">
                                    <i className="property_detail_icon">🛁</i>{property.bathrooms} Bathrooms
                                </div>
                            </div>
                            </div>
                            <div className="cards-overlay">
                                <button 
                                    className="delete-button" 
                                    onClick={() => handleDelete(property.id)}
                                >
                                    Delete
                                </button>
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
        </div>
        </div>*/}
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
                                <Link to='/properties' class="nav-link bg-sa-green text-white px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                                <Link to='/favourites' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium relative">Saved Properties
                                    {likedProperties.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {likedProperties.length}
                                        </span>
                                    )}
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

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Landlord Dashboard</h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        Manage your listed properties and connect with potential tenants
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div>
                {/* Sort Component */}
                <div className="mb-6">
                    <SortComponent handleSort={handleSort} />
                </div>

                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {currentItems.length > 0 ? (
                        currentItems.map(property => (
                            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 relative">
                                {/* Carousel */}
                                <div className="relative h-64 overflow-hidden">
                                    <button 
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                                        onClick={() => handlePrevImage(property.id)}
                                    >
                                        ❮
                                    </button>
                                    <img
                                        src={property.image_url[currentImageIndex[property.id] || 0]}
                                        alt="Property"
                                        className="w-full h-full object-cover"
                                    />
                                    <button 
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                                        onClick={() => handleNextImage(property.id)}
                                    >
                                        ❯
                                    </button>
                                </div>
                                {/* Property Details */}
                                <div className="p-6">
                                    <div className="text-2xl font-bold text-sa-green mb-2">R {property.price}</div>
                                    <div className="text-gray-600 mb-2">{property.address}</div>
                                    <p className="text-gray-600 text-sm mb-4">{property.description}</p>
                                    <div className="flex space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <span className="mr-1">🛏️</span>
                                            {property.bedrooms} Bedrooms
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-1">🛁</span>
                                            {property.bathrooms} Bathrooms
                                        </div>
                                    </div>
                                </div>

                                {/* Delete Button */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 hover:opacity-100 transition duration-300">
                                    <button 
                                        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
                                        onClick={() => handleDelete(property.id)}
                                    >
                                        Delete Property
                                    </button>
                                </div>
                            </div>
                            ))
                            ) : (
                                <div className="col-span-3 text-center py-10">
                                    <p className="text-gray-600 text-xl">No properties found</p>
                                </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center space-x-2">
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
            </div>
            <Footer />
        </div>
        </>
    );
};

export default Properties;
