import { get, post } from '@/utils/api';
import { Message, Conversation, ConversationSummary, MessageRequest } from '@/types';

/**
 * Fetch all conversations for an agent
 * @param agentId Agent ID to fetch conversations for
 * @returns List of conversation summaries
 */
export const fetchConversations = async (agentId: string) => {
  const response = await get<ConversationSummary[]>(`/conversations?agent_id=${agentId}`);
  return response.data;
};

/**
 * Fetch a specific conversation with messages
 * @param conversationId Conversation ID to fetch
 * @returns Conversation with messages
 */
export const fetchConversation = async (conversationId: string) => {
  const response = await get<Conversation>(`/conversations/${conversationId}`);
  return response.data;
};

/**
 * Send a message to an agent
 * @param agentId Agent ID to send message to
 * @param messageData Message data to send
 * @returns Server response with agent's reply
 */
export const sendMessage = async (agentId: string, messageData: MessageRequest) => {
  const response = await post<Message>(`/agents/${agentId}/message`, messageData);
  
  if (response.status !== 200) {
    throw new Error(response.message || 'Failed to send message');
  }
  
  return response.data;
};

/**
 * Create a new conversation
 * @param agentId Agent ID to create conversation with
 * @param title Optional conversation title
 * @returns Created conversation
 */
export const createConversation = async (agentId: string, title?: string) => {
  const response = await post<Conversation>('/conversations', {
    agent_id: agentId,
    title: title || 'New conversation'
  });
  
  if (response.status !== 201) {
    throw new Error(response.message || 'Failed to create conversation');
  }
  
  return response.data;
};

/**
 * Update conversation title
 * @param conversationId Conversation ID to update
 * @param title New title
 * @returns Updated conversation
 */
export const updateConversationTitle = async (conversationId: string, title: string) => {
  const response = await post<Conversation>(`/conversations/${conversationId}`, {
    title
  });
  
  if (response.status !== 200) {
    throw new Error(response.message || 'Failed to update conversation');
  }
  
  return response.data;
};

/**
 * Delete a conversation
 * @param conversationId Conversation ID to delete
 * @returns Success indicator
 */
export const deleteConversation = async (conversationId: string) => {
  const response = await post(`/conversations/${conversationId}/delete`);
  
  if (response.status !== 204) {
    throw new Error(response.message || 'Failed to delete conversation');
  }
  
  return true;
};