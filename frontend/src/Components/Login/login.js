import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../provider/authProvider";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { setUser } = useAuth();
    
    // Simplified email regex for basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateForm = useCallback((data) => {
        const newErrors = {};
        
        if (!data.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(data.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!data.password) {
            newErrors.password = 'Password is required';
        } else if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors
        };
    }, []);

    // Simple input sanitization for better performance
    const sanitizeInput = useCallback((value) => {
        return typeof value === 'string' ? value.trim().replace(/[<>]/g, '') : '';
    }, []);

    const ProceedLogin = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Sanitize input fields
        const sanitizedFormData = {
            email: sanitizeInput(formData.email),
            password: formData.password
        };

        const validationResponse = validateForm(sanitizedFormData);
        setErrors(validationResponse.errors);

        if (!validationResponse.isValid) {
            setIsLoading(false);
            return;
        }
        
        try {
            // Use fetch instead of Axios for better performance
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(sanitizedFormData)
            });
            
            if (response.ok) {
                const userData = await response.json();
                const userId = userData.user.id;
                
                localStorage.setItem('userId', userId);
                setUser(userData.user);
                navigate('/home', { replace: true });
            } else if (response.status === 401) {
                setErrors({ password: 'Incorrect password or email' });
            } else {
                setErrors({ password: 'Login failed. Please try again.' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ password: 'Network error. Please check your connection.' });
        } finally {
            setIsLoading(false);
        }
    }, [formData, sanitizeInput, validateForm, setUser, navigate]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear errors for this field as user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    return (
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
                                    <Link to='/forgot-password' className="font-medium text-sa-green hover:text-green-700">Forgot password?</Link>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login