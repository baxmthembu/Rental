import React, { useState} from "react";
import {useNavigate, Link} from 'react-router-dom'
import Axios from 'axios';
import IsValidate from "../Validate/validate";


const Register = () => {
    const [formData ,setFormData] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s@.]/g, '');
        setFormData({ ...formData, [name]: sanitizedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationResponse = IsValidate(formData);

        if(validationResponse.isValid){
            try {
                const { ...dataToSend } = formData;
                const response = await Axios.post(`${process.env.REACT_APP_API_URL}/register`, dataToSend);

                if(response.status === 200){
                    console.log('Register Successful')
                    navigate('/login')
                    alert('Registration successful!');
                    
                }else{
                    console.error('Registration Failure')
                }
            }catch (error) {
                if (error.response && error.response.status === 400) {
                    setErrorMessage(error.response.data.msg);
                }
            }
        }else{
            setErrorMessage(validationResponse.errorMessage);
        }
    }

    return(
        <>
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="rounded-full bg-white bg-opacity-20 p-4 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                    </div>
      
                    {/* Header */}
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-white opacity-90">
                        Join Rentekasi to find your perfect home in South African townships
                    </p>
                </div>
            </section>

            {/* Form Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="max-w-md mx-auto">
                    <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 448 512">
                                            <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
                                        </svg>
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="focus:ring-sa-green focus:border-sa-green block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 512 512">
                                            <path fill="currentColor" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="off"
                                        className="focus:ring-sa-green focus:border-sa-green block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 448 512">
                                            <path fill="currentColor" d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/>
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete="off"
                                        className="focus:ring-sa-green focus:border-sa-green block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Create a password"
                                    />
                                </div>
                                {errorMessage && (
                                    <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sa-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sa-green transition duration-300"
                                >
                                    Create Account
                                </button>
                            </div>

                            {/* Sign In Link */}
                            <div className="text-center text-sm">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/" className="font-medium text-sa-green hover:text-green-700">
                                         Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Register