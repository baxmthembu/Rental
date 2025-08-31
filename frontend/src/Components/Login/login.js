import React, { useContext, useState } from "react";
import Axios from "axios";
import { WorkerContext } from "../WorkerContext";
import { useNavigate, Link } from "react-router-dom";
import DOMPurify from 'dompurify';
import { useAuth } from "../../provider/authProvider";

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


        if (!validationResponse.isValid) {
            setIsLoading(false);
            return;
        }
        try{
            const response = await Axios.post(`${process.env.REACT_APP_API_URL}/login`, sanitizedFormData)
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

    return(
      <>
       <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">RentEkasi</h1>
            <p className="text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto">
              Find your perfect home in South Africa township.
            </p>
          </div>
        </div>
      </section>

      {/* Login Form Section */}
      <div className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Form Container */}
          <div className="bg-white py-6 px-6 shadow-lg rounded-lg sm:px-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-sa-green mb-6">Sign in</h1>
    
            <form onSubmit={ProceedLogin} className="space-y-4 sm:space-y-6">
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
                    className="focus:ring-sa-green focus:border-sa-green block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter password"
                  />
                </div>
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-sa-green focus:ring-sa-green border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-sa-green hover:text-green-700">Forgot password?</Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-gray-400' : 'bg-sa-green hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sa-green transition duration-300`}
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
                  <Link to="/register" className="font-medium text-sa-green hover:text-green-700">Create one</Link>
                </p>
              </div>
            </form>
            
            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-300">
                    <span className="sr-only">Sign in with Facebook</span>
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-300">
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm.908 15.227c-2.86 0-5.18-2.32-5.18-5.18s2.32-5.18 5.18-5.18c1.396 0 2.6.527 3.537 1.382l-1.436 1.436c-.378-.36-.97-.694-2.101-.694-1.8 0-3.26 1.46-3.26 3.26s1.46 3.26 3.26 3.26c2.05 0 2.84-1.47 2.96-2.23h-2.96v-1.91h4.91c.05.23.09.46.09.73 0 2.82-1.89 4.73-5 4.73z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </>
  )
}

export default Login