import React from "react";
import { Link } from "react-router-dom";
import './redirect.css'

const Redirect = () => {
    return(
        <div className="rent">
        <Link to="/home" style={{ textDecoration: "none", color: "black" }}>
            Renting your property? |
        </Link>
        <br />
        <Link to="/properties" style={{ textDecoration: "none", color: "black" }}>
            | Your listed properties
        </Link>
    </div>

    )
}

export default Redirect