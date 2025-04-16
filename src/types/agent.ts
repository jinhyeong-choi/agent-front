export interface LlmSettings {
    provider: string;
    model: string;
    fallback_provider?: string;
    fallback_model?: string;
  }
  
  export interface AgentConfiguration {
    system_prompt: string;
    temperature: number;
    max_tokens: number;
    history_length: number;
    reasoning_enabled: boolean;
    llm_settings: LlmSettings;
  }
  
  export interface AgentMcp {
    id: string;
    agent_id: string;
    mcp_id: string;
    name: string;
    description?: string;
    icon?: string;
    is_enabled: boolean;
    configuration: Record<string, any>;
    created_at: string;
    updated_at: string;
  }
  
  export interface Agent {
    id: string;
    name: string;
    description: string;
    type: string;
    avatar?: string;
    llm_provider: string;
    configuration: {
      system_prompt: string;
      temperature: number;
      max_tokens: number;
      history_length: number;
      reasoning_enabled: boolean;
      llm_settings: {
        provider: string;
        model: string;
      };
    };
    is_active: boolean;
    created_at: string;
    updated_at: string;
    mcps: Array<{
      mcp_id: string;
      name: string;
    }>;
  }
  
  export interface AgentWithStats extends Agent {
    total_conversations: number;
    total_messages: number;
    tokens_used: number;
  }
  
  export interface AgentCreateRequest {
    name: string;
    description: string;
    avatar?: string;
    llm_provider: string;
    configuration: AgentConfiguration;
    mcps: string[]; // Array of MCP IDs to attach to the agent
  }
  
  export interface AgentUpdateRequest {
    name?: string;
    description?: string;
    avatar?: string;
    is_active?: boolean;
    llm_provider?: string;
    configuration?: Partial<AgentConfiguration>;
    mcps?: string[]; // Array of MCP IDs to attach to the agent
  }
  
  export interface AgentFilters {
    search?: string;
    sort_by?: 'name' | 'created_at' | 'updated_at';
    sort_order?: 'asc' | 'desc';
    is_active?: boolean;
  }