import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import './searchbar.css'
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

const image = require('../Images/coconut ..png')

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId')
        console.log(userId)
    }, [])

    const handleSearch = () => {
        if (!error) {
            const sanitizedSearchTerm = DOMPurify.sanitize(searchTerm);
            navigate(`/card?address=${encodeURIComponent(sanitizedSearchTerm)}`); // Navigate to the Card component with the search term
        }
    };

    const handleInputChange = (event) => {
        const value = event.target.value;
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
        setSearchTerm(sanitizedValue);

        if (value !== sanitizedValue) {
            setError("Only letters, numbers, and spaces are allowed.");
        } else {
            setError("");
        }
    };

    return (
        <>
            <div className="rent">
                <Link to='/home' style={{ textDecoration: 'none', position: 'absolute', top: '30rem', left: '-15rem', color: 'black' }}>
                    Renting your property?
                </Link>
            </div>
            <div className="SearchBar">
                <div className="logo">
                    <img src={image} alt="Company Rental logo" className='rental-logo' style={{ width: '500px', height: 'auto', position: 'absolute', top: '-1em', left: '30%' }} />
                </div>
                <div className="search-container">
                    <div className="searchbar">
                        <input 
                            type="text" 
                            placeholder="Enter Area" 
                            id="search" 
                            value={searchTerm}
                            onChange={handleInputChange} 
                        />
                        <CIcon icon={cilSearch} size="sm" customClassName={'icon'} height={40} onClick={handleSearch} />
                        {error && <p style={{ color: 'red', position:'relative',top:'22rem',left:'25rem' }}>{error}</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SearchBar;
