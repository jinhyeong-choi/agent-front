import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createAgent, getAgentById, updateAgent } from '@/features/agents/agentsSlice';
import { fetchAvailableMcps } from '@/features/mcp/mcpSlice';

import { AgentCreateRequest, AgentUpdateRequest, LlmSettings } from '@/types';
import { LLM_PROVIDERS, DEFAULT_AGENT_CONFIG } from '@/config/constatns';

interface AgentBuilderProps {
  isEdit?: boolean;
}

const AgentBuilder: React.FC<AgentBuilderProps> = ({ isEdit = false }) => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentAgent, status: agentStatus } = useAppSelector(state => state.agents);
  const { mcps, status: mcpStatus } = useAppSelector(state => state.mcp);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_AGENT_CONFIG.system_prompt);
  const [selectedProvider, setSelectedProvider] = useState(DEFAULT_AGENT_CONFIG.llm_settings.provider);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_AGENT_CONFIG.llm_settings.model);
  const [temperature, setTemperature] = useState(DEFAULT_AGENT_CONFIG.temperature);
  const [maxTokens, setMaxTokens] = useState(DEFAULT_AGENT_CONFIG.max_tokens);
  const [historyLength, setHistoryLength] = useState(DEFAULT_AGENT_CONFIG.history_length);
  const [reasoningEnabled, setReasoningEnabled] = useState(DEFAULT_AGENT_CONFIG.reasoning_enabled);
  const [selectedMcps, setSelectedMcps] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load agent data if editing
  useEffect(() => {
    if (isEdit && agentId) {
      dispatch(getAgentById(agentId));
    }
  }, [isEdit, agentId, dispatch]);
  
  // Fetch available MCPs
  useEffect(() => {
    dispatch(fetchAvailableMcps());
  }, [dispatch]);
  
  // Populate form when editing an existing agent
  useEffect(() => {
    if (isEdit && currentAgent) {
      setName(currentAgent.name);
      setDescription(currentAgent.description);
      setSystemPrompt(currentAgent.configuration.system_prompt);
      setSelectedProvider(currentAgent.llm_provider);
      setSelectedModel(currentAgent.configuration.llm_settings.model);
      setTemperature(currentAgent.configuration.temperature);
      setMaxTokens(currentAgent.configuration.max_tokens);
      setHistoryLength(currentAgent.configuration.history_length);
      setReasoningEnabled(currentAgent.configuration.reasoning_enabled);
      setSelectedMcps(currentAgent.mcps.map(mcp => mcp.mcp_id));
    }
  }, [isEdit, currentAgent]);
  
  // Get available models for selected provider
  const getAvailableModels = () => {
    const provider = LLM_PROVIDERS.find(p => p.id === selectedProvider);
    return provider?.models || [];
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!name.trim()) {
      errors.name = 'Agent name is required';
    }
    
    if (!description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!systemPrompt.trim()) {
      errors.systemPrompt = 'System prompt is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle MCP selection
  const handleMcpSelection = (mcpId: string) => {
    setSelectedMcps(prev => 
      prev.includes(mcpId)
        ? prev.filter(id => id !== mcpId)
        : [...prev, mcpId]
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const llmSettings: LlmSettings = {
      provider: selectedProvider,
      model: selectedModel,
    };
    
    try {
      if (isEdit && agentId) {
        // Update existing agent
        const updateData: AgentUpdateRequest = {
          name,
          description,
          llm_provider: selectedProvider,
          configuration: {
            system_prompt: systemPrompt,
            temperature,
            max_tokens: maxTokens,
            history_length: historyLength,
            reasoning_enabled: reasoningEnabled,
            llm_settings: llmSettings,
          },
          mcps: selectedMcps,
        };
        
        await dispatch(updateAgent({ agentId, agentData: updateData })).unwrap();
        navigate(`/dashboard/agents/${agentId}`);
      } else {
        // Create new agent
        const createData: AgentCreateRequest = {
          name,
          description,
          llm_provider: selectedProvider,
          configuration: {
            system_prompt: systemPrompt,
            temperature,
            max_tokens: maxTokens,
            history_length: historyLength,
            reasoning_enabled: reasoningEnabled,
            llm_settings: llmSettings,
          },
          mcps: selectedMcps,
        };
        
        const result = await dispatch(createAgent(createData)).unwrap();
        navigate(`/dashboard/agents/${result.id}`);
      }
    } catch (error) {
      console.error('Failed to save agent:', error);
      setIsSubmitting(false);
    }
  };
  
  if (isEdit && agentStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Agent' : 'Create New Agent'}</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter a name for your agent"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>
        </div>
        
        {/* LLM Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">LLM Configuration</h2>
          <p className="text-sm text-gray-500 mb-4">Configure how your agent processes and responds to messages</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="provider" className="block text-sm font-medium text-gray-700 mb-1">
                LLM Provider
              </label>
              <select
                id="provider"
                value={selectedProvider}
                onChange={(e) => {
                  setSelectedProvider(e.target.value);
                  // Reset model when provider changes
                  const newProvider = LLM_PROVIDERS.find(p => p.id === e.target.value);
                  if (newProvider && newProvider.models.length > 0) {
                    setSelectedModel(newProvider.models[0]);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {LLM_PROVIDERS.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                id="model"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {getAvailableModels().map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-1">
              System Prompt *
            </label>
            <textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.systemPrompt ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter instructions for your agent"
              rows={6}
            />
            {formErrors.systemPrompt && (
              <p className="mt-1 text-sm text-red-600">{formErrors.systemPrompt}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This prompt defines your agent's behavior, expertise, and limitations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                Temperature: {temperature}
              </label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>More Precise</span>
                <span>More Creative</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-1">
                Max Tokens
              </label>
              <input
                id="maxTokens"
                type="number"
                min="100"
                max="8000"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="historyLength" className="block text-sm font-medium text-gray-700 mb-1">
                History Length
              </label>
              <input
                id="historyLength"
                type="number"
                min="1"
                max="50"
                value={historyLength}
                onChange={(e) => setHistoryLength(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <input
                id="reasoning"
                type="checkbox"
                checked={reasoningEnabled}
                onChange={(e) => setReasoningEnabled(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="reasoning" className="ml-2 block text-sm text-gray-700">
                Enable Advanced Reasoning
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              When enabled, the agent will use more advanced reasoning capabilities for complex tasks. 
              This may increase token usage and response time.
            </p>
          </div>
        </div>
        
        {/* MCPs Integration */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">MCPs Integration</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the MCPs (Multi-Channel Platforms) to enable for this agent
          </p>
          
          {mcpStatus === 'loading' ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="mcp-selection">
              {mcps.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-2">No MCPs available</p>
                  <p className="text-sm text-gray-500 mb-4">Register MCPs to enhance your agent capabilities</p>
                  <button 
                    type="button"
                    onClick={() => navigate('/dashboard/mcp/register')}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Register MCP
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mcps.map(mcp => (
                    <div 
                      key={mcp.id}
                      className={`border rounded-lg p-4 cursor-pointer ${
                        selectedMcps.includes(mcp.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleMcpSelection(mcp.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <input
                            type="checkbox"
                            checked={selectedMcps.includes(mcp.id)}
                            onChange={() => handleMcpSelection(mcp.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{mcp.name}</h3>
                          <p className="text-sm text-gray-500">{mcp.description || 'No description'}</p>
                          {mcp.tags && mcp.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {mcp.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/agents')}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || agentStatus === 'loading'}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEdit ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEdit ? 'Update Agent' : 'Create Agent'
            )}
          </button>
        </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Describe what your agent does"
              rows={3}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>
      </form>
    </div>
  );
};

export default AgentBuilder;
