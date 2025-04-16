import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import agentsReducer from '../features/agents/agentsSlice';
import chatReducer from '../features/chat/chatSlice';
import mcpReducer from '../features/mcp/mcpSlice';
import usersReducer from '../features/users/usersSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  agents: agentsReducer,
  chat: chatReducer,
  mcp: mcpReducer,
  users: usersReducer,
});