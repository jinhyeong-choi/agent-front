import React from 'react';
import { Link } from 'react-router-dom';
import McpRegistrationForm from '@/components/mcp/McpRegistrationForm';

const McpRegistrationPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/dashboard/mcp"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to MCP Marketplace
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Register MCP Server</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">What is an MCP Server?</h2>
        <p className="text-gray-600 mb-4">
          An MCP (Model Context Protocol) server provides additional capabilities to your AI agents through a standardized interface. 
          Once registered, you can use its MCPs to enhance your agents with external data and services.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You'll need a valid MCP server URL and API key to complete registration. 
                Contact your MCP server provider if you don't have these details.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <McpRegistrationForm />
      
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Setting Up Your Own MCP Server</h2>
        <p className="text-gray-600 mb-3">
          If you're interested in developing your own MCP server, check out our developer documentation for detailed instructions.
        </p>
        <a 
          href="https://modelcontextprotocol.io/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          Learn more about the Model Context Protocol →
        </a>
      </div>
    </div>
  );
};

export default McpRegistrationPage;