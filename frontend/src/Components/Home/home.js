import React, {useEffect, useRef, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../Navbar/navbar";
import './home.css';
import Axios from 'axios'

const image = require('../Images/coconut ..png')

const Home = () => {
    const [formData, setFormData] = useState({
        address: '',
        bedrooms: '',
        bathrooms: '',
        price: '',
        description: '',
        property_type: ''
    })
    const navigate = useNavigate()

    const [file, setFile] = useState()

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleImageChange = (e) => {
        setFile(e.target.files[0]);
      };

    const Submit = async(e) => {
        e.preventDefault()

        if (!file) {
            console.error('No image selected');
            return;
        }

        const userId = localStorage.getItem('workerId');
        
        const formDataWithFile = new FormData();
        formDataWithFile.append('users_id', userId); // Include the user ID
        formDataWithFile.append('address', formData.address);
        formDataWithFile.append('bedrooms', formData.bedrooms);
        formDataWithFile.append('bathrooms', formData.bathrooms);
        formDataWithFile.append('price', formData.price);
        formDataWithFile.append('description', formData.description);
        formDataWithFile.append('property_type', formData.property_type);
        formDataWithFile.append('image', file);
        
            try{
                const response = await Axios.post('http://localhost:3001/property_info', formDataWithFile, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if(response.status === 200){
                    console.log('Form sent')
                    navigate('/searchbar')
                }else{
                    console.error('Form not sent')
                }
            }catch (error){
                console.error('An error occured: ' + error)
            }
    }


    return(
        <>
            <header>
                <div className="header">
                    <Link to='/searchbar'><img src={image} alt="rental" style={{position:'relative', top:'-12em', left:'-8%', textAlign:'right'}}/></Link>
                </div>
            </header>
                <div>
                <form onSubmit={Submit}>
                    <div className="containers">
                        <div className="header">
                            <h1>List your rental property with us</h1>
                        </div>
                        <div className="input-container">
                            <div className="input">
                                <label>Street Address</label>
                                <input type="text" name="address" onChange={handleChange}/>
                            </div>
                            <div className="input">
                                <label>Bedrooms</label>
                                <select id="type" name="bedrooms" onChange={handleChange}>
                                    <option></option>
                                    <option value="one">1</option>
                                    <option value="two">2</option>
                                    <option value='three'>3+</option>
                                </select>
                            </div>
                            <div className="input">
                                <label>Bathrooms</label>
                                <select id="type" name="bathrooms" onChange={handleChange}>
                                    <option></option>
                                    <option value="one">1</option>
                                    <option value="two">2</option>
                                    <option value='three'>3+</option>
                                </select>
                            </div>
                            <div className="input">
                                <label>Price</label>
                                <input type='text' name='price' onChange={handleChange}/>
                            </div>
                            <div className="input">
                                <label>Description</label>
                                <textarea rows="4" cols="50" placeholder="Describer the property" style={{fontSize: '15px'}} name="description" onChange={handleChange}></textarea>
                            </div>
                            <div className="input">
                                <label>Property type</label>
                                <select id="type" name="property_type" onChange={handleChange}>
                                    <option></option>
                                    <option value="house">House</option>
                                    <option value="apartment">apartment</option>
                                    <option value="apartment">room</option>
                                    <option value="backroom">backroom</option>
                                </select>
                            </div>
                            <label>Upload images</label>
                            <input type="file" onChange={handleImageChange} name='images' />
                        </div>
                        <div className="button-container">
                            <button>submit</button>
                        </div>
                    </div>
                    </form>
            </div>
        </>
    )
}

export default Home