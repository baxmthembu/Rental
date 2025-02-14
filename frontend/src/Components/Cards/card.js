import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './card.css';
import Logout from '../Logout/logout';
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";
import Redirect from '../Reroute/redirect';


const image = require('../Images/coconut ..png')

const Card = () => {
    const [usersData, setUsersData] = useState([]);
    const location = useLocation();
    const [sortOption, setSortOption] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // State for the search bar
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
                {/*<div className="rent">
                    <Link to="/home" style={{ textDecoration: "none", color: "black" }}>
                        Renting your property? |
                    </Link>
                    <br />
                    <Link to="/properties" style={{ textDecoration: "none", color: "black" }}>
                        | Your listed properties
                    </Link>
                </div>*/}<Redirect />
            </header>
            {/* Search Bar */}
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
                                {/*<div className="property_contact">Owner: {user.name}</div>*/}
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
