import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAvailableMcps, fetchUserServers } from '@/features/mcp/mcpSlice';
import { Mcp, McpFilters } from '@/types';
import McpList from '@/components/mcp/McpList';
import Button from '@/components/common/Button';

const McpMarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { mcps, servers, popularTags, status, error } = useAppSelector(state => state.mcp);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [isPublicOnly, setIsPublicOnly] = useState<boolean>(false);
  
  // Apply filters and fetch MCPs
  useEffect(() => {
    const filters: McpFilters = {};
    
    if (searchTerm) filters.search = searchTerm;
    if (selectedTags.length > 0) filters.tags = selectedTags;
    if (selectedServerId) filters.server_id = selectedServerId;
    if (isPublicOnly) filters.is_public = true;
    
    dispatch(fetchAvailableMcps(filters));
  }, [dispatch, searchTerm, selectedTags, selectedServerId, isPublicOnly]);
  
  // Fetch user's MCP servers
  useEffect(() => {
    dispatch(fetchUserServers());
  }, [dispatch]);
  
  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Handle server filter
  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedServerId(value === 'all' ? null : value);
  };
  
  // Handle MCP selection
  const handleMcpSelect = (mcp: Mcp) => {
    navigate(`/dashboard/mcp/${mcp.id}`);
  };
  
  // Handle register server button
  const handleRegisterServer = () => {
    navigate('/dashboard/mcp/register');
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setSelectedServerId(null);
    setIsPublicOnly(false);
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">MCP Marketplace</h1>
          <p className="text-gray-500">
            Browse and use Multi-Channel Platforms (MCPs) for your agents
          </p>
        </div>
        
        <Button
          onClick={handleRegisterServer}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
          className="mt-3 md:mt-0"
        >
          Register MCP Server
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search MCPs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="w-full md:w-64">
            <select
              value={selectedServerId || 'all'}
              onChange={handleServerChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Servers</option>
              {servers.map(server => (
                <option key={server.id} value={server.id}>
                  {server.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="public-only"
              type="checkbox"
              checked={isPublicOnly}
              onChange={(e) => setIsPublicOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="public-only" className="ml-2 block text-sm text-gray-700">
              Public MCPs Only
            </label>
          </div>
          
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className={`${!searchTerm && !selectedTags.length && !selectedServerId && !isPublicOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!searchTerm && !selectedTags.length && !selectedServerId && !isPublicOnly}
            >
              Clear Filters
            </Button>
          </div>
        </div>
        
        {popularTags.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Popular Tags:</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error loading MCPs: {error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(fetchAvailableMcps())}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Available MCPs <span className="text-gray-500">({mcps.length})</span>
            </h2>
          </div>
          
          <McpList 
            mcps={mcps} 
            onMcpSelect={handleMcpSelect}
            isLoading={status === 'loading'}
            emptyMessage={
              selectedTags.length > 0 || searchTerm || selectedServerId || isPublicOnly
                ? "No MCPs match your filters"
                : "No MCPs available yet"
            }
          />
        </div>
      )}
    </div>
  );
};

export default McpMarketplacePage;