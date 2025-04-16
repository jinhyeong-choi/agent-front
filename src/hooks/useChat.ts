import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { sendMessage, fetchConversation, clearMessages } from '@/features/chat/chatSlice';

/**
 * Hook to manage chat functionality
 * @param agentId Agent ID for the chat
 * @param conversationId Optional conversation ID
 * @returns Chat state and functions
 */
export const useChat = (agentId: string, conversationId?: string) => {
  const dispatch = useAppDispatch();
  const { messages, activeConversationId, status, error } = useAppSelector(state => state.chat);
  const [isTyping, setIsTyping] = useState(false);
  
  // Load conversation if ID is provided
  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversation({ conversationId }));
    } else {
      // Clear messages if starting a new conversation
      dispatch(clearMessages());
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearMessages());
    };
  }, [conversationId, dispatch]);
  
  // Send a message
  const sendUserMessage = useCallback(async (content: string) => {
    if (!agentId || !content.trim()) return;
    
    setIsTyping(true);
    
    try {
      await dispatch(sendMessage({
        agentId,
        content,
        conversationId: activeConversationId || undefined,
      })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  }, [agentId, activeConversationId, dispatch]);
  
  return {
    messages,
    activeConversationId,
    status,
    error,
    isTyping,
    sendMessage: sendUserMessage,
  };
};

export default useChat;