import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getAgentById } from '@/features/agents/agentsSlice';
import AgentBuilder from '@/components/agents/AgentBuilder';
import Button from '@/components/common/Button';

const AgentBuilderPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentAgent, status, error } = useAppSelector(state => state.agents);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  
  useEffect(() => {
    // If agentId is provided, we're in edit mode
    if (agentId) {
      setIsEdit(true);
      dispatch(getAgentById(agentId));
    } else {
      setIsEdit(false);
    }
  }, [agentId, dispatch]);
  
  const handleBack = () => {
    if (isEdit && agentId) {
      navigate(`/dashboard/agents/${agentId}`);
    } else {
      navigate('/dashboard/agents');
    }
  };
  
  // Loading state
  if (isEdit && status === 'loading') {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Error state
  if (isEdit && error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    );
  }
  
  // Edit mode but agent not found
  if (isEdit && !currentAgent && status !== 'loading') {
    return (
      <div className="p-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                The agent you're trying to edit could not be found or you don't have permission to access it.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Agent' : 'Create New Agent'}</h1>
        <Button
          variant="outline"
          onClick={handleBack}
          leftIcon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          }
        >
          Back
        </Button>
      </div>
      
      <AgentBuilder isEdit={isEdit} />
    </div>
  );
};

export default AgentBuilderPage;