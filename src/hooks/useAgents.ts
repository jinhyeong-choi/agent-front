import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { 
  fetchAgents, 
  getAgentById, 
  createAgent, 
  updateAgent, 
  deleteAgent 
} from '@/features/agents/agentsSlice';
import { Agent, AgentCreateRequest, AgentUpdateRequest } from '@/types';

/**
 * Hook for managing agent-related functionality
 * @param agentId Optional agent ID to load
 * @returns Agent state and functions
 */
export const useAgents = (agentId?: string) => {
  const dispatch = useAppDispatch();
  const { 
    agents, 
    currentAgent, 
    status, 
    error 
  } = useAppSelector(state => state.agents);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  
  // Load agent details if ID is provided
  useEffect(() => {
    if (agentId) {
      dispatch(getAgentById(agentId));
    }
  }, [agentId, dispatch]);
  
  // Load all agents
  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);
  
  // Filter agents
  useEffect(() => {
    if (agents.length > 0) {
      const filtered = agents.filter(agent => {
        const matchesSearch = 
          agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          agent.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesActiveFilter = 
          activeFilter === null || agent.is_active === activeFilter;
        
        return matchesSearch && matchesActiveFilter;
      });
      
      setFilteredAgents(filtered);
    } else {
      setFilteredAgents([]);
    }
  }, [agents, searchTerm, activeFilter]);
  
  // Create new agent
  const createNewAgent = useCallback(async (agentData: AgentCreateRequest) => {
    try {
      const newAgent = await dispatch(createAgent(agentData)).unwrap();
      return newAgent;
    } catch (error) {
      console.error('Failed to create agent:', error);
      throw error;
    }
  }, [dispatch]);
  
  // Update existing agent
  const updateExistingAgent = useCallback(async (
    agentId: string, 
    agentData: AgentUpdateRequest
  ) => {
    try {
      const updatedAgent = await dispatch(updateAgent({ 
        agentId, 
        agentData 
      })).unwrap();
      return updatedAgent;
    } catch (error) {
      console.error('Failed to update agent:', error);
      throw error;
    }
  }, [dispatch]);
  
  // Delete agent
  const deleteExistingAgent = useCallback(async (agentId: string) => {
    try {
      await dispatch(deleteAgent(agentId)).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete agent:', error);
      throw error;
    }
  }, [dispatch]);
  
  return {
    agents,
    filteredAgents,
    currentAgent,
    status,
    error,
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    createAgent: createNewAgent,
    updateAgent: updateExistingAgent,
    deleteAgent: deleteExistingAgent
  };
};

export default useAgents;