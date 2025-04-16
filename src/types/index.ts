export * from './agent';
export * from './chat';
export * from './mcp';
export * from './user';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TokenInfo {
  balance: number;
  user_id: string;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  agent_id?: string;
  transaction_type: 'usage' | 'purchase' | 'grant' | 'refund';
  amount: number;
  description?: string;
  created_at: string;
}

export interface TokenUsageSummary {
  user_id: string;
  period_days: number;
  total_usage: number;
  total_purchases: number;
  current_balance: number;
}

export interface TokenAgentUsage {
  agent_id: string;
  agent_name: string;
  total_tokens: number;
}