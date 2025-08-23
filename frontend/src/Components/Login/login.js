import React, { useContext, useState } from "react";
import Axios from "axios";
import { WorkerContext } from "../WorkerContext";
import { useNavigate, Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from "../../provider/authProvider";
import { setAuthToken } from "../utils/auth";

const logo = require('../Images/coconut-logo ..png')


const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const {setUser} = useContext(WorkerContext)
    const {setToken} = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [captchaValue, setCaptchaValue] = useState('');
    

    //Whitelist input define the allowed characters or patterns in each input field
    const nameRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+[.][A-Za-z.]{2,}$/;

    const Validate = (formData) => {
        const errors = {};
        if (!formData.email) {
            errors.email = 'Email is required';
        }else if (!nameRegex.test(formData.email)) {
            errors.email = 'Name can only contain letters';
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
            email: sanitizeInput(formData.email),
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
            /*const response = await Axios.post(`${process.env.REACT_APP_API_URL}/login`, sanitizedFormData)*/
            const response = await Axios.post('http://localhost:3001/login', sanitizedFormData)
            if(response.status === 200){
                console.log('logged in')
                const userId = response.data.user.id;
                const token = response.data.user.token
                localStorage.setItem('userId', userId)
                localStorage.setItem('token', 'Bearer ' + token)
                setUser({id: userId, role:'owner'})
                setToken(token)
                navigate('/home',{ replace: true })
            }
        }catch(error){
            if (error.response && error.response.status === 401) {
                setErrors({ password: 'Incorrect password or email' });
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
        {/*<div>
            <div className='register-container'>
            <div className="register-form">
                <form onSubmit={ProceedLogin} className="form">
                    <div className="register-logo">
                        <img src={logo} className='register-logo' alt="logo" />
                    </div>
                    <h1 className="header">Sign in</h1>
                    <div className="form-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="icon"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>
                        <input value={formData.email} onChange={handleChange} type="email" name="email" placeholder="Enter email" required /><br />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="form-container">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="icon"><path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>
                        <input value={formData.password} onChange={handleChange} type="password" name="password" placeholder="Enter password" required/><br /><br />
                        {errors.password && <span className="error-message2">{errors.password}</span>}
                    </div>
                    <div id="recaptcha">
                    <ReCAPTCHA
                        sitekey= "6Lc3CKYnAAAAAHjblBln1V7QStAE_H6kD5tYuMPl"
                        onChange={handleCaptchaChange}
                        className="recaptcha"
                    />
                    </div>
                    <div className="button">
                        <button disabled={isLoading} className="submit">
                            {isLoading ? 'Submitting...' : 'Sign in'}
                            
                        </button><br />
                        {isLoading && <div className="spinner">Loading...</div>}
                        <div id="create-account">
                        <p>or <Link to='/register' className="register-link">create account</Link></p>
                        </div>
                    </div>
                </form>
            </div>
            </div>
        </div>*/}
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-md">
    {/* Logo */}
    <div className="flex justify-center">
      <img src={logo} className="h-16 w-auto" alt="Rentekasi Logo" />
    </div>

    {/* Form Container */}
    <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
      <h1 className="text-3xl font-bold text-center text-sa-green mb-6">Sign in</h1>
      
      <form onSubmit={ProceedLogin} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-5 w-5 text-gray-400">
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
              className="focus:ring-sa-green focus:border-sa-green block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter email"
            />
          </div>
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-5 w-5 text-gray-400">
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
              className="focus:ring-sa-green focus:border-sa-green block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter password"
            />
          </div>
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
        </div>

        {/* ReCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey="6Lc3CKYnAAAAAHjblBln1V7QStAE_H6kD5tYuMPl"
            onChange={handleCaptchaChange}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-gray-400' : 'bg-sa-green hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sa-green`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </div>

        {/* Create Account Link */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-sa-green hover:text-green-700">
              Create one
            </Link>
          </p>
        </div>
      </form>
    </div>
  </div>
</div>
        </>
    )
}

export default Login