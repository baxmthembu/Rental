import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import './properties.css';
import Logout from '../Logout/logout';
import Redirect from '../Reroute/redirect';

const image = require('../Images/coconut ..png')

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState({});
    const navigate = useNavigate()


    useEffect(() => {
        const fetchProperties = async () => {
            const userId = localStorage.getItem('userId'); // Get the logged-in user's ID
            /*try {
                const response = await Axios.get(`http://localhost:3001/properties/${workerId}`);
                if (response.status === 200) {
                    const processedWorkersData = response.map(worker => ({
                        ...worker,
                        image_url: worker.image_url.split(','), // Convert the comma-separated string to an array
                    }));    
                    setProperties(processedWorkersData);
                } else {
                    console.error('Failed to fetch properties');
                }
            } catch (error) {
                console.error('An error occurred while fetching properties:', error);
            } finally {
                setIsLoading(false);
            }*/
           try{
                const token = localStorage.getItem("token")
                console.log("Token before API call:", token)
                const response = await fetch(`http://localhost:3001/properties/${userId}`, {
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
            const response = await Axios.delete(`http://localhost:3001/properties/${propertyId}`);
            
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


    return (
        <>
        <header>
            {/*<h1 id='head' style={{position:'relative', top:'-.5em', left:'-80%', textAlign:'right'}}>rental</h1>*/}
          <div className="header">
                <img src={image} alt="rental" style={{position:'relative', top:'-12em', left:'-8%', textAlign:'right'}}/>
            </div>
        </header>
        <Logout />
        <div>
            <h1 style={{position:'absolute', top:'30%', left:'39%'}}>Your Listed Properties</h1>
            <Redirect /><br />
            <div className="cards-container" style={{top:'-15rem'}}>
                {properties.length > 0 ? (
                    properties.map(property => (
                        <div key={property.id} className="cards">
                            <div className="carousel">
                                <button className="prev" onClick={() => handlePrevImage(property.id)}>❮</button>
                                <img
                                    src={property.image_url[currentImageIndex[property.id] || 0]}
                                    alt="Property"
                                    className="property_images"
                                />
                                <button className="next" onClick={() => handleNextImage(property.id)}>❯</button>
                            </div>
                            {/*<img src={property.image_url[currentImageIndex[property.id || 0]]} alt={property.description} className="property_images" />*/}
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
        </div>
        </>
    );
};

export default Properties;
