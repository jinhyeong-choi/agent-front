import React from 'react';
import { Mcp } from '@/types';
import McpCard from './McpCard';

interface McpListProps {
  mcps: Mcp[];
  onMcpSelect?: (mcp: Mcp) => void;
  selectedMcps?: string[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const McpList: React.FC<McpListProps> = ({
  mcps,
  onMcpSelect,
  selectedMcps = [],
  isLoading = false,
  emptyMessage = 'No MCPs available'
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (mcps.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mcps.map((mcp) => (
        <McpCard 
          key={mcp.id} 
          mcp={mcp} 
          onSelect={onMcpSelect ? () => onMcpSelect(mcp) : undefined}
          isSelected={selectedMcps.includes(mcp.id)}
        />
      ))}
    </div>
  );
};

export default McpList;