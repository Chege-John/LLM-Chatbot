import LLM "mo:llm";
import Time "mo:base/Time";
import Array "mo:base/Array";

actor DAOGovernanceAgent {
  
  // Types for DAO governance
  public type Proposal = {
    id: Nat;
    title: Text;
    description: Text;
    proposer: Text;
    votesFor: Nat;
    votesAgainst: Nat;
    status: Text; // "active", "passed", "rejected"
    timestamp: Int;
  };

  public type Vote = {
    proposalId: Nat;
    voter: Text;
    vote: Bool; // true for yes, false for no
    timestamp: Int;
  };

  // Simple stable storage using arrays
  private stable var proposalCounter: Nat = 0;
  private stable var proposalsData: [Proposal] = [];
  private stable var votesData: [Vote] = [];

  // AI prompt function for governance insights
  public func prompt(prompt : Text) : async Text {
    await LLM.prompt(#Llama3_1_8B, prompt);
  };

  // AI chat function for interactive governance discussions
  public func chat(messages : [LLM.ChatMessage]) : async Text {
    await LLM.chat(#Llama3_1_8B, messages);
  };

  // Create a new proposal
  public func createProposal(title: Text, description: Text, proposer: Text) : async Nat {
    let id = proposalCounter;
    let proposal: Proposal = {
      id = id;
      title = title;
      description = description;
      proposer = proposer;
      votesFor = 0;
      votesAgainst = 0;
      status = "active";
      timestamp = Time.now();
    };
    
    // Add to proposals array
    let newProposals = Array.append<Proposal>(proposalsData, [proposal]);
    proposalsData := newProposals;
    proposalCounter += 1;
    id
  };

  // Get all proposals
  public query func getProposals() : async [Proposal] {
    proposalsData
  };

  // Get a specific proposal
  public query func getProposal(id: Nat) : async ?Proposal {
    Array.find<Proposal>(proposalsData, func(p) = p.id == id)
  };

  // Cast a vote on a proposal
  public func vote(proposalId: Nat, voter: Text, voteChoice: Bool) : async Bool {
    // Find the proposal
    switch (Array.find<Proposal>(proposalsData, func(p) = p.id == proposalId)) {
      case null { false };
      case (?proposal) {
        if (proposal.status != "active") {
          return false;
        };

        // Check if user already voted
        let existingVote = Array.find<Vote>(votesData, func(v) = v.proposalId == proposalId and v.voter == voter);
        switch (existingVote) {
          case (?vote) { false }; // Already voted
          case null {
            // Record the vote
            let newVote: Vote = {
              proposalId = proposalId;
              voter = voter;
              vote = voteChoice;
              timestamp = Time.now();
            };
            let newVotes = Array.append<Vote>(votesData, [newVote]);
            votesData := newVotes;

            // Update proposal vote counts
            let updatedProposal = if (voteChoice) {
              {
                proposal with
                votesFor = proposal.votesFor + 1;
              }
            } else {
              {
                proposal with
                votesAgainst = proposal.votesAgainst + 1;
              }
            };

            // Replace the proposal in the array
            let updatedProposals = Array.map<Proposal, Proposal>(proposalsData, func(p) {
              if (p.id == proposalId) updatedProposal else p
            });
            proposalsData := updatedProposals;
            true
          };
        };
      };
    }
  };

  // AI-powered proposal analysis
  public func analyzeProposal(proposalId: Nat) : async Text {
    switch (Array.find<Proposal>(proposalsData, func(p) = p.id == proposalId)) {
      case null { "Proposal not found" };
      case (?proposal) {
        let analysisPrompt = "Analyze this DAO governance proposal for potential risks, benefits, and implementation considerations:\n\n" #
                           "Title: " # proposal.title # "\n" #
                           "Description: " # proposal.description # "\n" #
                           "Current votes - For: " # debug_show(proposal.votesFor) # ", Against: " # debug_show(proposal.votesAgainst) # "\n\n" #
                           "Provide a balanced analysis including potential risks, benefits, and recommendations.";
        
        await LLM.prompt(#Llama3_1_8B, analysisPrompt);
      };
    }
  };

  // AI-powered governance recommendations
  public func getGovernanceRecommendations() : async Text {
    let activeProposals = Array.filter<Proposal>(proposalsData, func(p) = p.status == "active");
    
    var proposalSummary = "";
    for (p in activeProposals.vals()) {
      proposalSummary := proposalSummary # "- " # p.title # " (For: " # debug_show(p.votesFor) # ", Against: " # debug_show(p.votesAgainst) # ")\n";
    };

    let recommendationPrompt = "Based on the following active DAO proposals, provide governance recommendations:\n\n" #
                              proposalSummary # "\n" #
                              "What should the DAO community prioritize? Are there any conflicts or synergies between proposals?";
    
    await LLM.prompt(#Llama3_1_8B, recommendationPrompt);
  };

  // Get voting statistics
  public query func getVotingStats() : async {totalProposals: Nat; activeProposals: Nat; totalVotes: Nat} {
    let activeProposals = Array.filter<Proposal>(proposalsData, func(p) = p.status == "active");
    
    {
      totalProposals = proposalCounter;
      activeProposals = activeProposals.size();
      totalVotes = votesData.size();
    }
  };

  // Helper function to get proposal count
  public query func getProposalCount() : async Nat {
    proposalCounter
  };

  // Helper function to check if user has voted on a proposal
  public query func hasVoted(proposalId: Nat, voter: Text) : async Bool {
    switch (Array.find<Vote>(votesData, func(v) = v.proposalId == proposalId and v.voter == voter)) {
      case null { false };
      case (?vote) { true };
    }
  };

  // Get votes for a specific proposal
  public query func getProposalVotes(proposalId: Nat) : async [Vote] {
    Array.filter<Vote>(votesData, func(v) = v.proposalId == proposalId)
  };
}