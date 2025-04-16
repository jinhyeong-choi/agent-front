import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { formatTokens } from '@/utils/formatting';
import { post } from '@/utils/api';
import { updateTokenBalance } from '@/features/auth/authSlice';
import { PAYMENT_METHODS, TOKEN_PACKAGES } from '@/config/constatns';

interface PaymentMethod {
  id: string;
  name: string;
}

const BillingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  
  // State for the billing form
  const [selectedPackage, setSelectedPackage] = useState<number>(1); // Default to second package (index 1)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Set default payment method
  useEffect(() => {
    if (PAYMENT_METHODS.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(PAYMENT_METHODS[0].id);
    }
  }, []);
  
  // Format credit card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  // Handle card number input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };
  
  // Handle expiry input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardExpiry(formatExpiryDate(value));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (selectedPaymentMethod === 'credit_card') {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      
      if (!cardExpiry.trim() || cardExpiry.length < 5) {
        newErrors.cardExpiry = 'Please enter a valid expiry date';
      }
      
      if (!cardCvc.trim() || cardCvc.length < 3) {
        newErrors.cardCvc = 'Please enter a valid CVC';
      }
      
      if (!cardName.trim()) {
        newErrors.cardName = 'Please enter the name on card';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle purchase
  const handlePurchase = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to purchase tokens
      // In a real implementation, replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate response
      const packageData = TOKEN_PACKAGES[selectedPackage];
      
      // Update token balance in Redux store
      if (user) {
        dispatch(updateTokenBalance(user.token_balance + packageData.amount));
      }
      
      // Show success message
      setPurchaseSuccess(true);
      
      // Reset form
      if (selectedPaymentMethod === 'credit_card') {
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setPurchaseSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Token purchase failed:', error);
      setErrors({
        form: 'Failed to process payment. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Packages */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Purchase Tokens</h2>
            
            {purchaseSuccess && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Token purchase successful! Your balance has been updated.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {TOKEN_PACKAGES.map((pkg, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPackage === idx 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPackage(idx)}
                >
                  {pkg.isPopular && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                      Popular
                    </div>
                  )}
                  <div className="text-xl font-bold">{formatTokens(pkg.amount)}</div>
                  <div className="text-sm text-gray-500 mb-2">tokens</div>
                  <div className="text-lg font-medium">${pkg.price}</div>
                  <div className="text-xs text-gray-500 mt-2">{pkg.description}</div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-2">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PAYMENT_METHODS.map((method: PaymentMethod) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedPaymentMethod === method.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`method-${method.id}`}
                        name="paymentMethod"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={selectedPaymentMethod === method.id}
                        onChange={() => setSelectedPaymentMethod(method.id)}
                      />
                      <label htmlFor={`method-${method.id}`} className="ml-2 block text-sm font-medium text-gray-700">
                        {method.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
              )}
            </div>
            
            {selectedPaymentMethod === 'credit_card' && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Card Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                        errors.cardName ? 'border-red-500' : 'border-gray-300'
                      } rounded-md p-2`}
                      placeholder="John Smith"
                    />
                    {errors.cardName && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      } rounded-md p-2`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                        errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                      } rounded-md p-2`}
                      placeholder="MM/YY"
                    />
                    {errors.cardExpiry && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cardCvc"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border ${
                        errors.cardCvc ? 'border-red-500' : 'border-gray-300'
                      } rounded-md p-2`}
                      placeholder="123"
                    />
                    {errors.cardCvc && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardCvc}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {errors.form && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errors.form}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <div>
                <span className="text-gray-600 mr-2">Total:</span>
                <span className="text-xl font-semibold">${TOKEN_PACKAGES[selectedPackage].price}</span>
              </div>
              <button
                type="button"
                onClick={handlePurchase}
                disabled={isProcessing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Purchase Tokens'
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Current Balance & Billing History */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Current Balance</h2>
            <div className="text-3xl font-bold text-blue-600">{formatTokens(user?.token_balance || 0)}</div>
            <p className="text-sm text-gray-500 mt-1">
              Tokens can be used across all your AI agents
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Token Pricing</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p className="mb-1">• Tokens are sold in packages</p>
                <p className="mb-1">• No expiration date</p>
                <p className="mb-1">• Volume discounts available for larger purchases</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700">Need Help?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Contact our support team for any billing related questions.
              </p>
              <a
                href="mailto:support@laivdata.com"
                className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm"
              >
                support@laivdata.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;