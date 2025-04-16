import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  fetchAvailableMcps, 
  fetchUserServers, 
  getMcpById 
} from '@/features/mcp/mcpSlice';
import { McpFilters, Mcp } from '@/types';

/**
 * Hook for managing MCP-related functionality
 * @param mcpId Optional MCP ID to load
 * @returns MCP state and functions
 */
export const useMcp = (mcpId?: string) => {
  const dispatch = useAppDispatch();
  const { 
    mcps, 
    servers, 
    currentMcp, 
    popularTags, 
    status, 
    error 
  } = useAppSelector(state => state.mcp);
  
  const [filters, setFilters] = useState<McpFilters>({});
  
  // Load MCP details if ID is provided
  useEffect(() => {
    if (mcpId) {
      dispatch(getMcpById(mcpId));
    }
  }, [mcpId, dispatch]);
  
  // Load available MCPs with current filters
  useEffect(() => {
    dispatch(fetchAvailableMcps(filters));
  }, [filters, dispatch]);
  
  // Load user's MCP servers
  useEffect(() => {
    dispatch(fetchUserServers());
  }, [dispatch]);
  
  // Update filters
  const updateFilters = useCallback((newFilters: Partial<McpFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);
  
  // Set search query
  const setSearchQuery = useCallback((query: string) => {
    updateFilters({ search: query || undefined });
  }, [updateFilters]);
  
  // Toggle tag filter
  const toggleTag = useCallback((tag: string) => {
    setFilters(prev => {
      const currentTags = prev.tags || [];
      if (currentTags.includes(tag)) {
        return {
          ...prev,
          tags: currentTags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tag]
        };
      }
    });
  }, []);
  
  // Set server filter
  const setServerFilter = useCallback((serverId: string | null) => {
    updateFilters({ server_id: serverId || undefined });
  }, [updateFilters]);
  
  // Toggle public-only filter
  const togglePublicOnly = useCallback((isPublicOnly: boolean) => {
    updateFilters({ is_public: isPublicOnly });
  }, [updateFilters]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);
  
  return {
    mcps,
    servers,
    currentMcp,
    popularTags,
    status,
    error,
    filters,
    updateFilters,
    setSearchQuery,
    toggleTag,
    setServerFilter,
    togglePublicOnly,
    clearFilters
  };
};

export default useMcp;