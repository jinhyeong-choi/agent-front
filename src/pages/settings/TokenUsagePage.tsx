import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { get } from '@/utils/api';
import { updateTokenBalance } from '@/features/auth/authSlice';
import { TokenTransaction, TokenAgentUsage, TokenUsageSummary } from '@/types';
import { TOKEN_PACKAGES } from '@/config/constatns';

const TokenUsagePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [agentUsage, setAgentUsage] = useState<TokenAgentUsage[]>([]);
  const [summary, setSummary] = useState<TokenUsageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30'); // days
  
  // Fetch token data
  useEffect(() => {
    const fetchTokenData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch transactions
        const transactionsResponse = await get<TokenTransaction[]>('/tokens/transactions');
        setTransactions(transactionsResponse.data);
        
        // Fetch agent usage
        const usageResponse = await get<TokenAgentUsage[]>(`/tokens/usage/agents?start_date=${getStartDate(parseInt(dateRange))}`);
        setAgentUsage(usageResponse.data);
        
        // Fetch summary
        const summaryResponse = await get<TokenUsageSummary>(`/tokens/summary?days=${dateRange}`);
        setSummary(summaryResponse.data);
        
        // Update token balance in store
        if (user && summaryResponse.data.current_balance !== user.token_balance) {
          dispatch(updateTokenBalance(summaryResponse.data.current_balance));
        }
      } catch (error) {
        console.error('Failed to fetch token data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokenData();
  }, [dateRange, dispatch, user]);
  
  // Helper function to get start date based on days
  const getStartDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Handle purchase
  const handlePurchase = () => {
    navigate('/dashboard/settings/billing');
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Token Usage</h1>
      
      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="text-gray-500">View your token usage and balance</p>
          </div>
          
          <div className="mt-3 md:mt-0">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Current Balance</div>
              <div className="text-3xl font-bold text-blue-600">
                {user?.token_balance?.toLocaleString() || 0}
              </div>
              <button
                onClick={handlePurchase}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Purchase Tokens
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Total Usage</div>
              <div className="text-3xl font-bold text-blue-600">
                {summary?.total_usage?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Past {dateRange} days
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Purchased</div>
              <div className="text-3xl font-bold text-blue-600">
                {summary?.total_purchases?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Past {dateRange} days
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Agent Usage */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Agent Usage</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : agentUsage.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No agent usage data for the selected period
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-2 font-medium">Agent</th>
                  <th className="pb-2 font-medium text-right">Tokens Used</th>
                </tr>
              </thead>
              <tbody>
                {agentUsage.map((agent) => (
                  <tr key={agent.agent_id} className="border-b">
                    <td className="py-3">{agent.agent_name}</td>
                    <td className="py-3 text-right">{agent.total_tokens.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Purchase Options */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Purchase Tokens</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TOKEN_PACKAGES.map((pkg, idx) => (
            <div 
              key={idx} 
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                pkg.isPopular ? 'border-blue-300 bg-blue-50' : ''
              }`}
              onClick={handlePurchase}
            >
              {pkg.isPopular && (
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                  Popular
                </div>
              )}
              <div className="text-xl font-bold">{pkg.amount.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mb-2">tokens</div>
              <div className="text-lg font-medium">${pkg.price}</div>
              <div className="text-xs text-gray-500 mt-2">{pkg.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No transaction history
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-3 text-sm">{formatDate(transaction.created_at)}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        transaction.transaction_type === 'purchase' || transaction.transaction_type === 'grant'
                          ? 'bg-green-100 text-green-800'
                          : transaction.transaction_type === 'usage'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3">{transaction.description || '-'}</td>
                    <td className={`py-3 text-right ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenUsagePage;