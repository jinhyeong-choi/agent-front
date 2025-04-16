import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mcp } from '@/types';
import { DEFAULT_MCP_ICON } from '@/config/constatns';

interface McpCardProps {
  mcp: Mcp;
  onSelect?: (mcp: Mcp) => void;
  isSelected?: boolean;
}

const McpCard: React.FC<McpCardProps> = ({ mcp, onSelect, isSelected = false }) => {
  const navigate = useNavigate();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    return formatter.format(date);
  };
  
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(mcp);
    } else {
      navigate(`/dashboard/mcp/${mcp.id}`);
    }
  };
  
  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-start mb-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
            <img 
              src={mcp.icon_url || DEFAULT_MCP_ICON} 
              alt={mcp.name}
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">{mcp.name}</h3>
            <div className="text-xs text-gray-500">
              {mcp.version && <span>v{mcp.version} • </span>}
              Updated {formatDate(mcp.updated_at)}
            </div>
          </div>
          
          {!mcp.is_public && (
            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Private
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {mcp.description || 'No description provided'}
        </p>
        
        {mcp.tags && mcp.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mcp.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 p-2 border-t flex justify-between items-center text-xs text-gray-500">
        {mcp.documentation_url ? (
          <a
            href={mcp.documentation_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Documentation
          </a>
        ) : (
          <span>No documentation available</span>
        )}
        
        <span>Server ID: {mcp.server_id.substring(0, 8)}...</span>
      </div>
    </div>
  );
};

export default McpCard;