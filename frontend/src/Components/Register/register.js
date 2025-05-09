import React, { useState} from "react";
import {useNavigate, Link} from 'react-router-dom'
import './register.css';
import Axios from 'axios';
import IsValidate from "../Validate/validate";



const image = require('../Images/coconut-logo ..png')

const Register = () => {
    const [formData ,setFormData] = useState({
        email: '',
        password: '',
        password2: ''
    })
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();


    const handleChange = (e) => {
        const {email, value} = e.target;
        const sanitizedValue = value.replace(/[^a-zA-Z0-9\s@.]/g, '');
        setFormData({ ...formData, [email]: sanitizedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationResponse = IsValidate(formData);

        if(validationResponse.isValid){
            try {
                const { password2, ...dataToSend } = formData;
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
        <div>
            <div className='register-container'>
            <div className="register-form">
                <form onSubmit={handleSubmit} className="form">
                    <div className="register-logo">
                        <img src={image} className='register-logo-img' alt="logo" />
                    </div>
                    <h1 className="header">Sign up</h1>
                    <div className="form-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
                        <input value={formData.name} onChange={handleChange} type="text" name="name" placeholder="Enter name" required/>
                    </div>
                    <div className="form-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
                        <input value={formData.email} onChange={handleChange} type="email" name="email" placeholder="Enter email" required autoComplete="off"/>
                    </div>
                    <div className="form-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
                        <input value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter password" required autoComplete="off" />
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </div>
                    <div className="button">
                        <button type="submit" className="submit">Submit</button>
                        <p>Already have account? <Link to='/' className="register-link">Sign in</Link></p>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </>
    )
}

export default Register