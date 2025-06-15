import React, { useState, useEffect } from 'react';
import { MessageSquare, Vote, Plus, Brain, BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function DAOGovernanceAgent() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('proposals');
  const [newProposal, setNewProposal] = useState({ title: '', description: '', proposer: '' });
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [votingStats, setVotingStats] = useState({ totalProposals: 0, activeProposals: 0, totalVotes: 0 });
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Simulated backend calls (replace with actual ICP calls)
  const mockBackend = {
    async getProposals() {
      return [
        {
          id: 0,
          title: "Increase Treasury Allocation for Development",
          description: "Proposal to allocate 50,000 ICP tokens from treasury for dApp development grants",
          proposer: "alice.icp",
          votesFor: 15,
          votesAgainst: 3,
          status: "active",
          timestamp: Date.now() - 86400000 // 1 day ago
        },
        {
          id: 1,
          title: "Implement New Governance Token Distribution",
          description: "Change the token distribution mechanism to reward long-term holders",
          proposer: "bob.icp",
          votesFor: 8,
          votesAgainst: 12,
          status: "active",
          timestamp: Date.now() - 172800000 // 2 days ago
        }
      ];
    },

    async createProposal(title, description, proposer) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Math.floor(Math.random() * 1000);
    },

    async vote(proposalId, voter, voteChoice) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    },

    async analyzeProposal(proposalId) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return `AI Analysis for Proposal ${proposalId}:

**Benefits:**
- Could accelerate ecosystem development
- Provides clear funding mechanism for developers
- Aligns with DAO's growth objectives

**Risks:**
- Large treasury allocation might impact token value
- Need robust oversight mechanisms
- Potential for fund misuse without proper governance

**Recommendations:**
- Implement milestone-based funding releases
- Establish clear success metrics
- Consider smaller initial allocation with expansion based on results`;
    },

    async getGovernanceRecommendations() {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `Current Governance Recommendations:

**Priority Items:**
1. The treasury allocation proposal shows strong support - consider fast-tracking
2. Token distribution proposal is controversial - needs more community discussion

**Strategic Insights:**
- Both proposals impact tokenomics significantly
- Consider combining proposals for holistic approach
- Community sentiment suggests growth-focused priorities

**Action Items:**
- Schedule community call for token distribution debate
- Create detailed implementation timeline for treasury allocation
- Consider governance parameter adjustments for better participation`;
    },

    async getVotingStats() {
      return { totalProposals: 2, activeProposals: 2, totalVotes: 38 };
    }
  };

  useEffect(() => {
    loadProposals();
    loadVotingStats();
  }, []);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const data = await mockBackend.getProposals();
      setProposals(data);
    } catch (error) {
      console.error('Failed to load proposals:', error);
    }
    setLoading(false);
  };

  const loadVotingStats = async () => {
    try {
      const stats = await mockBackend.getVotingStats();
      setVotingStats(stats);
    } catch (error) {
      console.error('Failed to load voting stats:', error);
    }
  };

  const handleCreateProposal = async () => {
    if (!newProposal.title || !newProposal.description || !newProposal.proposer) return;

    setLoading(true);
    try {
      await mockBackend.createProposal(newProposal.title, newProposal.description, newProposal.proposer);
      setNewProposal({ title: '', description: '', proposer: '' });
      await loadProposals();
      setActiveTab('proposals');
    } catch (error) {
      console.error('Failed to create proposal:', error);
    }
    setLoading(false);
  };

  const handleVote = async (proposalId, voteChoice) => {
    setLoading(true);
    try {
      await mockBackend.vote(proposalId, 'current-user.icp', voteChoice);
      await loadProposals();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
    setLoading(false);
  };

  const handleAnalyzeProposal = async (proposalId) => {
    setLoading(true);
    try {
      const analysis = await mockBackend.analyzeProposal(proposalId);
      setAiAnalysis(analysis);
      setSelectedProposal(proposalId);
      setActiveTab('ai-analysis');
    } catch (error) {
      console.error('Failed to analyze proposal:', error);
    }
    setLoading(false);
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const recommendations = await mockBackend.getGovernanceRecommendations();
      setAiRecommendations(recommendations);
      setActiveTab('ai-recommendations');
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
    setLoading(false);
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">DAO Governance AI Agent</h1>
              <p className="text-gray-600">Intelligent governance powered by AI on Internet Computer</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{votingStats.totalProposals}</div>
                <div className="text-sm text-gray-500">Total Proposals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{votingStats.activeProposals}</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{votingStats.totalVotes}</div>
                <div className="text-sm text-gray-500">Total Votes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-xl mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('proposals')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'proposals' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Vote className="w-5 h-5 mr-2" />
              Proposals
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'create' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Proposal
            </button>
            <button
              onClick={handleGetRecommendations}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'ai-recommendations' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Brain className="w-5 h-5 mr-2" />
              AI Insights
            </button>
            <button
              onClick={() => setActiveTab('ai-analysis')}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === 'ai-analysis' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Analysis
            </button>
          </div>

          <div className="p-6">
            {/* Proposals Tab */}
            {activeTab === 'proposals' && (
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading proposals...</p>
                  </div>
                )}
                
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="border rounded-xl p-6 hover:shadow-lg transition-shadow bg-gradient-to-r from-white to-gray-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{proposal.title}</h3>
                        <p className="text-gray-600 mb-3">{proposal.description}</p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>Proposed by {proposal.proposer}</span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatTimeAgo(proposal.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          proposal.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {proposal.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          <span className="font-medium">{proposal.votesFor} For</span>
                        </div>
                        <div className="flex items-center text-red-600">
                          <XCircle className="w-5 h-5 mr-1" />
                          <span className="font-medium">{proposal.votesAgainst} Against</span>
                        </div>
                        
                        {/* Vote Progress Bar */}
                        <div className="flex-1 max-w-xs">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ 
                                width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleVote(proposal.id, true)}
                          disabled={loading}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          Vote Yes
                        </button>
                        <button
                          onClick={() => handleVote(proposal.id, false)}
                          disabled={loading}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                          Vote No
                        </button>
                        <button
                          onClick={() => handleAnalyzeProposal(proposal.id)}
                          disabled={loading}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
                        >
                          <Brain className="w-4 h-4 mr-1" />
                          AI Analyze
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Proposal Tab */}
            {activeTab === 'create' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proposal Title</label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal({...newProposal, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter proposal title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                    rows="6"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your proposal in detail..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proposer</label>
                  <input
                    type="text"
                    value={newProposal.proposer}
                    onChange={(e) => setNewProposal({...newProposal, proposer: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your-principal-id.icp"
                  />
                </div>
                
                <button
                  onClick={handleCreateProposal}
                  disabled={loading || !newProposal.title || !newProposal.description || !newProposal.proposer}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {loading ? 'Creating Proposal...' : 'Create Proposal'}
                </button>
              </div>
            )}

            {/* AI Recommendations Tab */}
            {activeTab === 'ai-recommendations' && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-6 h-6 mr-2 text-purple-600" />
                  AI Governance Recommendations
                </h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Analyzing governance data...</p>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 bg-white p-4 rounded-lg border">{aiRecommendations}</pre>
                  </div>
                )}
              </div>
            )}

            {/* AI Analysis Tab */}
            {activeTab === 'ai-analysis' && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                  AI Proposal Analysis
                  {selectedProposal !== null && (
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      - Proposal #{selectedProposal}
                    </span>
                  )}
                </h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Analyzing proposal...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 bg-white p-4 rounded-lg border">{aiAnalysis}</pre>
                  </div>
                ) : (
                  <p className="text-gray-600">Select a proposal from the Proposals tab and click "AI Analyze" to see detailed analysis here.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}