import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Mcp, McpServer, McpServerCreateRequest, McpServerUpdateRequest, McpFilters, McpPaginatedResponse } from '@/types';
import { get, post, put, del } from '@/utils/api';

interface McpState {
  mcps: Mcp[];
  currentMcp: Mcp | null;
  servers: McpServer[];
  currentServer: McpServer | null;
  popularTags: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalMcps: number;
  currentPage: number;
  totalPages: number;
}

const initialState: McpState = {
  mcps: [],
  currentMcp: null,
  servers: [],
  currentServer: null,
  popularTags: [],
  status: 'idle',
  error: null,
  totalMcps: 0,
  currentPage: 1,
  totalPages: 1,
};

// Async thunks
export const fetchAvailableMcps = createAsyncThunk(
  'mcp/fetchAvailableMcps',
  async (filters?: McpFilters, { rejectWithValue }) => {
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.tags) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }
      if (filters?.server_id) params.append('server_id', filters.server_id);
      if (filters?.is_public !== undefined) params.append('is_public', String(filters.is_public));
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await get<McpPaginatedResponse>(`/mcp${queryString}`);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch MCPs');
    }
  }
);

export const getMcpById = createAsyncThunk(
  'mcp/getMcpById',
  async (mcpId: string, { rejectWithValue }) => {
    try {
      const response = await get<Mcp>(`/mcp/${mcpId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch MCP');
    }
  }
);

export const fetchUserServers = createAsyncThunk(
  'mcp/fetchUserServers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get<McpServer[]>('/mcp/servers');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch MCP servers');
    }
  }
);

export const getServerById = createAsyncThunk(
  'mcp/getServerById',
  async (serverId: string, { rejectWithValue }) => {
    try {
      const response = await get<McpServer>(`/mcp/servers/${serverId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch MCP server');
    }
  }
);

export const registerServer = createAsyncThunk(
  'mcp/registerServer',
  async (serverData: McpServerCreateRequest, { rejectWithValue }) => {
    try {
      const response = await post<McpServer>('/mcp/servers', serverData);
      
      if (response.status !== 201) {
        throw new Error(response.message || 'Failed to register MCP server');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to register MCP server');
    }
  }
);

export const updateServer = createAsyncThunk(
  'mcp/updateServer',
  async ({ serverId, serverData }: { serverId: string, serverData: McpServerUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await put<McpServer>(`/mcp/servers/${serverId}`, serverData);
      
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to update MCP server');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update MCP server');
    }
  }
);

export const deleteServer = createAsyncThunk(
  'mcp/deleteServer',
  async (serverId: string, { rejectWithValue }) => {
    try {
      const response = await del(`/mcp/servers/${serverId}`);
      
      if (response.status !== 204) {
        throw new Error(response.message || 'Failed to delete MCP server');
      }
      
      return serverId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete MCP server');
    }
  }
);

export const discoverMcps = createAsyncThunk(
  'mcp/discoverMcps',
  async (serverId: string, { rejectWithValue }) => {
    try {
      const response = await post<Mcp[]>(`/mcp/servers/${serverId}/discover`);
      
      if (response.status !== 200) {
        throw new Error(response.message || 'Failed to discover MCPs');
      }
      
      return { serverId, mcps: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to discover MCPs');
    }
  }
);

// MCP slice
const mcpSlice = createSlice({
  name: 'mcp',
  initialState,
  reducers: {
    clearCurrentMcp: (state) => {
      state.currentMcp = null;
    },
    clearCurrentServer: (state) => {
      state.currentServer = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAvailableMcps
      .addCase(fetchAvailableMcps.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAvailableMcps.fulfilled, (state, action: PayloadAction<McpPaginatedResponse>) => {
        state.status = 'succeeded';
        state.mcps = action.payload.items;
        state.totalMcps = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.total_pages;
        state.popularTags = action.payload.popular_tags || [];
      })
      .addCase(fetchAvailableMcps.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // getMcpById
      .addCase(getMcpById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getMcpById.fulfilled, (state, action: PayloadAction<Mcp>) => {
        state.status = 'succeeded';
        state.currentMcp = action.payload;
        
        // Update MCP in the list if it exists
        const index = state.mcps.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.mcps[index] = action.payload;
        }
      })
      .addCase(getMcpById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // fetchUserServers
      .addCase(fetchUserServers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserServers.fulfilled, (state, action: PayloadAction<McpServer[]>) => {
        state.status = 'succeeded';
        state.servers = action.payload;
      })
      .addCase(fetchUserServers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // getServerById
      .addCase(getServerById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getServerById.fulfilled, (state, action: PayloadAction<McpServer>) => {
        state.status = 'succeeded';
        state.currentServer = action.payload;
        
        // Update server in the list if it exists
        const index = state.servers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.servers[index] = action.payload;
        }
      })
      .addCase(getServerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // registerServer
      .addCase(registerServer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerServer.fulfilled, (state, action: PayloadAction<McpServer>) => {
        state.status = 'succeeded';
        state.servers.push(action.payload);
        state.currentServer = action.payload;
      })
      .addCase(registerServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // updateServer
      .addCase(updateServer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateServer.fulfilled, (state, action: PayloadAction<McpServer>) => {
        state.status = 'succeeded';
        
        // Update server in the list
        const index = state.servers.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.servers[index] = action.payload;
        }
        
        state.currentServer = action.payload;
      })
      .addCase(updateServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // deleteServer
      .addCase(deleteServer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteServer.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.servers = state.servers.filter(server => server.id !== action.payload);
        
        if (state.currentServer && state.currentServer.id === action.payload) {
          state.currentServer = null;
        }
      })
      .addCase(deleteServer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // discoverMcps
      .addCase(discoverMcps.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(discoverMcps.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Add new MCPs to the list, avoiding duplicates
        const newMcps = action.payload.mcps.filter(
          newMcp => !state.mcps.some(existingMcp => existingMcp.id === newMcp.id)
        );
        
        state.mcps = [...state.mcps, ...newMcps];
      })
      .addCase(discoverMcps.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentMcp, clearCurrentServer, clearErrors } = mcpSlice.actions;

export default mcpSlice.reducer;