export interface McpServer {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    base_url: string;
    is_active: boolean;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
  }
  
  export interface McpServerWithMcps extends McpServer {
    mcps: Mcp[];
  }
  
  export interface McpServerCreateRequest {
    name: string;
    description?: string;
    base_url: string;
    api_key: string;
    metadata?: Record<string, any>;
  }
  
  export interface McpServerUpdateRequest {
    name?: string;
    description?: string;
    base_url?: string;
    api_key?: string;
    is_active?: boolean;
    metadata?: Record<string, any>;
  }
  
  export interface Mcp {
    id: string;
    server_id: string;
    name: string;
    description?: string;
    version: string;
    endpoint: string;
    schema: Record<string, any>;
    icon_url?: string;
    documentation_url?: string;
    required_permissions: string[];
    tags: string[];
    is_public: boolean;
    created_at: string;
    updated_at: string;
  }
  
  export interface McpExecuteRequest {
    inputs: Record<string, any>;
    context?: Record<string, any>;
  }
  
  export interface McpExecuteResponse {
    result: Record<string, any>;
    status: 'success' | 'error';
    execution_time: number;
    metadata?: Record<string, any>;
  }
  
  export interface McpFilters {
    search?: string;
    tags?: string[];
    server_id?: string;
    is_public?: boolean;
  }
  
  export interface McpPaginatedResponse {
    items: Mcp[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    popular_tags: string[];
  }