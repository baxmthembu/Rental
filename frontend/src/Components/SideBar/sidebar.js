import React from "react";
import { Link } from "react-router-dom";
import './sidebar.css'
import {elastic as Menu} from 'react-burger-menu';
import Logout from "../Logout/logout";

const Sidebar = () => {
    return(
        <>
        <div className="Sidebar">
            <Menu>  
                <div className="menus">
                    <ul id="menu-list" className="menu" style={{listStyle:'none', padding:0}}>
                        <li>
                            <Link to='/home' className="menu-item">Renting Your Property?</Link>
                        </li>
                        <li>
                            <Link to='/properties' className="menu-item">Your Listed Properties</Link>
                        </li>
                        <li className="logout">
                            <Logout className="menu-items" />
                        </li>
                    </ul>
                </div>
            </Menu>
        </div>
        </>
    )
}

export default Sidebar