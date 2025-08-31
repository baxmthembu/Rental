import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LikedPropertiesContext } from '../LikedPropertiesContext/LikedPropertiesContext';
import Footer from '../Footer/footer';
import Logout from '../Logout/logout';

const Financing = () => {
  // State for loan calculator
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTerm, setLoanTerm] = useState(5);
  const [interestRate, setInterestRate] = useState(9.5);
  const { likedProperties } = useContext(LikedPropertiesContext);
  
  // State for loan application
  const [applicationStep, setApplicationStep] = useState(0); // 0: not started, 1-4: steps, 5: results
  const [applicantData, setApplicantData] = useState({
    personal: {
      fullName: '',
      idNumber: '',
      email: '',
      phone: '',
      address: ''
    },
    financial: {
      employmentStatus: '',
      monthlyIncome: 0,
      monthlyExpenses: 0,
      creditScore: 'good',
      existingDebts: 0
    },
    property: {
      purchasePrice: 0,
      propertyType: 'residential',
      location: ''
    }
  });
  const [matchedBanks, setMatchedBanks] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  

  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // PMT formula: P * (r(1+r)^n) / ((1+r)^n - 1)
    const payment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    return payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = monthlyPayment * loanTerm * 12;
  const totalInterest = totalPayment - loanAmount;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle input changes for application form
  const handleInputChange = (section, field, value) => {
    setApplicantData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Bank matching algorithm
  const matchWithBanks = () => {
    const { financial, property } = applicantData;
    
    // Calculate debt-to-income ratio
    const debtToIncomeRatio = financial.existingDebts > 0 ? 
      (financial.existingDebts / financial.monthlyIncome) * 100 : 0;
    
    // Calculate loan-to-value ratio (assuming property price is the value)
    const loanToValueRatio = (loanAmount / property.purchasePrice) * 100;
    
    // Define bank criteria and offerings
    const banks = [
      {
        name: "Standard Bank",
        minCreditScore: "fair",
        maxDebtToIncome: 40,
        maxLoanToValue: 90,
        minIncome: 15000,
        interestRate: 9.5,
        specialFeatures: ["Quick approval process", "Online application tracking"],
        description: "Property development loans from R50,000",
        website: "https://www.standardbank.co.za/personal/products/credit/home-loans",
        icon: (
          <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )
      },
      {
        name: "FNB",
        minCreditScore: "good",
        maxDebtToIncome: 35,
        maxLoanToValue: 80,
        minIncome: 12000,
        interestRate: 9.2,
        specialFeatures: ["Relationship benefits", "Flexible repayment options"],
        description: "Competitive rates for township developments",
        website: "https://www.fnb.co.za/home-loans/",
        icon: (
          <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      },
      {
        name: "ABSA",
        minCreditScore: "fair",
        maxDebtToIncome: 45,
        maxLoanToValue: 95,
        minIncome: 10000,
        interestRate: 9.8,
        specialFeatures: ["Fast approval for qualified developers", "Construction loans available"],
        description: "Fast approval for qualified developers",
         website: "https://www.absa.co.za/personal/borrowing/home-loans/",
        icon: (
          <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        name: "Nedbank",
        minCreditScore: "excellent",
        maxDebtToIncome: 30,
        maxLoanToValue: 75,
        minIncome: 20000,
        interestRate: 8.9,
        specialFeatures: ["Green building incentives", "Wealth management services"],
        description: "Premium financing solutions",
        website: "https://www.nedbank.co.za/content/nedbankcoza/en/personal/loans/home-loans.html",
        icon: (
          <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        name: "Capitec",
        minCreditScore: "poor",
        maxDebtToIncome: 50,
        maxLoanToValue: 100,
        minIncome: 8000,
        interestRate: 11.5,
        specialFeatures: ["Accessible to lower credit scores", "Simple application process"],
        description: "Flexible terms for emerging developers",
        website: "https://www.capitecbank.co.za/personal/apply/home-loans/",
        icon: (
          <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      }
    ];

    // Credit score mapping to numerical values for comparison
    const creditScoreValues = {
      'poor': 0,
      'fair': 1,
      'good': 2,
      'excellent': 3
    };

    // Find matching banks based on criteria
    const matches = banks.filter(bank => {
      return (
        creditScoreValues[financial.creditScore] >= creditScoreValues[bank.minCreditScore] &&
        debtToIncomeRatio <= bank.maxDebtToIncome &&
        loanToValueRatio <= bank.maxLoanToValue &&
        financial.monthlyIncome >= bank.minIncome
      );
    });

    // Sort by best interest rate
    matches.sort((a, b) => a.interestRate - b.interestRate);
    
    setMatchedBanks(matches);
    setApplicationStep(5);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    matchWithBanks();
  };

  // Render the appropriate step of the application process
  const renderApplicationStep = () => {
    switch(applicationStep) {
      case 0:
        return (
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-center mb-6">Loan Application</h3>
            <p className="text-gray-600 mb-6 text-center">
              Our quick application process will help match you with the best financing options 
              from our trusted banking partners.
            </p>
            <div className="bg-sa-green text-white p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2">What You'll Need:</h4>
              <ul className="list-disc list-inside text-sm">
                <li>Personal identification details</li>
                <li>Income information (payslips or financial statements)</li>
                <li>Property details (if you've already selected one)</li>
                <li>Information about existing debts or obligations</li>
              </ul>
            </div>
            <button 
              onClick={() => setApplicationStep(1)}
              className="w-full bg-sa-gold hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-md transition duration-300"
            >
              Start Application
            </button>
          </div>
        );
      
      case 1:
        return (
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-center mb-6">Personal Information</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                setApplicationStep(2);}}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.personal.fullName}
                    onChange={(e) => handleInputChange('personal', 'fullName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">ID Number</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.personal.idNumber}
                    onChange={(e) => handleInputChange('personal', 'idNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.personal.email}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Residential Address</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.personal.address}
                    onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button 
                  type="button"
                  onClick={() => setApplicationStep(0)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="bg-sa-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        );
      
      case 2:
        return (
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-center mb-6">Financial Information</h3>
            <form onSubmit={(e) => {
                e.preventDefault()
                setApplicationStep(3)}}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Employment Status</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.financial.employmentStatus}
                    onChange={(e) => handleInputChange('financial', 'employmentStatus', e.target.value)}
                    required
                  >
                    <option value="">Select Employment Status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="retired">Retired</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Monthly Income (R)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.financial.monthlyIncome}
                    onChange={(e) => handleInputChange('financial', 'monthlyIncome', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Monthly Expenses (R)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.financial.monthlyExpenses}
                    onChange={(e) => handleInputChange('financial', 'monthlyExpenses', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Credit Score Estimate</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.financial.creditScore}
                    onChange={(e) => handleInputChange('financial', 'creditScore', e.target.value)}
                    required
                  >
                    <option value="poor">Poor (Below 580)</option>
                    <option value="fair">Fair (580-669)</option>
                    <option value="good">Good (670-739)</option>
                    <option value="excellent">Excellent (740-850)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Existing Monthly Debt Payments (R)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.financial.existingDebts}
                    onChange={(e) => handleInputChange('financial', 'existingDebts', parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button 
                  type="button"
                  onClick={() => setApplicationStep(1)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="bg-sa-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        );
      
      case 3:
        return (
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-center mb-6">Property Information</h3>
            <form onSubmit={(e) => {
                e.preventDefault()
                setApplicationStep(4)}}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Property Purchase Price (R)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.property.purchasePrice}
                    onChange={(e) => handleInputChange('property', 'purchasePrice', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Property Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.property.propertyType}
                    onChange={(e) => handleInputChange('property', 'propertyType', e.target.value)}
                    required
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Property Location</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={applicantData.property.location}
                    onChange={(e) => handleInputChange('property', 'location', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Desired Loan Amount (R)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Desired Loan Term (Years)</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                    required
                  >
                    <option value="1">1 Year</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="10">10 Years</option>
                    <option value="15">15 Years</option>
                    <option value="20">20 Years</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <button 
                  type="button"
                  onClick={() => setApplicationStep(2)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="bg-sa-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        );
      
      case 4:
        return (
          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-center mb-6">Review Your Application</h3>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h4 className="font-bold text-lg mb-4">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Name:</span> {applicantData.personal.fullName}</div>
                <div><span className="font-medium">ID:</span> {applicantData.personal.idNumber}</div>
                <div><span className="font-medium">Email:</span> {applicantData.personal.email}</div>
                <div><span className="font-medium">Phone:</span> {applicantData.personal.phone}</div>
                <div className="col-span-2"><span className="font-medium">Address:</span> {applicantData.personal.address}</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h4 className="font-bold text-lg mb-4">Financial Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Employment:</span> {applicantData.financial.employmentStatus}</div>
                <div><span className="font-medium">Monthly Income:</span> {formatCurrency(applicantData.financial.monthlyIncome)}</div>
                <div><span className="font-medium">Monthly Expenses:</span> {formatCurrency(applicantData.financial.monthlyExpenses)}</div>
                <div><span className="font-medium">Credit Score:</span> {applicantData.financial.creditScore}</div>
                <div><span className="font-medium">Existing Debts:</span> {formatCurrency(applicantData.financial.existingDebts)}</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h4 className="font-bold text-lg mb-4">Property Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Purchase Price:</span> {formatCurrency(applicantData.property.purchasePrice)}</div>
                <div><span className="font-medium">Property Type:</span> {applicantData.property.propertyType}</div>
                <div className="col-span-2"><span className="font-medium">Location:</span> {applicantData.property.location}</div>
                <div><span className="font-medium">Loan Amount:</span> {formatCurrency(loanAmount)}</div>
                <div><span className="font-medium">Loan Term:</span> {loanTerm} years</div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setApplicationStep(3)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                className="bg-sa-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Application
              </button>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8 mt-8">
            <h3 className="text-2xl font-bold text-center mb-6">Your Matched Lenders</h3>
            
            {matchedBanks.length > 0 ? (
              <div>
                <div className="bg-sa-green text-white p-4 rounded-lg mb-6">
                  <p className="text-center">
                    Based on your financial profile, we've found {matchedBanks.length} lender{matchedBanks.length !== 1 ? 's' : ''} that match your needs.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {matchedBanks.map((bank, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                          {bank.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{bank.name}</h4>
                          <p className="text-sm text-gray-600">{bank.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Estimated Interest Rate</p>
                          <p className="text-lg font-bold">{bank.interestRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Estimated Monthly Payment</p>
                          <p className="text-lg font-bold">{formatCurrency(monthlyPayment)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Special Features:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {bank.specialFeatures.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {/*<button className="w-full bg-sa-gold hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300">
                        Apply with {bank.name}
                      </button>*/}
    
                      <a 
                        href={bank.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-sa-gold hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md transition duration-300 text-center cursor-pointer"
                      >
                        Apply with {bank.name}
                      </a>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setApplicationStep(0)}
                    className="bg-sa-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                  >
                    Start New Application
                  </button>
                  <button 
                    onClick={() => setApplicationStep(0)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Back to Calculator
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                  <p className="text-center">
                    Based on the information provided, we couldn't find any lenders that match your current financial profile.
                  </p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <h4 className="font-bold mb-2">Suggestions to improve your eligibility:</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Work on improving your credit score</li>
                    <li>Reduce your existing debt obligations</li>
                    <li>Consider a larger down payment to lower your loan-to-value ratio</li>
                    <li>Explore properties in a lower price range</li>
                  </ul>
                </div>
                <div className="text-center">
                  <button 
                    onClick={() => setApplicationStep(0)}
                    className="bg-sa-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Try Again with Different Information
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav class="bg-white shadow-lg sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <h1 class="text-2xl font-bold text-sa-green">Rentekasi</h1>
                                <p class="text-xs text-gray-600">Trusted Township Rentals</p>
                            </div>
                        </div>
                        <div class="hidden md:block">
                            <div class="ml-10 flex items-baseline space-x-4">
                                <a href="/home" class="nnav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Find Homes</a>
                                <Link to='/list_properties' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">List Property</Link>
                                <Link to='/properties' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">Listed Properties</Link>
                                <Link to='/favourites' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium relative">
                                Saved Properties {likedProperties.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform transition-all duration-300 scale-100 hover:scale-110">
                                        {likedProperties.length}
                                </span> )}</Link>
                                <Link to='#' class="nav-link bg-sa-green text-white px-3 py-2 rounded-md text-sm font-medium">Financing</Link>
                                <Link to='/about' class="nav-link text-gray-700 hover:text-sa-green px-3 py-2 rounded-md text-sm font-medium">About</Link>
                                <button class="bg-sa-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"><Link to="/">Sign In</Link></button>
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
                        <a href="#" className="block px-3 py-2 text-gray-700 hover:text-sa-green hover:bg-gray-100 rounded-md">Find Homes</a>
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
                                <Logout />/
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sa-green to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Property Financing Solutions</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Access funding for your rental property developments with our trusted banking partners
          </p>
        </div>
      </section>

      {/* Financing Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Financing Partners</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Standard Bank",
                description: "Property development loans from R50,000",
                icon: (
                  <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                name: "FNB",
                description: "Competitive rates for township developments",
                icon: (
                  <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                name: "ABSA",
                description: "Fast approval for qualified developers",
                icon: (
                  <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                name: "Alternative Lenders",
                description: "Flexible terms for emerging developers",
                icon: (
                  <svg className="w-8 h-8 text-sa-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                )
              }
            ].map((partner, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {partner.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{partner.name}</h3>
                <p className="text-gray-600">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Our Financing Works</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Apply Online",
                description: "Complete our simple application form with your project details"
              },
              {
                step: "2",
                title: "Get Matched",
                description: "We connect you with the best financing options from our partners"
              },
              {
                step: "3",
                title: "Receive Funding",
                description: "Get approved and access your funds to start developing"
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-sa-green rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-center mb-2">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loan Calculator</h2>
            <div className="w-20 h-1 bg-sa-gold mx-auto"></div>
          </div>

          <div className="max-w-2xl mx-auto bg-gray-50 rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Loan Amount (R): {formatCurrency(loanAmount)}
                </label>
                <input 
                  type="range" 
                  min="50000" 
                  max="5000000" 
                  step="50000" 
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>R50,000</span>
                  <span>R5,000,000</span>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Term (Years)</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                >
                  <option value="1">1 Year</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Interest Rate (%): {interestRate}%
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="20" 
                  step="0.5" 
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>5%</span>
                  <span>20%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-sa-green text-white p-4 rounded-lg">
              <h3 className="font-bold mb-2">Estimated Monthly Payment</h3>
              <p className="text-2xl">{formatCurrency(monthlyPayment)}</p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm">Total Loan Amount</p>
                  <p className="font-medium">{formatCurrency(loanAmount)}</p>
                </div>
                <div>
                  <p className="text-sm">Total Interest</p>
                  <p className="font-medium">{formatCurrency(totalInterest)}</p>
                </div>
                <div>
                  <p className="text-sm">Total Payment</p>
                  <p className="font-medium">{formatCurrency(totalPayment)}</p>
                </div>
                <div>
                  <p className="text-sm">Loan Term</p>
                  <p className="font-medium">{loanTerm} years</p>
                </div>
              </div>
              <p className="text-xs mt-2">*Calculations are estimates only</p>
            </div>
            
            {/*<button 
              onClick={() => setApplicationStep(1)}
              className="w-full mt-6 bg-sa-gold hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-md transition duration-300"
            >
              Apply Now
            </button>*/}
          </div>
        </div>
      </section>

      {/* Loan Application Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderApplicationStep()}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-sa-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Develop Your Property?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our team is ready to help you find the perfect financing solution for your township property development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setApplicationStep(1)}
              className="bg-sa-gold hover:bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-md transition duration-300"
            >
              Apply for Financing
            </button>
            <button className="border border-white hover:bg-white hover:text-sa-blue text-white font-bold py-3 px-8 rounded-md transition duration-300">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Same as your other pages */}
      <Footer />
    </>
  );
};

export default Financing;