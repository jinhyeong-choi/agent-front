import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getAgentById } from '@/features/agents/agentsSlice';
import { fetchConversations, setActiveConversation } from '@/features/chat/chatSlice';
import ChatInterface from '@/components/chat/ChatInterface';
import ConversationList from '@/components/chat/ConversationList';

const AgentChatPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get conversationId from URL query params if it exists
  const queryParams = new URLSearchParams(location.search);
  const conversationId = queryParams.get('conversation');
  
  // Get data from Redux store
  const { currentAgent, status: agentStatus } = useAppSelector(state => state.agents);
  const { conversations, activeConversationId } = useAppSelector(state => state.chat);
  
  // Fetch agent details if not already loaded
  useEffect(() => {
    if (agentId && (!currentAgent || currentAgent.id !== agentId)) {
      dispatch(getAgentById(agentId));
    }
  }, [agentId, currentAgent, dispatch]);
  
  // Fetch conversations for this agent
  useEffect(() => {
    if (agentId) {
      dispatch(fetchConversations(agentId));
    }
  }, [agentId, dispatch]);
  
  // Set active conversation when conversationId changes in URL
  useEffect(() => {
    if (conversationId) {
      dispatch(setActiveConversation(conversationId));
    }
  }, [conversationId, dispatch]);
  
  // Update URL when activeConversationId changes
  useEffect(() => {
    if (activeConversationId && !conversationId) {
      navigate(`/dashboard/agents/${agentId}/chat?conversation=${activeConversationId}`, { replace: true });
    }
  }, [activeConversationId, conversationId, agentId, navigate]);
  
  // Handle conversation selection
  const handleSelectConversation = (id: string) => {
    navigate(`/dashboard/agents/${agentId}/chat?conversation=${id}`);
  };
  
  // Handle new chat button click
  const handleNewChat = () => {
    navigate(`/dashboard/agents/${agentId}/chat`);
  };
  
  return (
    <div className="flex h-full">
      {/* Conversation sidebar */}
      <div className="w-64 border-r bg-white overflow-y-auto">
        <div className="p-4 border-b">
          <button
            onClick={handleNewChat}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Chat
          </button>
        </div>
        
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {agentStatus === 'loading' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ChatInterface conversationId={conversationId || undefined} />
        )}
      </div>
    </div>
  );
};

export default AgentChatPage;