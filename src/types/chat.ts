export interface Message {
    id: string;
    conversation_id: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    tokens_used: number;
    created_at: string;
    metadata?: Record<string, any>;
  }
  
  export interface MessageRequest {
    content: string;
    conversation_id?: string;
    metadata?: Record<string, any>;
  }
  
  export interface MessageResponse {
    content: string;
    agent_id: string;
    conversation_id: string;
    metadata?: Record<string, any>;
    tokens?: {
      input: number;
      output: number;
      total: number;
    };
  }
  
  export interface Conversation {
    id: string;
    title?: string;
    user_id: string;
    agent_id: string;
    created_at: string;
    updated_at: string;
    messages: Message[];
  }
  
  export interface ConversationSummary {
    id: string;
    title?: string;
    agent_id: string;
    agent_name: string;
    updated_at: string;
    last_message?: string;
    message_count: number;
  }
  
  export interface McpAction {
    mcp_id: string;
    inputs: Record<string, any>;
  }
  
  export interface IntentData {
    primary_intent: string;
    entities: Record<string, any>;
    confidence: number;
    suggested_mcps?: string[];
  }