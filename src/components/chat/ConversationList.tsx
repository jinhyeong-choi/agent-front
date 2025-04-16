import React from 'react';
import { ConversationSummary } from '@/types';

interface ConversationListProps {
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
}) => {
  // Sort conversations by updated_at (newest first)
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  if (sortedConversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations yet
      </div>
    );
  }
  
  return (
    <div className="conversation-list">
      {sortedConversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
            activeConversationId === conversation.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-sm truncate">
              {conversation.title || 'New conversation'}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatDate(conversation.updated_at)}
            </span>
          </div>
          
          {conversation.last_message && (
            <p className="text-xs text-gray-500 truncate">
              {conversation.last_message}
            </p>
          )}
          
          <div className="text-xs text-gray-400 mt-1">
            {conversation.message_count} message{conversation.message_count !== 1 ? 's' : ''}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;