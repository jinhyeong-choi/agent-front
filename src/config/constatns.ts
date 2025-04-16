export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const API_VERSION = 'v1';
export const API_ENDPOINT = `${API_BASE_URL}/${API_VERSION}`;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'laivdata_auth_token',
  USER: 'laivdata_user',
  THEME: 'laivdata_theme',
};

export const DEFAULT_AVATAR = '/assets/images/agent-placeholder.png';
export const DEFAULT_MCP_ICON = '/assets/images/mcp-placeholder.png';

export const LLM_PROVIDERS = [
  { id: 'claude', name: 'Anthropic Claude', models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-3.5-sonnet-20240620'] },
  { id: 'gpt', name: 'OpenAI GPT', models: ['gpt-4-turbo', 'gpt-4o', 'gpt-4', 'gpt-3.5-turbo'] },
  { id: 'gemini', name: 'Google Gemini', models: ['gemini-pro', 'gemini-ultra'] },
];

export const DEFAULT_AGENT_CONFIG = {
  system_prompt: 'You are a helpful AI assistant.',
  temperature: 0.7,
  max_tokens: 4000,
  history_length: 10,
  reasoning_enabled: false,
  llm_settings: {
    provider: 'claude',
    model: 'claude-3-opus-20240229',
  },
};

export const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Credit Card' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'crypto', name: 'Cryptocurrency' },
];

export const TOKEN_PACKAGES = [
  { amount: 1000, price: 10, description: 'Basic Package' },
  { amount: 5000, price: 45, description: 'Popular', isPopular: true },
  { amount: 10000, price: 80, description: 'Professional' },
  { amount: 50000, price: 350, description: 'Enterprise' },
];