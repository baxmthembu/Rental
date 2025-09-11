import { useState, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../Footer/footer';
import { LikedPropertiesContext } from '../LikedPropertiesContext/LikedPropertiesContext';
import html2pdf from 'html2pdf.js';
import Logout from '../Logout/logout';
 
const LeaseAgreement = () => {
  const [activeTab, setActiveTab] = useState('residential');
  const { likedProperties } = useContext(LikedPropertiesContext);
  const [formData, setFormData] = useState({
    landlordName: '',
    landlordId: '',
    landlordAddress: '',
    tenantName: '',
    tenantId: '',
    tenantAddress: '',
    propertyAddress: '',
    monthlyRent: '',
    depositAmount: '',
    startDate: '',
    endDate: '',
    additionalClauses: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const leaseRef = useRef();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to handle downloading the lease agreement as PDF
  const downloadLeaseAgreement = async () => {
    setIsSubmitting(true);


    try {
      // Save the agreement to the database first
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/lease-agreements`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...formData,
          agreementType: activeTab,
          generatedDate: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save agreement to database');
      }

      const result = await response.json();
      const agreementId = result.id;

      // Generate PDF
      const element = leaseRef.current;
      const opt = {
        margin: 10,
        filename: `RentEkasi_Lease_Agreement_${agreementId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Generate and download PDF
      html2pdf().set(opt).from(element).save();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate agreement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <Link to='/properties' className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                <Link to='/favourites' className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium relative">
                  Saved Properties 
                  {likedProperties.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {likedProperties.length}
                    </span>
                  )}
                </Link>
                <Link to="/financing" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Financing</Link>
                <Link to="/about" className="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">About</Link>
                <Link to="/" className="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Sign In</Link>
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
                <Link to="/" className="block">Sign In</Link>
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Lease Agreement Templates</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Professionally drafted, legally compliant lease agreements for South African rental properties
          </p>
        </div>
      </section>

      {/* Agreement Types */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Agreement Type</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setActiveTab('residential')}
                className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                  activeTab === 'residential'
                    ? 'bg-sa-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Residential Lease
              </button>
              <button
                onClick={() => setActiveTab('commercial')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'commercial'
                    ? 'bg-sa-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Commercial Lease
              </button>
              <button
                onClick={() => setActiveTab('room')}
                className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                  activeTab === 'room'
                    ? 'bg-sa-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Room Rental
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Standard Residential Lease",
                description: "Comprehensive agreement for houses, apartments, and townhouses",
                price: "Free",
                features: ["Compliant with Rental Housing Act", "12-month standard term", "Customizable clauses", "Deposit terms included"],
                type: "residential"
              },
              {
                name: "Commercial Property Lease",
                description: "For retail, office, and industrial rental spaces",
                price: "R150",
                features: ["Business terms included", "Customizable for industry", "Maintenance responsibilities", "CPI escalation clause"],
                type: "commercial"
              },
              {
                name: "Room Rental Agreement",
                description: "For renting individual rooms in a shared property",
                price: "Free",
                features: ["Shared spaces rules", "Utilities allocation", "House rules section", "Privacy terms"],
                type: "room"
              }
            ].filter(agreement => agreement.type === activeTab).map((agreement, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">{agreement.name}</h3>
                <p className="text-gray-600 mb-4">{agreement.description}</p>
                <div className="text-2xl font-bold text-sa-green mb-4">{agreement.price}</div>
                <ul className="text-left space-y-2 mb-6">
                  {agreement.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={downloadLeaseAgreement}
                  disabled={isSubmitting}
                  className="w-full bg-sa-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Generating...' : 'Download Template'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Agreement Preview</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
            <p className="text-gray-600 mt-4">Preview of our standard residential lease agreement template</p>
          </div>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-sa-green text-white py-4 px-6">
              <h3 className="text-xl font-bold">RESIDENTIAL LEASE AGREEMENT TEMPLATE</h3>
            </div>
            
            <div className="p-6 md:p-8 h-96 overflow-y-auto bg-gray-50">
              <div className="agreement-content bg-white p-6 shadow-inner rounded-lg" ref={leaseRef}>
                <h4 className="text-lg font-bold text-center mb-6">RESIDENTIAL LEASE AGREEMENT</h4>
                
                <p className="text-sm mb-4"><strong>This Lease Agreement</strong> is made and entered into on {new Date().toLocaleDateString('en-ZA')}, by and between:</p>
                
                <p className="text-sm mb-2"><strong>LANDLORD:</strong></p>
                <p className="text-sm mb-2">Name: {formData.landlordName || '[Landlord\'s Full Name]'}</p>
                <p className="text-sm mb-2">ID Number: {formData.landlordId || '[Landlord\'s ID Number]'}</p>
                <p className="text-sm mb-4">Address: {formData.landlordAddress || '[Landlord\'s Physical Address]___________________'}</p>
                
                <p className="text-sm mb-2"><strong>TENANT:</strong></p>
                <p className="text-sm mb-2">Name: {formData.tenantName || '[Tenant\'s Full Name]'}</p>
                <p className="text-sm mb-2">ID Number: {formData.tenantId || '[Tenant\'s ID Number]'}</p>
                <p className="text-sm mb-6">Address: {formData.tenantAddress || '[Tenant\'s Physical Address]___________________'}</p>
                
                <h5 className="text-md font-bold mb-2">1. LEASED PROPERTY</h5>
                <p className="text-sm mb-4">The Landlord hereby leases to the Tenant the residential property situated at {formData.propertyAddress || '[Rental Property Address]'}, South Africa (hereinafter referred to as "the Premises").</p>
                
                <h5 className="text-md font-bold mb-2">2. LEASE TERM</h5>
                <p className="text-sm mb-4">The lease shall be for a fixed term of ___________________ months, commencing on {formData.startDate || '[Start Date]'} and terminating on {formData.endDate || '[End Date]'}.</p>
                
                <h5 className="text-md font-bold mb-2">3. RENTAL AMOUNT AND PAYMENT</h5>
                <p className="text-sm mb-2">3.1 The monthly rental amount shall be {formData.monthlyRent ? `R${formData.monthlyRent}` : 'R[Monthly Rental Amount]'}, payable in advance on or before the first day of each calendar month.</p>
                <p className="text-sm mb-4">3.2 Payments shall be made via electronic transfer to the following account: ___________________, Account Number: ___________________, Branch Code: ___________________.</p>
                
                <h5 className="text-md font-bold mb-2">4. DEPOSIT</h5>
                <p className="text-sm mb-4">The Tenant shall pay a security deposit of {formData.depositAmount ? `R${formData.depositAmount}` : 'R[Deposit Amount]'} upon signing this agreement. This deposit shall be held by the Landlord as security for any damages to the Premises or outstanding amounts owed by the Tenant.</p>
                
                <h5 className="text-md font-bold mb-2">5. UTILITIES</h5>
                <p className="text-sm mb-4">The Tenant shall be responsible for payment of all utilities and services consumed on the Premises, including but not limited to electricity, water, sanitation, and telecommunications services.</p>
                
                {formData.additionalClauses && (
                  <>
                    <h5 className="text-md font-bold mb-2">6. ADDITIONAL CLAUSES</h5>
                    <p className="text-sm mb-4">{formData.additionalClauses}</p>
                  </>
                )}
                
                <p className="text-sm mb-4 text-center">... continued in full version ...</p>

                <div className="signature-area mt-12">
                  <div className="flex justify-between">
                    <div>
                      <p>Landlord Signature</p>
                      <div className="signature-line"></div>
                      <p className="text-xs mt-2">Date: ___________________</p>
                    </div>
                    <div>
                      <p>Tenant Signature</p>
                      <div className="signature-line"></div>
                      <p className="text-xs mt-2">Date: ___________________</p>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <p>Witness Signature</p>
                    <div className="signature-line mx-auto"></div>
                    <p className="text-xs mt-2">Date: ___________________</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 py-4 px-6 flex justify-between items-center">
              <span className="text-sm text-gray-600">Preview of standard residential lease agreement</span>
              <button 
                onClick={downloadLeaseAgreement}
                disabled={isSubmitting}
                className="bg-sa-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {isSubmitting ? 'Generating...' : 'Download Full Agreement'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Customize Your Agreement</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
            <p className="text-gray-600 mt-4">Add specific terms and conditions to meet your unique rental situation</p>
          </div>

          <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Landlord's Full Name</label>
                <input 
                  type="text" 
                  name="landlordName"
                  value={formData.landlordName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                  placeholder="Enter full name" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Tenant's Full Name</label>
                <input 
                  type="text" 
                  name="tenantName"
                  value={formData.tenantName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                  placeholder="Enter full name" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Landlord's ID Number</label>
                <input 
                  type="text" 
                  name="landlordId"
                  value={formData.landlordId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                  placeholder="Enter ID number" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Tenant's ID Number</label>
                <input 
                  type="text" 
                  name="tenantId"
                  value={formData.tenantId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                  placeholder="Enter ID number" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Property Address</label>
                <input 
                  type="text" 
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                  placeholder="Full rental property address" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Monthly Rent (ZAR)</label>
                <input 
                  type="number" 
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                  placeholder="Amount in Rands" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Deposit Amount (ZAR)</label>
                <input 
                  type="number" 
                  name="depositAmount"
                  value={formData.depositAmount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                  placeholder="Amount in Rands" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Lease Start Date</label>
                <input 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Lease End Date</label>
                <input 
                  type="date" 
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Additional Clauses (Optional)</label>
                <textarea 
                  name="additionalClauses"
                  value={formData.additionalClauses}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sa-green" 
                  rows="4" 
                  placeholder="Enter any special terms or conditions"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <button 
                  type="button" 
                  onClick={downloadLeaseAgreement}
                  disabled={isSubmitting}
                  className="w-full bg-sa-green hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Generating Agreement...' : 'Generate & Download Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default LeaseAgreement;
