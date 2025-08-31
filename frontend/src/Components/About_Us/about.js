import {useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/footer';
import Logout from '../Logout/logout';
import { LikedPropertiesContext } from '../LikedPropertiesContext/LikedPropertiesContext';

const image = require('../Images/bongumusa.png')
const image2 = require('../Images/uknown.jpg')
const AboutUs = () => {
    const { likedProperties } = useContext(LikedPropertiesContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <>
      {/* Navigation - Same as your other pages */}
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
                <Link to='/properties' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                <Link to='/favourites' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium relative">Saved Properties
                    {likedProperties.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {likedProperties.length}
                        </span>
                    )}
                </Link>
                <Link to="/financing" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Financing</Link>
                <Link to="/about" className="nav-link bg-sa-green text-white px-3 py-2 rounded-md text-sm font-medium">About</Link>
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
        {/* Mobile Menu */}
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
      <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Rentekasi</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Transforming township rentals through trust, technology, and community empowerment
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2023, Rentekasi was born out of a need to solve the housing challenges in South African townships. 
                Our founders, who grew up in townships themselves, saw firsthand the difficulties both tenants and landlords face.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                What started as a small project to connect neighbors has grown into South Africa's most trusted township rental platform, 
                serving communities from Soweto to Khayelitsha.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to have facilitated over 15,000 verified rentals and helped unlock R2.5 billion in property development financing.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 h-full">
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Township homes" 
                className="rounded-lg shadow-lg w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-sa-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Trust</h3>
              <p className="text-gray-600">
                We verify every listing and tenant to create safe, reliable rental experiences for all.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-sa-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Using technology to solve real problems in township housing markets.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-sa-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-600">
                We believe thriving communities start with secure, affordable housing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
                { name: "Bongumusa Mthembu", role: "CEO & Founder", img: image },
                { name: "Lungelo Mngadi", role: "COO", img: image2 },
                { name: "Vukile Masikane", role: "CTO", img: image2 },
            ].map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg text-center w-full sm:w-auto sm:max-w-xs">
                    <img src={member.img} alt={member.name} className="w-full h-64 object-cover" />
                    <div className="p-6">
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-sa-green font-medium">{member.role}</p>
                    </div>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sa-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Movement</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether you're looking for a home or have a property to list, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/home" 
              className="bg-sa-gold hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-md transition duration-300"
            >
              List Your Property
            </Link>
            <Link 
              to="/card" 
              className="border border-white hover:bg-white hover:text-sa-blue text-white font-bold py-3 px-8 rounded-md transition duration-300"
            >
              Find a Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Same as your other pages */}
      <Footer />
    </>
  );
};

export default AboutUs;