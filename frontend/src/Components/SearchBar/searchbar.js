import React, {useState} from "react";
import './searchbar.css';
import { CIcon } from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';

const logo = require("../Images/logo.png")

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("")

    return (
        <>
            <div className="SearchBar">
                <div className="logo">
                    <img src={logo} alt="Rental logo" className='rental-logo' style={{width: '500px',height:'auto',position:'absolute',top:'8em',left:'30%'}} />
                </div>
                <div className="search-container">
                    <div className="searchbar">
                        <input type="text" placeholder="Enter Area" id="search" onChange={(event) => {setSearchTerm(event.target.value)}} />
                        <CIcon icon={cilSearch} size="sm" customClassName={'icon'} height={40}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SearchBar