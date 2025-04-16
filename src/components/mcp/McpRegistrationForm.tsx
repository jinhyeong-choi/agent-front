import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { registerServer, discoverMcps } from '@/features/mcp/mcpSlice';
import { McpServerCreateRequest } from '@/types';

const McpRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { status } = useAppSelector(state => state.mcp);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = 'Server name is required';
    }
    
    if (!baseUrl.trim()) {
      errors.baseUrl = 'Base URL is required';
    } else if (!isValidUrl(baseUrl)) {
      errors.baseUrl = 'Please enter a valid URL';
    }
    
    if (!apiKey.trim()) {
      errors.apiKey = 'API key is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsRegistering(true);
    
    try {
      // Make sure base URL ends with a slash
      const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      
      const serverData: McpServerCreateRequest = {
        name,
        description,
        base_url: normalizedBaseUrl,
        api_key: apiKey
      };
      
      const result = await dispatch(registerServer(serverData)).unwrap();
      
      // After successful registration, discover MCPs
      setIsRegistering(false);
      setIsDiscovering(true);
      
      await dispatch(discoverMcps(result.id)).unwrap();
      
      // Navigate to MCP marketplace
      navigate('/dashboard/mcp');
    } catch (error) {
      console.error('Failed to register MCP server:', error);
      setIsRegistering(false);
      setIsDiscovering(false);
    }
  };
  
  // Handle cancel button
  const handleCancel = () => {
    navigate('/dashboard/mcp');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Register MCP Server</h2>
        <p className="text-sm text-gray-500 mb-6">
          Register an MCP server to connect and use its available MCPs with your agents.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Server Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter a name for the MCP server"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what this MCP server provides"
              rows={3}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Base URL *
            </label>
            <input
              id="baseUrl"
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.baseUrl ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="https://example.com/api/"
            />
            {formErrors.baseUrl && (
              <p className="mt-1 text-sm text-red-600">{formErrors.baseUrl}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              The base URL of the MCP server (e.g., https://mcp-server.example.com/)
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API Key *
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.apiKey ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your API key"
            />
            {formErrors.apiKey && (
              <p className="mt-1 text-sm text-red-600">{formErrors.apiKey}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              The API key provided by the MCP server for authentication
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isRegistering || isDiscovering}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isRegistering || isDiscovering || status === 'loading'}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isRegistering ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : isDiscovering ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Discovering MCPs...
                </span>
              ) : (
                'Register Server'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default McpRegistrationForm;