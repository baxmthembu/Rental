import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './properties.css';
import { Link } from 'react-router-dom';
import Logout from '../Logout/logout';
import Redirect from '../Reroute/redirect';
import SortComponent from '../Sort Component/SortComponent';

const image = require('../Images/coconut-logo ..png')

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
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
        <div className='properties-container'>
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
                {/*properties*/currentItems.length > 0 ? (
                    /*properties*/currentItems.map(property => (
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
        </div>
        </>
    );
};

export default Properties;
