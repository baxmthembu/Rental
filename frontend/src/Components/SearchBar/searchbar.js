import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import './searchbar.css';
import { CIcon } from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';

const logo = require("../Images/logo.png")
const image = require('../Images/coconut ..png')

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const handleSearch = () => {
        navigate(`/card?address=${searchTerm}`); // Navigate to the Card component with the search term
    };

    return (
        <>
            <div className="rent">
                <Link to='/home' style={{textDecoration:'none', position:'absolute', top:'30rem', left:'-15rem', color:'black'}}>Renting your property?</Link>
            </div>
            <div className="SearchBar">
                <div className="logo">
                    <img src={image} alt="Rental logo" className='rental-logo' style={{width: '500px',height:'auto',position:'absolute',top:'-1em',left:'30%'}} />
                </div>
                <div className="search-container">
                    <div className="searchbar">
                        <input type="text" placeholder="Enter Area" id="search" onChange={(event) => {setSearchTerm(event.target.value)}} />
                        <CIcon icon={cilSearch} size="sm" customClassName={'icon'} height={40} onClick={handleSearch}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchBar