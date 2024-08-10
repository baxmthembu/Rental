import React from "react";
import NavBar from "../Navbar/navbar";
import './home.css'

const Home = () => {

    return(
        <>
            <div>
                <div>
                    <NavBar />
                </div>
                <header>
                    <div className="containers">
                        <div className="header">
                            <h1>List your rental property with us</h1>
                        </div>
                        <div className="input-container">
                            <div className="input">
                                <label>Street Address</label>
                                <input type="text" name="address" />
                            </div>
                            <div className="input">
                                <label>Property type</label>
                                <select id="type" name="property_type">
                                    <option value="house">House</option>
                                    <option value="apartment">apartment</option>
                                    <option value="apartment">room</option>
                                </select>
                            </div>
                            <div className="input">
                                <label>Bedrooms</label>
                                <select id="type" name="bedrooms">
                                    <option value="one">1</option>
                                    <option value="two">2</option>
                                    <option value='three'>3+</option>
                                </select>
                            </div>
                            <div className="input">
                                <label>Bathrooms</label>
                                <select id="type" name="bathrooms">
                                    <option value="one">1</option>
                                    <option value="two">2</option>
                                    <option value='three'>3+</option>
                                </select>
                            </div>
                            <div className="input">
                                <label>Price</label>
                                <input type='text' name='price' />
                            </div>
                            <div className="input">
                                <label>Description</label>
                                <textarea rows="4" cols="50"></textarea>
                            </div>
                        </div>
                        <div className="button-container">
                            <button>submit</button>
                        </div>
                    </div>
                </header>
            </div>
        </>
    )
}

export default Home