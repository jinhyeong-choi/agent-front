import { get, post, put, del } from '@/utils/api';
import { Agent, AgentCreateRequest, AgentUpdateRequest, AgentWithStats } from '@/types';

// Fetch all agents for the current user
export const fetchUserAgents = async () => {
  const response = await get<Agent[]>('/agents');
  return response.data;
};

// Get a specific agent by ID
export const getAgentById = async (agentId: string) => {
  const response = await get<AgentWithStats>(`/agents/${agentId}`);
  return response.data;
};

// Create a new agent
export const createAgent = async (agentData: AgentCreateRequest) => {
  const response = await post<Agent>('/agents', agentData);
  if (response.status !== 201) {
    throw new Error(response.message || 'Failed to create agent');
  }
  return response.data;
};

// Update an existing agent
export const updateAgent = async (agentId: string, agentData: AgentUpdateRequest) => {
  const response = await put<Agent>(`/agents/${agentId}`, agentData);
  if (response.status !== 200) {
    throw new Error(response.message || 'Failed to update agent');
  }
  return response.data;
};

// Delete an agent
export const deleteAgent = async (agentId: string) => {
  const response = await del(`/agents/${agentId}`);
  if (response.status !== 204) {
    throw new Error(response.message || 'Failed to delete agent');
  }
  return agentId;
};