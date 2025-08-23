import Logout from '../Logout/logout';
import './list_properties.css';
import React, { useState, useContext } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../Footer/footer';
import { LikedPropertiesContext } from '../LikedPropertiesContext/LikedPropertiesContext';

const ListProperties = () => {
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
    const { likedProperties } = useContext(LikedPropertiesContext);
    const navigate = useNavigate();

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
        const validTypes = ['image/jpeg', 'image/png', 'image/gif','video/mp4', 'video/webm'];
        const maxFileSize = 20 * 1024 * 1024; // 5MB

        for (let file of files) {
            if (!validTypes.includes(file.type)) {
                setError('Invalid file type. Please upload an image.');
                return;
            }
            if (file.size > maxFileSize) {
                setError('File size too large. Please upload files under 20MB.');
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
            formDataWithFile.append('media', file);
        });

        setLoading(true); // Start spinner
        try {
            const token = localStorage.getItem("token")
            const response = await Axios.post('http://localhost:3001/property_info'/*`${process.env.REACT_APP_API_URL}/property_info`*/, formDataWithFile, {
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
                toast.success("House has been listed successfully");
                setTimeout(() => {
                    navigate('/home')
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
        {/*<div className='home-container'>
            <div id='home-back'>
                <Link to='/card'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id='home-back-logo'><path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/></svg></Link>
            </div>
            <header>
                <div className="header">
                    <img src={image} alt="rental" id='header-img' />
                </div>
            </header>
            <div className='home-logout'>
                <Logout className="home-logout-button" />
            </div>
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
                                <input type='text' name='price' /*step="0.01" min="0"* onChange={handleChange} required/>
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
                            <input type="file" 
                            multiple onChange={handleImageChange} 
                            name='images'
                            accept="image/jpeg, image/png, image/gif, video/mp4, video/webm" 
                            required/>
                        </div>
                        {file.map((f, index) =>
                            f.type.startsWith("image/") ? (
                            <img key={index} src={URL.createObjectURL(f)} alt="preview" width="100" />
                            ) : (
                                <video key={index} width="150" controls>
                                    <source src={URL.createObjectURL(f)} type={f.type} />
                                    Your browser does not support the video tag.
                                </video>
                            )
                        )}
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
        </div>*/}
        <div>
  {/* Back Button */}
  {/*<div className="mb-6">
    <Link to="/card" className="flex items-center text-sa-green hover:text-green-700">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-6 h-6">
        <path fill="currentColor" d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM215 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L392 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-214.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L103 273c-9.4-9.4-9.4-24.6 0-33.9L215 127z"/>
      </svg>
      <span className="ml-2">Back to Properties</span>
    </Link>
  </div>*/}

  {/* Header Image */}
  {/*<header className="mb-8">
    <div className="rounded-lg overflow-hidden shadow-lg">
      <img src={image} alt="rental" className="w-full h-64 object-cover" />
    </div>
  </header>*/}

  {/* Logout Button - Positioned top right */}
  <div className="absolute top-4 right-4">
    <Logout className="text-sa-green hover:text-green-700" />
  </div>

  <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold text-sa-green">Rentekasi</h1>
                  <p className="text-xs text-gray-600">Trusted Township Rentals</p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/home" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Find Homes</Link>
                  <Link to="/list_properties" className="nav-link bg-sa-green text-white px-3 py-2 rounded-md text-sm font-medium">List Property</Link>
                  <Link to='/properties' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                  <Link to='/favourites' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium relative">Saved Properties
                    {likedProperties.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {likedProperties.length}
                      </span>
                    )}      
                  </Link>
                  <Link to="/financing" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Financing</Link>
                  <Link to="/about" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">About</Link>
                  <Link to="/login" className="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Sign In</Link>
                  <Logout />
                </div>
              </div>
            </div>
          </div>
        </nav>
  
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">For landlords</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              List your rental property with us and connect with trusted tenants in your community
            </p>
          </div>
        </section>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Form Container */}
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <form onSubmit={Submit} className="p-6">
      {/* Form Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-sa-green">List your rental property with us</h1>
      </div>

      {/* Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Street Address */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            name="address"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
          />
        </div>

        {/* Bedrooms */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
          <select
            name="bedrooms"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
          >
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        {/* Bathrooms */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <select
            name="bathrooms"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
          >
            <option value=""></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Price (R)</label>
          <input
            type="text"
            name="price"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
          />
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Property Type</label>
          <select
            name="property_type"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
          >
            <option value=""></option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="room">Room</option>
            <option value="backroom">Backroom</option>
          </select>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone_number"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
          />
        </div>
      </div>

      {/* Description - Full Width */}
      <div className="space-y-2 mb-6">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          rows="4"
          name="description"
          onChange={handleChange}
          placeholder="Describe the property"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
        ></textarea>
      </div>

      {/* File Upload */}
      <div className="space-y-2 mb-6">
        <label className="block text-sm font-medium text-gray-700">Upload images/videos</label>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          name="images"
          accept="image/jpeg, image/png, image/gif, video/mp4, video/webm"
          required
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-sa-green file:text-white hover:file:bg-green-700"
        />
      </div>

      {/* Preview Uploaded Files */}
      <div className="flex flex-wrap gap-4 mb-6">
        {file.map((f, index) =>
          f.type.startsWith("image/") ? (
            <img key={index} src={URL.createObjectURL(f)} alt="preview" className="w-24 h-24 object-cover rounded-md" />
          ) : (
            <video key={index} className="w-24 h-24 object-cover rounded-md" controls>
              <source src={URL.createObjectURL(f)} type={f.type} />
              Your browser does not support the video tag.
            </video>
          )
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Submit Button */}
      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-1/2 px-4 py-2 rounded-md font-medium text-white ${loading ? 'bg-gray-400' : 'bg-sa-green hover:bg-green-700'} transition duration-300`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Property'
          )}
        </button>
      </div>
    </form>
  </div>
  </div>

  <ToastContainer />
  <Footer />
</div>
        </>
    );
}

export default ListProperties;