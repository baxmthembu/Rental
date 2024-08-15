import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './properties.css'

const image = require('../Images/coconut ..png')

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            const workerId = localStorage.getItem('workerId'); // Get the logged-in user's ID
            try {
                const response = await Axios.get(`http://localhost:3001/properties/${workerId}`);
                if (response.status === 200) {
                    setProperties(response.data);
                } else {
                    console.error('Failed to fetch properties');
                }
            } catch (error) {
                console.error('An error occurred while fetching properties:', error);
            } finally {
                setIsLoading(false);
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

    if (isLoading) {
        return <p>Loading properties...</p>;
    }

    return (
        <>
        <header>
          <div className="header">
                <img src={image} alt="rental" style={{position:'relative', top:'-12em', left:'-8%', textAlign:'right'}}/>
            </div>
        </header>
        <div>
            <h1 style={{position:'absolute', top:'20%', left:'35%'}}>Your Listed Properties</h1>
            <div className="cards-container" style={{top:'-13rem'}}>
                {properties.length > 0 ? (
                    properties.map(property => (
                        <div key={property.id} className="cards">
                            <img src={property.image_url} alt={property.description} className="property_images" />
                            <div className="cards-content">
                            <div className="property_prices">R {property.price}</div>
                            <div className="property_addresses">{property.address}</div>
                            <div className="property_descriptions">{property.description}</div>
                            <div className="property_detail">
                                <div className="property_detail_items">
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
