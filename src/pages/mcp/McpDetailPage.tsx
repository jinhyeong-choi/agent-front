import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getMcpById } from '@/features/mcp/mcpSlice';
import { DEFAULT_MCP_ICON } from '@/config/constatns';

const McpDetailPage: React.FC = () => {
  const { mcpId } = useParams<{ mcpId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentMcp, status, error } = useAppSelector(state => state.mcp);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'schema' | 'usage'>('overview');
  
  useEffect(() => {
    if (mcpId) {
      dispatch(getMcpById(mcpId));
    }
  }, [mcpId, dispatch]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    return formatter.format(date);
  };
  
  // Handle back button
  const handleBack = () => {
    navigate('/dashboard/mcp');
  };
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !currentMcp) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">MCP not found</h2>
        <p className="mb-4">The MCP you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <button
        onClick={handleBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Marketplace
      </button>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* MCP Header */}
        <div className="p-6 border-b">
          <div className="flex">
            <div className="w-16 h-16 rounded-lg overflow-hidden mr-6 flex-shrink-0">
              <img 
                src={currentMcp.icon_url || DEFAULT_MCP_ICON} 
                alt={currentMcp.name}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{currentMcp.name}</h1>
                  <p className="text-gray-500">Version {currentMcp.version}</p>
                </div>
                
                {!currentMcp.is_public && (
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    Private
                  </div>
                )}
              </div>
              
              <p className="mt-2">{currentMcp.description || 'No description provided'}</p>
              
              <div className="mt-3 flex space-x-4">
                {currentMcp.documentation_url && (
                  <a
                    href={currentMcp.documentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    Documentation
                  </a>
                )}
                
                <span className="text-gray-500">
                  Updated {formatDate(currentMcp.updated_at)}
                </span>
              </div>
              
              {currentMcp.tags && currentMcp.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentMcp.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`px-4 py-3 text-sm font-medium ${
                selectedTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            
            <button
              onClick={() => setSelectedTab('schema')}
              className={`px-4 py-3 text-sm font-medium ${
                selectedTab === 'schema'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Schema
            </button>
            
            <button
              onClick={() => setSelectedTab('usage')}
              className={`px-4 py-3 text-sm font-medium ${
                selectedTab === 'usage'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Usage Guide
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {selectedTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Server Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-500">Server ID:</span>
                      <div className="text-sm">{currentMcp.server_id}</div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-500">Endpoint:</span>
                      <div className="text-sm font-mono bg-gray-100 p-1 rounded">{currentMcp.endpoint}</div>
                    </div>
                    
                    {currentMcp.required_permissions && currentMcp.required_permissions.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Required Permissions:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {currentMcp.required_permissions.map(permission => (
                            <span key={permission} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Usage Requirements</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                      <li>Add this MCP to an agent from the agent builder</li>
                      <li>Agents will automatically gain access to this MCP's capabilities</li>
                      <li>Check the usage guide for example prompts that make use of this MCP</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab === 'schema' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Schema</h2>
              
              {currentMcp.schema ? (
                <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm font-mono">
                    {JSON.stringify(currentMcp.schema, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
                  No schema information available for this MCP.
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'usage' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Usage Guide</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-gray-700 mb-2">How to Use This MCP</h3>
                <p className="text-sm text-gray-700 mb-4">
                  This MCP can be added to any agent to extend its capabilities. When an agent has access to this MCP,
                  it can use special commands to interact with external systems and fetch or process data.
                </p>
                
                <h3 className="font-medium text-gray-700 mb-2">Example Prompts</h3>
                <div className="bg-white p-3 rounded border mb-2">
                  <p className="text-sm font-medium">Basic Usage:</p>
                  <p className="text-sm text-gray-700 mt-1">
                    "Use the {currentMcp.name} MCP to get information about..."
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm font-medium">Advanced Usage:</p>
                  <p className="text-sm text-gray-700 mt-1">
                    "I need you to process this data using {currentMcp.name} with the following parameters..."
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
                <h3 className="font-medium mb-2">Pro Tip</h3>
                <p className="text-sm">
                  Agents automatically determine when to use MCPs based on the context of your conversation.
                  You generally don't need to explicitly tell the agent to use a specific MCP.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default McpDetailPage;