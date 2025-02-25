export interface WorkerProfile {
  skills: string[];
  experience: number;
  rating: number;
  completedJobs: number;
  specializations?: string[];
  certifications?: string[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  minimumExperience: number;
  minimumRating: number;
  payment: {
    amount: number;
    currency: string;
  };
}

export interface SkillClaim {
  skill: string;
  level: string;
  yearsOfExperience: number;
  certifications?: string[];
}

export interface Evidence {
  type: string;
  url: string;
  description: string;
  timestamp: number;
}

export interface DisputeData {
  jobId: string;
  workerId: string;
  clientId: string;
  disputeReason: string;
  evidence: Evidence[];
  timestamp: number;
}

export interface ReputationAction {
  type: string;
  value: number;
  reason: string;
}

export interface MarketContext {
  timeframe: string;
  categories: string[];
  metrics: string[];
}

export class WorkerService {
  private static instance: WorkerService;

  private constructor() {}

  public static getInstance(): WorkerService {
    if (!WorkerService.instance) {
      WorkerService.instance = new WorkerService();
    }
    return WorkerService.instance;
  }

  public async matchJobs(workerProfile: WorkerProfile, availableJobs: Job[]): Promise<Job[]> {
    // Simple matching algorithm based on skills and requirements
    return availableJobs.filter(job => {
      const hasRequiredSkills = job.requiredSkills.every(skill => 
        workerProfile.skills.includes(skill)
      );
      const meetsExperience = workerProfile.experience >= job.minimumExperience;
      const meetsRating = workerProfile.rating >= job.minimumRating;
      
      return hasRequiredSkills && meetsExperience && meetsRating;
    });
  }

  public async validateSkills(skillClaims: SkillClaim[], evidence: Evidence[]): Promise<boolean> {
    // Simple validation logic - in a real implementation, this would be more sophisticated
    return skillClaims.every(claim => {
      const relevantEvidence = evidence.filter(e => 
        e.description.toLowerCase().includes(claim.skill.toLowerCase())
      );
      return relevantEvidence.length > 0;
    });
  }

  public async analyzeDispute(disputeData: DisputeData): Promise<{
    resolution: string;
    recommendedAction: string;
  }> {
    // Simple dispute analysis - in a real implementation, this would be more sophisticated
    const hasEvidence = disputeData.evidence.length > 0;
    
    if (hasEvidence) {
      return {
        resolution: 'Dispute requires manual review',
        recommendedAction: 'Escalate to arbitration',
      };
    }
    
    return {
      resolution: 'Insufficient evidence',
      recommendedAction: 'Request additional evidence',
    };
  }

  public async updateReputation(
    userAddress: string,
    actions: ReputationAction[]
  ): Promise<number> {
    // Simple reputation calculation - in a real implementation, this would be more sophisticated
    const reputationChange = actions.reduce((total, action) => {
      return total + action.value;
    }, 0);

    // In a real implementation, this would update a persistent store
    return reputationChange;
  }

  public async getMarketInsights(context: MarketContext): Promise<{
    trends: string[];
    recommendations: string[];
  }> {
    // Mock insights - in a real implementation, this would analyze real market data
    return {
      trends: [
        'Increasing demand for smart contract developers',
        'Growing market for DeFi expertise',
      ],
      recommendations: [
        'Focus on acquiring Solidity skills',
        'Build portfolio with DeFi projects',
      ],
    };
  }
}
