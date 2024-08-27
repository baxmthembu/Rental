import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Axios from 'axios';
//import Logout from '../Logout/logout'
import Logout from '../Logout/logout';
import './home.css';

const Home = () => {
    const [formData, setFormData] = useState({
        address: '',
        bedrooms: '',
        bathrooms: '',
        price: '',
        description: '',
        property_type: ''
    });
    const [file, setFile] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const image = require("../Images/coconut ..png")

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Sanitize input to prevent malicious code
        const sanitizedValue = DOMPurify.sanitize(value);
        setFormData({ ...formData, [name]: sanitizedValue });
    };

    const handleImageChange = (e) => {
        // Validate and sanitize file input
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
        setError(''); // Clear error if files are valid
    };

    const Submit = async (e) => {
        e.preventDefault();

        if (file.length === 0) {
            setError('Please upload at least one image.');
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

        // Append each file to the form data
        file.forEach((file) => {
            formDataWithFile.append('images', file);
        });

        try {
            const response = await Axios.post('http://localhost:3001/property_info', formDataWithFile, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                console.log('Form sent');
                navigate('/searchbar');
            } else {
                console.error('Form not sent');
            }
        } catch (error) {
            console.error('An error occurred: ' + error);
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
                                    <option value="one">1</option>
                                    <option value="two">2</option>
                                    <option value="three">3+</option>
                                </select>
                            </div>
                            <div className="input">
                                <label>Bathrooms</label>
                                <select id="type" name="bathrooms" onChange={handleChange} required>
                                    <option></option>
                                    <option value="one">1</option>
                                    <option value="two">2</option>
                                    <option value="three">3+</option>
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
                            <button>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Home;