import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout/logout";
import '../Cards/card.css';
import Redirect from "../Reroute/redirect";

const image = require('../Images/coconut ..png')
const image2 = require('../Images/red-heart-icon.png')

const Favourites = () => {
    const [usersData, setUsersData] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [likedProperties, setLikedProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [sortOption, setSortOption] = useState("");
    

    useEffect(() => {
        // Retrieve liked properties from localStorage
        const storedLikes = JSON.parse(localStorage.getItem("likedProperties")) || [];
        setLikedProperties(storedLikes);

        // Fetch all properties from backend
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token")
                const response = await fetch("http://localhost:3001/property", 
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

    const handleSort = (option) => {
        setSortOption(option);
        let sortedData = [...usersData]; // Create a copy of the data

        if (option === "low-to-high") {
            sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (option === "high-to-low") {
            sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        setUsersData(sortedData);
    };


    return (
        <>
            <header>
                <div className="header">
                    <img
                        src={image}
                        alt="rental"
                        style={{ position: "relative", top: "-12em", left: "-8%", textAlign: "right" }}
                    />
                </div>
                <Logout />
                <h1 style={{position:'absolute', top:'30%', left:'39%'}}>Favorite Properties</h1>
                <Redirect />
            </header>
            {/* Sort by dropdown */}
            <div className="sort-container">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortOption} onChange={(e) => handleSort(e.target.value)}>
                    <option value="">Select</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                </select>
            </div>
            <div className="card-container">
                {favoriteProperties.length > 0 ? (
                    favoriteProperties.map((property) => (
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
                                    <img src={image2} alt='white-logo-heart'  style={{width:'40px', height:'40px'}}/>
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
        </>
    );
};

export default Favourites;


