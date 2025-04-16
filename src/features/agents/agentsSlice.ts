import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Agent, AgentCreateRequest, AgentUpdateRequest, AgentWithStats } from '@/types';
import * as agentsAPI from './agentsAPI';

interface AgentsState {
  agents: Agent[];
  currentAgent: AgentWithStats | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AgentsState = {
  agents: [],
  currentAgent: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      return await agentsAPI.fetchUserAgents();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch agents');
    }
  }
);

export const getAgentById = createAsyncThunk(
  'agents/getAgentById',
  async (agentId: string, { rejectWithValue }) => {
    try {
      return await agentsAPI.getAgentById(agentId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch agent');
    }
  }
);

export const createAgent = createAsyncThunk(
  'agents/createAgent',
  async (agentData: AgentCreateRequest, { rejectWithValue }) => {
    try {
      return await agentsAPI.createAgent(agentData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create agent');
    }
  }
);

export const updateAgent = createAsyncThunk(
  'agents/updateAgent',
  async ({ agentId, agentData }: { agentId: string, agentData: AgentUpdateRequest }, { rejectWithValue }) => {
    try {
      return await agentsAPI.updateAgent(agentId, agentData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update agent');
    }
  }
);

export const deleteAgent = createAsyncThunk(
  'agents/deleteAgent',
  async (agentId: string, { rejectWithValue }) => {
    try {
      await agentsAPI.deleteAgent(agentId);
      return agentId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete agent');
    }
  }
);

// Agents slice
const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    clearCurrentAgent: (state) => {
      state.currentAgent = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAgents
      .addCase(fetchAgents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action: PayloadAction<Agent[]>) => {
        state.status = 'succeeded';
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // getAgentById
      .addCase(getAgentById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAgentById.fulfilled, (state, action: PayloadAction<AgentWithStats>) => {
        state.status = 'succeeded';
        state.currentAgent = action.payload;
        
        // Update agent in the list if it exists
        const index = state.agents.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        }
      })
      .addCase(getAgentById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // createAgent
      .addCase(createAgent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createAgent.fulfilled, (state, action: PayloadAction<Agent>) => {
        state.status = 'succeeded';
        state.agents.push(action.payload);
        state.currentAgent = action.payload as AgentWithStats;
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // updateAgent
      .addCase(updateAgent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateAgent.fulfilled, (state, action: PayloadAction<Agent>) => {
        state.status = 'succeeded';
        
        // Update the agent in the list
        const index = state.agents.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        }
        
        // Update currentAgent if it's the same agent
        if (state.currentAgent && state.currentAgent.id === action.payload.id) {
          state.currentAgent = {
            ...state.currentAgent,
            ...action.payload,
          };
        }
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // deleteAgent
      .addCase(deleteAgent.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteAgent.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.agents = state.agents.filter(agent => agent.id !== action.payload);
        
        // Clear currentAgent if it's the deleted agent
        if (state.currentAgent && state.currentAgent.id === action.payload) {
          state.currentAgent = null;
        }
      })
      .addCase(deleteAgent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentAgent, clearErrors } = agentsSlice.actions;

export default agentsSlice.reducer;