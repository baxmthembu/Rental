import React, {useState} from "react";
import {elastic as Menu} from 'react-burger-menu'
import { Link } from "react-router-dom";
import './navbar.css'

const NavBar = () => {
    return(
        <>
            <div className="bm-button-button"></div>
            <div className="bm-burger-bars"></div>
            <nav className="nav">
                <ul style={{textDecoration: 'none'}}>
                    <li>
                        <Link to='/home' className="menu-item">Home</Link>
                    </li>
                    <li>
                        <Link to='/about' className="menu-item">About</Link>
                    </li>
                    <li>
                        <Link to='/profile' className="menu-item">Profile</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default NavBar