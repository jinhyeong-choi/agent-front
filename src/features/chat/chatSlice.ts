import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message, Conversation, ConversationSummary, MessageRequest } from '@/types';
import { get, post } from '@/utils/api';

interface ChatState {
  conversations: ConversationSummary[];
  currentConversation: Conversation | null;
  messages: Message[];
  activeConversationId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  activeConversationId: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (agentId: string, { rejectWithValue }) => {
    try {
      const response = await get<ConversationSummary[]>(`/conversations?agent_id=${agentId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch conversations');
    }
  }
);

export const fetchConversation = createAsyncThunk(
  'chat/fetchConversation',
  async ({ conversationId }: { conversationId: string }, { rejectWithValue }) => {
    try {
      const response = await get<Conversation>(`/conversations/${conversationId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ agentId, content, conversationId, metadata }: 
    { agentId: string, content: string, conversationId?: string, metadata?: Record<string, any> }, 
    { rejectWithValue }
  ) => {
    try {
      const messageRequest: MessageRequest = {
        content,
        conversation_id: conversationId,
        metadata: metadata || {},
      };
      
      const response = await post(`/agents/${agentId}/message`, messageRequest);
      
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to send message');
      }
      
      return {
        agentMessage: response.data,
        userMessage: {
          content,
          conversation_id: response.data.conversation_id,
          role: 'user' as const,
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

// Chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    clearActiveConversation: (state) => {
      state.activeConversationId = null;
      state.currentConversation = null;
      state.messages = [];
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action: PayloadAction<ConversationSummary[]>) => {
        state.status = 'succeeded';
        state.conversations = action.payload;
        
        // If there are conversations but no active one, set the most recent as active
        if (action.payload.length > 0 && !state.activeConversationId) {
          // Sort by updated_at descending and take the first
          const sortedConversations = [...action.payload].sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          state.activeConversationId = sortedConversations[0].id;
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // fetchConversation
      .addCase(fetchConversation.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchConversation.fulfilled, (state, action: PayloadAction<Conversation>) => {
        state.status = 'succeeded';
        state.currentConversation = action.payload;
        state.messages = action.payload.messages;
        state.activeConversationId = action.payload.id;
        
        // Update conversation in the list if it exists
        const index = state.conversations.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.conversations[index] = {
            id: action.payload.id,
            title: action.payload.title,
            agent_id: action.payload.agent_id,
            agent_name: state.conversations[index].agent_name, // Preserve agent name
            updated_at: action.payload.updated_at,
            message_count: action.payload.messages.length,
            last_message: action.payload.messages.length > 0 
              ? action.payload.messages[action.payload.messages.length - 1].content 
              : undefined,
          };
        }
      })
      .addCase(fetchConversation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        const { agentMessage, userMessage } = action.payload;
        
        // Create new messages for user and agent
        const userMsg: Message = {
          id: Date.now().toString(), // Temporary ID
          conversation_id: agentMessage.conversation_id,
          content: userMessage.content,
          role: 'user',
          tokens_used: 0,
          created_at: new Date().toISOString(),
        };
        
        const agentMsg: Message = {
          id: Date.now().toString() + 1, // Temporary ID
          conversation_id: agentMessage.conversation_id,
          content: agentMessage.content,
          role: 'assistant',
          tokens_used: agentMessage.tokens?.total || 0,
          created_at: new Date().toISOString(),
          metadata: agentMessage.metadata,
        };
        
        // Add messages to state
        state.messages.push(userMsg, agentMsg);
        
        // Set active conversation if not already set
        if (!state.activeConversationId) {
          state.activeConversationId = agentMessage.conversation_id;
        }
        
        // Update conversations list
        let conversationExists = false;
        
        state.conversations = state.conversations.map(conv => {
          if (conv.id === agentMessage.conversation_id) {
            conversationExists = true;
            return {
              ...conv,
              last_message: agentMessage.content,
              message_count: conv.message_count + 2, // User + Agent messages
              updated_at: new Date().toISOString(),
            };
          }
          return conv;
        });
        
        // If this is a new conversation, add it to the list
        if (!conversationExists) {
          state.conversations.push({
            id: agentMessage.conversation_id,
            agent_id: agentMessage.agent_id,
            agent_name: 'AI Agent', // Placeholder, would be replaced when fetching conversations
            title: userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? '...' : ''),
            last_message: agentMessage.content,
            message_count: 2, // User + Agent messages
            updated_at: new Date().toISOString(),
          });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { 
  setActiveConversation, 
  clearActiveConversation, 
  clearMessages, 
  clearErrors 
} = chatSlice.actions;

export default chatSlice.reducer;