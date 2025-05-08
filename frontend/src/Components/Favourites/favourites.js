import React, { useState, useEffect } from "react";
import Logout from "../Logout/logout";
import Redirect from "../Reroute/redirect";
import "./favourites.css";
import SortComponent from "../Sort Component/SortComponent";
import { Link } from "react-router-dom";

const image = require('../Images/coconut-logo ..png')
const image2 = require('../Images/red-heart-icon.png')

const Favourites = () => {
    const [usersData, setUsersData] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [likedProperties, setLikedProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    

    useEffect(() => {
        // Retrieve liked properties from localStorage
        const storedLikes = JSON.parse(localStorage.getItem("likedProperties")) || [];
        setLikedProperties(storedLikes);

        // Fetch all properties from backend
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetch(/*"http://localhost:3001/property"*/`${process.env.REACT_APP_API_URL}/property`, 
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
    }, []);

    // Filter properties to show only favorites
    const favoriteProperties = usersData.filter(user => likedProperties.includes(user.id));

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
        <div className="favourites-container">
            <div id='home-back'>
                <Link to='/card'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id='home-back-logo'><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/></svg></Link>
            </div>
            <header>
                <div className="header">
                    <img
                        src={image}
                        alt="rental"
                        id="header-img"
                    />
                </div>
            </header>
                <div id="favourites-logout">
                    <Logout />
                </div>
                <div id="properties-redirect">
                    <Redirect id='property-redirect' />
                </div>
                <h1 id="properties-header">Favorite Properties</h1><br />
            {/* Sort by dropdown */}
            <div className="sort-container">
                <SortComponent handleSort={handleSort} />
            </div>
            <div className="cards-containers">
                {/*favoriteProperties*/currentItems.length > 0 ? (
                    /*favoriteProperties*/currentItems.map((property) => (
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
            {/* Modal Component */}
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
        </div>
        </>
    );
};

export default Favourites;


