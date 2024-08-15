import React, {useEffect, useState} from "react";
import { useLocation, Link } from "react-router-dom";
import './card.css'

const image = require('../Images/coconut ..png')

const Card = () => {
    const [workersData, setWorkersData] = useState([]);
    const location = useLocation();
    const [sortOption, setSortOption] = useState(''); // Track sorting option

    useEffect(() => {
        const Data = async() => {
            try{
                const params = new URLSearchParams(location.search);
                const address = params.get('address'); // Get the search term from the URL

                const response = await fetch(`http://localhost:3001/property?address=${address}`, {
                    headers: {
                        'Content-type': 'application/json',
                        Accept: 'application/json'
                    },
                });

                if(!response.ok){
                    throw new Error('failed to fetch data')
                    
                }

                const workersJson = await response.json()
                setWorkersData(workersJson)
            }catch(error){
                console.error('Error fetching data: ', error)
            }
        }

        Data()
    }, [location.search]);

     // Function to handle sorting
     const handleSort = (option) => {
        setSortOption(option);
        let sortedData = [...workersData]; // Create a copy of the data

        if (option === 'low-to-high') {
            sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (option === 'high-to-low') {
            sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        setWorkersData(sortedData);
    };

    return(
        <>
            <header>
            <div className="header">
                <Link to='/searchbar'><img src={image} alt="rental" style={{position:'relative', top:'-12em', left:'-8%', textAlign:'right'}}/></Link>
            </div>
            <div className="rent">
                <Link to='/home' style={{textDecoration:'none', color:'black'}}>Renting your property? |</Link><br />
                <Link to='/properties' style={{textDecoration:'none', color:'black'}}>| Your listed properties</Link>
            </div>
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
            {workersData.length > 0 ? (
                workersData.map(worker => (
                    <div key={worker.id} className="card">
                        <img src={worker.image_url} alt="Property" className="property_image" />
                        <div className="card-content">
                            <div className="property_price">R {worker.price}</div>
                            <div className="property_address">{worker.address}</div>
                            <div className="property_description">{worker.description}</div>
                            <div className="property_details">
                                <div className="property_detail_item">
                                    <i className="property_detail_icon">🛏️</i>{worker.bedrooms} Bedrooms
                                </div>
                                <div className="property_detail_item">
                                    <i className="property_detail_icon">🛁</i>{worker.bathrooms} Bathrooms
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No properties found.</p>
            )}
        </div>
        
        </>
    )
}

export default Card