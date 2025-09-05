// src/pages/Advertising.js
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/footer';
import { LikedPropertiesContext } from '../LikedPropertiesContext/LikedPropertiesContext';
import Logout from '../Logout/logout';

const Advertising = () => {
  const { likedProperties } = useContext(LikedPropertiesContext);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    website: '',
    budget: '',
    message: '',
    preferredContact: 'email'
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Advertising inquiry:', formData);

    try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/advertising-inquiry`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json",
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setIsSubmitted(true);
    } else {
      console.error('Failed to submit form');
    }
  } catch (error) {
    console.error('Error:', error);
  }
    
    // Simulate form submission
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        businessType: '',
        website: '',
        budget: '',
        message: '',
        preferredContact: 'email'
      });
    }, 3000);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navigation */}
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
                <Link to="/list_properties" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">List Property</Link>
                <Link to='/properties' className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                <Link to='/favourites' className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium relative">
                  Saved Properties {likedProperties.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {likedProperties.length}
                    </span>
                  )}
                </Link>
                <Link to="/financing" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Financing</Link>
                <Link to="/advertising" className="nav-link bg-sa-green text-white px-3 py-2 rounded-md text-sm font-medium">Advertising</Link>
                <Link to="/about" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">About</Link>
                <Link to="/login" className="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Sign In</Link>
                <Logout />
              </div>
            </div>
            <div className="md:hidden">
              <button 
                id="mobile-menu-btn" 
                className="text-gray-700 hover:text-sa-green focus:outline-none"
                onClick={toggleMobileMenu}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link to="/home" className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">Find Homes</Link>
            <Link to='/list_properties' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">List Property</Link>
            <Link to='/properties' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">Listed Properties</Link>
            <Link to='/favourites' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md flex items-center">
              Saved Properties
              {likedProperties.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {likedProperties.length}
                </span> 
              )}
            </Link>
            <Link to='/financing' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">Financing</Link>
            <Link to='/about' className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">About</Link>
            <div className="pt-2 border-t border-gray-200">
              <button className="w-20 text-left px-3 py-2 bg-sa-green text-white rounded-md hover:bg-green-700">
                <Link to="/login" className="block">Sign In</Link>
              </button>
              <div className="mt-2">
                <Logout />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sa-blue to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Advertise With RentEkasi</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Reach thousands of potential customers in South Africa's growing township rental market
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Advertise With Us?</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '👥',
                title: 'Targeted Audience',
                description: 'Reach landlords, tenants, and property investors specifically interested in township properties'
              },
              {
                icon: '📈',
                title: 'High Engagement',
                description: 'Our users actively browse properties and make rental decisions regularly'
              },
              {
                icon: '🏘️',
                title: 'Local Focus',
                description: 'Connect with communities in emerging township markets across South Africa'
              },
              {
                icon: '💰',
                title: 'Cost Effective',
                description: 'Competitive advertising rates with measurable ROI for your business'
              },
              {
                icon: '📱',
                title: 'Digital Presence',
                description: 'Modern platform with responsive design for desktop and mobile users'
              },
              {
                icon: '🤝',
                title: 'Trusted Platform',
                description: 'Partner with a verified and trusted name in township rentals'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertising Options */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Advertising Opportunities</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Banner Ads',
                price: 'From R1,500/month',
                features: ['Header banners', 'Sidebar placements', 'High visibility', 'CTR tracking']
              },
              {
                title: 'Sponsored Listings',
                price: 'From R2,000/month',
                features: ['Top placement', 'Featured properties', 'Premium branding', 'Increased clicks']
              },
              {
                title: 'Email Marketing',
                price: 'From R800/campaign',
                features: ['Targeted newsletters', 'Direct to inbox', 'Custom content', 'Performance analytics']
              },
              {
                title: 'Content Partnership',
                price: 'Custom Pricing',
                features: ['Blog features', 'Social media', 'Guest content', 'Brand integration']
              }
            ].map((option, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-sa-green text-2xl font-bold mb-4">{option.price}</p>
                <ul className="text-left space-y-2 mb-6">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-sa-gold text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition duration-300">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get Started Today</h2>
            <p className="text-xl text-gray-600">Fill out the form below and our team will contact you within 24 hours</p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
              <p className="text-lg font-semibold">Thank you for your interest!</p>
              <p>We'll contact you shortly to discuss advertising opportunities.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Contact Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                  >
                    <option value="">Select Business Type</option>
                    <option value="real_estate">Real Estate Agency</option>
                    <option value="banking">Banking/Financial Services</option>
                    <option value="insurance">Insurance</option>
                    <option value="home_services">Home Services</option>
                    <option value="retail">Retail Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Monthly Advertising Budget *</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="500-1000">R500 - R1,000</option>
                    <option value="1000-2500">R1,000 - R2,500</option>
                    <option value="2500-5000">R2,500 - R5,000</option>
                    <option value="5000-10000">R5,000 - R10,000</option>
                    <option value="10000+">R10,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Preferred Contact Method</label>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about your advertising goals and any specific requirements..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green"
                />
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full bg-sa-green text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 transition duration-300"
                >
                  Submit Advertising Inquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-sa-gold text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Monthly Visitors' },
              { number: '2,500+', label: 'Active Listings' },
              { number: '75%', label: 'Return Visitors' },
              { number: '48h', label: 'Avg Response Time' }
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Advertising;