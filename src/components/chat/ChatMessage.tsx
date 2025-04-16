import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Message, McpAction } from '@/types';

interface ChatMessageProps {
  message: Message;
  isUser: boolean;
  userName?: string;
  agentName?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isUser, 
  userName = 'You',
  agentName = 'Agent' 
}) => {
  // Function to format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Extract MCP actions from metadata if present
  const mcpActions: McpAction[] = message.metadata?.mcp_actions || [];
  
  // Format content with code blocks and MCP results
  const formatContent = (content: string) => {
    // Split content by code blocks
    const parts = content.split(/```([\w-]*)\n([\s\S]*?)```/g);
    
    return (
      <>
        {parts.map((part, index) => {
          // Every third part is the language
          if (index % 3 === 1) {
            const language = part || 'plaintext';
            const code = parts[index + 1];
            
            return (
              <div key={index} className="my-2">
                <div className="bg-gray-800 text-gray-200 text-xs px-3 py-1 rounded-t-md">
                  {language}
                </div>
                <SyntaxHighlighter
                  language={language}
                  style={docco}
                  className="rounded-b-md"
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            );
          } else if (index % 3 === 0) {
            // Regular text
            if (!part) return null;
            
            // Split by newlines and preserve them
            return (
              <span key={index}>
                {part.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < part.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </span>
            );
          }
          return null;
        })}
        
        {/* Display MCP usage information if available */}
        {mcpActions.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <p className="italic">Used {mcpActions.length} tool(s) to generate this response</p>
          </div>
        )}
      </>
    );
  };
  
  return (
    <div className={`chat-message mb-4 ${isUser ? 'user-message' : 'agent-message'}`}>
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-1">
          <img 
            src={isUser ? '/assets/images/avatars/user.png' : '/assets/images/agent-placeholder.png'} 
            alt={isUser ? 'User' : 'Agent'}
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">{isUser ? userName : agentName}</span>
            <span className="text-xs text-gray-500">{formatTime(message.created_at)}</span>
          </div>
          <div className={`p-3 rounded-lg ${isUser ? 'bg-blue-100' : 'bg-white border'}`}>
            {formatContent(message.content)}
          </div>
          
          {/* Show token usage if it's an agent message */}
          {!isUser && message.tokens_used > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {message.tokens_used} tokens used
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;