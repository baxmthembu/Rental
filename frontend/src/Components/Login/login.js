import React, { useContext, useState } from "react";
import Axios from "axios";
//import Validate from "../Validate/workervalidate";
import { WorkerContext } from "../WorkerContext";
import { useNavigate, Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from "../../provider/authProvider";

const logo = require('../Images/coconut-logo ..png')


const Login = () => {
    const [, setIsLoading] = useState(false);
    const {setUser} = useContext(WorkerContext)
    const {setToken} = useAuth()
    const [formData, setFormData] = useState({
        name: '',
        password: ''
    })
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [captchaValue, setCaptchaValue] = useState('');

    //Whitelist input define the allowed characters or patterns in each input field
    const nameRegex = /^[a-zA-Z0-9 ]*$/;

    const Validate = (formData) => {
        const errors = {};
        if (!formData.name) {
            errors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            errors.name = 'Name must be at least 3 characters';
        }else if (!nameRegex.test(formData.name)) {
            errors.name = 'Name can only contain letters';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    //The DOMPurify.sanitize() function is applied to the form data before it is sent to the backend, 
    //preventing XSS attacks.
    const sanitizeInput = (value) => {
        return DOMPurify.sanitize(value);
    };


    const ProceedLogin = async(e) => {
        e.preventDefault()
        setIsLoading(true)

         // Sanitize input fields to prevent XSS attacks
         const sanitizedFormData = {
            name: sanitizeInput(formData.name),
            password: formData.password
        };

        const validationResponse = Validate(sanitizedFormData);
        setErrors(validationResponse.errors);


        if (!validationResponse.isValid || !captchaValue) {
            if (!captchaValue) {
                setErrors(prev => ({ ...prev, captcha: 'Please complete the CAPTCHA' }));
            }
            setIsLoading(false);
            return;
        }
        try{
                const response = await Axios.post(/*'http://localhost:3001/login'*/`${process.env.REACT_APP_API_URL}/login`, sanitizedFormData)
                if(response.status === 200){
                    console.log('logged in')
                    const userId = response.data.user.id;
                    const token = response.data.user.token
                    localStorage.setItem('userId', userId)
                    localStorage.setItem('token', 'Bearer ' + token)
                    setUser({id: userId, role:'owner'})
                    setToken(token)
                    navigate('/card',{ replace: true })
                }
        }catch(error){
            if (error.response && error.response.status === 401) {
                setErrors({ password: 'Incorrect password or username' });
            } else {
                console.error('Error:', error);
            }
        }finally{
            setIsLoading(false)
        }
    
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
      };


    return(
        <>
        <div>
            <div className='register-container'>
            <div className="register-form">
                <form onSubmit={ProceedLogin} className="form">
                    <div className="register-logo">
                        <img src={logo} className='register-logo' alt="logo" />
                    </div>
                    <h1 className="header">Sign in</h1>
                    <div className="form-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
                        <input value={formData.name} onChange={handleChange} type="text" name="name" placeholder="Enter name" required /><br />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div className="form-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
                        <input value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter password" required/><br /><br />
                        {errors.password && <span className="error-message2">{errors.password}</span>}
                    </div>
                    <ReCAPTCHA
                        sitekey="6Lc3CKYnAAAAAHjblBln1V7QStAE_H6kD5tYuMPl"
                        onChange={handleCaptchaChange}
                        className="recaptcha"
                    />
                    <div className="button">
                        <button type="submit" className="submit">Sign in</button><br />
                        <p>or <Link to='/register' className="register-link">create account</Link></p>
                    </div>
                </form>
            </div>
            </div>
        </div>
        </>
    )


}

export default Login