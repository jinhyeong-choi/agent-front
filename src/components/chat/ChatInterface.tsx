import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { sendMessage, fetchConversation, clearMessages } from '@/features/chat/chatSlice';
import { getAgentById } from '@/features/agents/agentsSlice';

import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { Message } from '@/types';

interface ChatInterfaceProps {
  conversationId?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ conversationId }) => {
  const { agentId } = useParams<{ agentId: string }>();
  const dispatch = useAppDispatch();
  
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Redux state
  const { currentAgent } = useAppSelector(state => state.agents);
  const { messages, activeConversationId, status } = useAppSelector(state => state.chat);
  const { user } = useAppSelector(state => state.auth);
  
  // Fetch agent details if not already loaded
  useEffect(() => {
    if (agentId && (!currentAgent || currentAgent.id !== agentId)) {
      dispatch(getAgentById(agentId));
    }
  }, [agentId, currentAgent, dispatch]);
  
  // Fetch conversation if specified
  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversation({ conversationId }));
    } else {
      // Clear messages if starting a new conversation
      dispatch(clearMessages());
    }
    
    // Cleanup
    return () => {
      dispatch(clearMessages());
    };
  }, [conversationId, dispatch]);
  
  // Scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async (content: string) => {
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
  };
  
  if (!currentAgent) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="chat-header bg-white border-b p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img 
              src={currentAgent.avatar || '/assets/images/agent-placeholder.png'} 
              alt={currentAgent.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{currentAgent.name}</h2>
            <p className="text-sm text-gray-500">{currentAgent.description}</p>
          </div>
        </div>
      </div>

      <div className="chat-messages flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-400">
            <div className="text-center">
              <p>Send a message to start chatting with {currentAgent.name}</p>
              <p className="text-sm mt-2">This agent uses {currentAgent.llm_provider} for generating responses</p>
            </div>
          </div>
        ) : (
          messages.map((message: Message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isUser={message.role === 'user'}
              userName={user?.username || 'You'}
              agentName={currentAgent.name}
            />
          ))
        )}
        
        {status === 'loading' && (
          <div className="flex justify-center my-4">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input bg-white border-t p-4">
        <MessageInput 
          onSendMessage={handleSendMessage}
          disabled={status === 'loading' || isTyping}
          placeholder={`Message ${currentAgent.name}...`}
        />
      </div>
    </div>
  );
};

export default ChatInterface;