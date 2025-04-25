import Logout from '../Logout/logout';
import './home.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [formData, setFormData] = useState({
        address: '',
        bedrooms: '',
        bathrooms: '',
        price: '',
        description: '',
        phone_number: '',
        email: '',
        property_type: '',
    });
    const [file, setFile] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Spinner state
    const navigate = useNavigate();

    const image = require("../Images/coconut ..png");

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: name === 'bedrooms' || name === 'bathrooms' ? parseInt(sanitizedValue, 10) || '' : sanitizedValue, // Parse numeric fields
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        for (let file of files) {
            if (!validTypes.includes(file.type)) {
                setError('Invalid file type. Please upload an image.');
                return;
            }
            if (file.size > maxFileSize) {
                setError('File size too large. Please upload files under 5MB.');
                return;
            }
        }

        setFile(files);
        setError('');
    };

    const Submit = async (e) => {
        e.preventDefault();

        if (file.length === 0) {
            setError('Please upload at least one image.');
            return;
        }

        const userId = localStorage.getItem('userId');
        const formDataWithFile = new FormData();
        formDataWithFile.append('users_id', userId);
        formDataWithFile.append('address', formData.address);
        formDataWithFile.append('bedrooms', parseInt(formData.bedrooms, 10));
        formDataWithFile.append('bathrooms', parseInt(formData.bathrooms, 10));
        formDataWithFile.append('price', formData.price);
        formDataWithFile.append('description', formData.description);
        formDataWithFile.append('phone_number', formData.phone_number);
        formDataWithFile.append('email', formData.email);
        formDataWithFile.append('property_type', formData.property_type);

        file.forEach((file) => {
            formDataWithFile.append('images', file);
        });

        setLoading(true); // Start spinner
        try {
            const token = localStorage.getItem("token")
            const response = await Axios.post(/*'http://localhost:3001/property_info'*/`${process.env.REACT_APP_API_URL}/property_info`, formDataWithFile, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token.trim()}`
                },
            });

            if (isNaN(formData.bedrooms) || isNaN(formData.bathrooms)) {
                setError('Please select valid numbers for bedrooms and bathrooms.');
                return;
            }            

            if (response.status === 200) {
                toast.success("Form Submitted Successfully");
                setTimeout(() => {
                    navigate('/card')
                }, "5000");
            } else {
                toast.error("Form Not Submitted");
            }
        } catch (error) {
            toast.error('An error occurred while submitting the form.');
        } finally {
            setLoading(false); // Stop spinner
        }
    };

    return (
        <>
            <header>
                <div className="header">
                    <Link to='/card' className='logo-link'>
                        <img src={image} alt="rental" style={{ position: 'relative', top: '-12em', left: '-8%', textAlign: 'right' }} />
                    </Link>
                </div>
            </header>
            <Logout />
            <div>
                <form onSubmit={Submit}>
                    <div className="containers">
                        <div className="header">
                            <h1>List your rental property with us</h1>
                        </div>
                        <div className="input-container">
                            <div className="input">
                                <label>Street Address</label>
                                <input type="text" name="address" onChange={handleChange} required/>
                            </div>
                            <div className="input">
                                <label>Bedrooms</label>
                                <select id="type" name="bedrooms" onChange={handleChange} required>
                                    <option></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                            <div className="input">
                                <label>Bathrooms</label>
                                <select id="type" name="bathrooms" onChange={handleChange} required>
                                    <option></option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                            <div className="input">
                                <label>Price</label>
                                <input type='text' name='price' /*step="0.01" min="0"*/ onChange={handleChange} required/>
                            </div>
                            <div className="input">
                                <label>Description</label>
                                <textarea rows="4" cols="50" placeholder="Describe the property" style={{ fontSize: '15px' }} name="description" onChange={handleChange}></textarea>
                            </div>
                            <div className="input">
                                <label>Phone Number</label>
                                <input type='tel' name='phone_number' onChange={handleChange} required/>
                            </div>   
                            <div className="input">
                                <label>Email</label>
                                <input type='email' name='email' onChange={handleChange} required/>
                            </div>              
                            <div className="input">
                                <label>Property type</label>
                                <select id="type" name="property_type" onChange={handleChange} required>
                                    <option></option>
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                    <option value="room">Room</option>
                                    <option value="backroom">Backroom</option>
                                </select>
                            </div>
                            <label>Upload images</label>
                            <input type="file" multiple onChange={handleImageChange} name='images' required/>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="button-container">
                            <button type='submit' disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                            {loading && <div className="spinner">Loading...</div>}
                        </div>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </>
    );
}

export default Home;