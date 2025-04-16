import { get, post, put, del } from '@/utils/api';
import { 
  Mcp, 
  McpServer, 
  McpServerCreateRequest, 
  McpServerUpdateRequest,
  McpExecuteRequest,
  McpExecuteResponse,
  McpFilters
} from '@/types';

/**
 * Fetch available MCPs with optional filters
 * @param filters Optional filters for MCPs
 * @returns MCP list and metadata
 */
export const fetchAvailableMcps = async (filters?: McpFilters) => {
  // Build query string from filters
  const queryParams = new URLSearchParams();
  
  if (filters?.search) queryParams.append('search', filters.search);
  if (filters?.tags?.length) {
    filters.tags.forEach(tag => queryParams.append('tags', tag));
  }
  if (filters?.server_id) queryParams.append('server_id', filters.server_id);
  if (filters?.is_public !== undefined) {
    queryParams.append('is_public', String(filters.is_public));
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await get(`/mcp${queryString}`);
  
  return response.data;
};

/**
 * Get MCP by ID
 * @param mcpId MCP ID to fetch
 * @returns MCP details
 */
export const getMcpById = async (mcpId: string) => {
  const response = await get<Mcp>(`/mcp/${mcpId}`);
  return response.data;
};

/**
 * Execute MCP with inputs
 * @param mcpId MCP ID to execute
 * @param inputs Input parameters for MCP
 * @param context Optional context information
 * @returns MCP execution response
 */
export const executeMcp = async (
  mcpId: string, 
  inputs: Record<string, any>, 
  context?: Record<string, any>
) => {
  const executeData: McpExecuteRequest = {
    inputs,
    context
  };
  
  const response = await post<McpExecuteResponse>(`/mcp/${mcpId}/execute`, executeData);
  
  if (response.status !== 200) {
    throw new Error(response.message || 'Failed to execute MCP');
  }
  
  return response.data;
};

/**
 * Fetch user's MCP servers
 * @returns List of user's MCP servers
 */
export const fetchUserServers = async () => {
  const response = await get<McpServer[]>('/mcp/servers');
  return response.data;
};

/**
 * Get MCP server by ID
 * @param serverId Server ID to fetch
 * @returns Server details
 */
export const getServerById = async (serverId: string) => {
  const response = await get<McpServer>(`/mcp/servers/${serverId}`);
  return response.data;
};

/**
 * Register new MCP server
 * @param serverData Server data to register
 * @returns Registered server
 */
export const registerServer = async (serverData: McpServerCreateRequest) => {
  const response = await post<McpServer>('/mcp/servers', serverData);
  
  if (response.status !== 201) {
    throw new Error(response.message || 'Failed to register MCP server');
  }
  
  return response.data;
};

/**
 * Update MCP server
 * @param serverId Server ID to update
 * @param serverData Updated server data
 * @returns Updated server
 */
export const updateServer = async (serverId: string, serverData: McpServerUpdateRequest) => {
  const response = await put<McpServer>(`/mcp/servers/${serverId}`, serverData);
  
  if (response.status !== 200) {
    throw new Error(response.message || 'Failed to update MCP server');
  }
  
  return response.data;
};

/**
 * Delete MCP server
 * @param serverId Server ID to delete
 * @returns Success indicator
 */
export const deleteServer = async (serverId: string) => {
  const response = await del(`/mcp/servers/${serverId}`);
  
  if (response.status !== 204) {
    throw new Error(response.message || 'Failed to delete MCP server');
  }
  
  return serverId;
};

/**
 * Discover MCPs from a server
 * @param serverId Server ID to discover MCPs from
 * @returns Discovered MCPs
 */
export const discoverMcps = async (serverId: string) => {
  const response = await post<Mcp[]>(`/mcp/servers/${serverId}/discover`);
  
  if (response.status !== 200) {
    throw new Error(response.message || 'Failed to discover MCPs');
  }
  
  return response.data;
};

/**
 * Test MCP server connection
 * @param serverId Server ID to test
 * @returns Connection test result
 */
export const testServerConnection = async (serverId: string) => {
  const response = await post(`/mcp/servers/${serverId}/test`);
  return response.data;
};