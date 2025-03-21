import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './card.css';
import Logout from '../Logout/logout';
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import Redirect from '../Reroute/redirect';


const image = require('../Images/coconut ..png')
const red = require('../Images/red-heart-icon.png')
const white = require('../Images/white-icon.png')

const Card = () => {
    const [usersData, setUsersData] = useState([]);
    const location = useLocation();
    const [sortOption, setSortOption] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for the search bar
    const [likedProperties, setLikedProperties] = useState([]);
    const navigate = useNavigate();    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token"); // Fetch token
                console.log("Token before API call:", token); // Debugging

                if (!token) {
                    console.error("No token found, authorization will fail!");
                    return;
                }
                const params = new URLSearchParams(location.search);
                const address = params.get("address") || ""; // Get the search term from the URL 

                console.log("Sending token:", localStorage.getItem("token"));
                const response = await fetch(
                    `http://localhost:3001/property?address=${address}`,
                    {
                        headers: {
                            "Content-type": "application/json",
                            Accept: "application/json",
                            Authorization: `Bearer ${token.trim()}` // Include the token here
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const usersJson = await response.json();
                const processedUsersData = usersJson.map((user) => ({
                    ...user,
                    image_url: user.image_url.split(","), // Convert the comma-separated string to an array
                }));

                setUsersData(processedUsersData);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [location.search]);

    const handleSearch = () => {
        navigate(`/card?address=${encodeURIComponent(searchQuery)}`); // Navigate to the updated URL with the search query
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

    const handleNextImage = (userId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [userId]:
                ((prevState[userId] || 0) + 1) %
                usersData.find((user) => user.id === userId).image_url.length,
        }));
    };

    const handlePrevImage = (userId) => {
        setCurrentImageIndex((prevState) => ({
            ...prevState,
            [userId]:
                (prevState[userId] - 1 +
                    usersData.find((users) => users.id === userId).image_url.length) %
                usersData.find((users) => users.id === userId).image_url.length,
        }));
    };

    const openModal = (property) => {
        setSelectedProperty(property);
    };

    const closeModal = () => {
        setSelectedProperty(null);
    };

    const toggleLike = (propertyId) => {
        setLikedProperties((prevLiked) => {
            let updatedLikes;
            if (prevLiked.includes(propertyId)) {
                updatedLikes = prevLiked.filter(id => id !== propertyId);
            } else {
                updatedLikes = [...prevLiked, propertyId];
            }
            // Save updated likes to localStorage
            localStorage.setItem("likedProperties", JSON.stringify(updatedLikes));
            return updatedLikes;
        });
    };

    useEffect(() => {
        // Retrieve liked properties from localStorage when the component mounts
        const storedLikes = JSON.parse(localStorage.getItem("likedProperties")) || [];
        setLikedProperties(storedLikes);
    }, []);


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
                <div className='homes' >
                    <Link to="/favourites">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>
                    {likedProperties.length > 0 && (
                        <span className="badge">{likedProperties.length}</span>
                    )}
                    </Link>
                </div>
                <Redirect />
            </header>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Address: KwaMashu G/ Inanda etc "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id='search'
                    className="search-bar"
                />
                <CIcon icon={cilSearch} size="sm" customClassName={'icon'} height={40} onClick={handleSearch} />
            </div>
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
                {usersData.length > 0 ? (
                    usersData.map((user) => (
                        <div key={user.id} className="card">
                            <div className="carousel">
                                <button
                                    className="prev"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handlePrevImage(user.id);
                                    }}
                                >
                                    ❮
                                </button>
                                <img
                                    src={user.image_url[currentImageIndex[user.id] || 0]}
                                    alt="Property"
                                    className="property_image"
                                    onClick={() => openModal(user)}
                                />
                                <button className="next" onClick={() => handleNextImage(user.id)}>
                                    ❯
                                </button>
                            </div>
                            <div className="card-content">
                               <div className={`liked_one ${likedProperties.includes(user.id) ? 'liked' : ''}`} onClick={() => toggleLike(user.id)}>
                                <img src={likedProperties.includes(user.id) ? red : white} alt='white-logo-heart'  style={{width:'40px', height:'40px'}}/>
                                </div>
                                <div className="property_price">R {user.price}</div>
                                <div className="property_address">{user.address}</div>
                                <div className="property_description">{user.description}</div>
                                <div className="property_details">
                                    <div className="property_detail_item">
                                        <i className="property_detail_icon">🛏️</i>
                                        {user.bedrooms} Bedrooms
                                    </div>
                                    <div className="property_detail_item">
                                        <i className="property_detail_icon">🛁</i>
                                        {user.bathrooms} Bathrooms
                                    </div>
                                </div>
                                <div className='property_contact'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>{user.name}</svg>
                                    {user.name}
                                </div>
                                <div className="property_contact">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='icon'><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                                    {user.phone_number}
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

export default Card;
