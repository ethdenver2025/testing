export const typeDefs = `#graphql
  enum SkillTier {
    A3
    A2
    A1
  }

  enum JobStatus {
    OPEN
    IN_PROGRESS
    COMPLETED
    DISPUTED
  }

  type Worker {
    id: ID!
    address: String!
    name: String
    skillTier: SkillTier!
    reputationScore: Int!
    totalJobsCompleted: Int!
    totalEarnings: Float!
    isActive: Boolean!
    skills: [Skill!]!
    completedJobs: [Job!]!
  }

  type Skill {
    id: ID!
    name: String!
    category: String!
    level: Int!
    validations: Int!
  }

  type Job {
    id: ID!
    title: String!
    description: String!
    client: User!
    requiredTier: SkillTier!
    payment: Float!
    status: JobStatus!
    assignedWorker: Worker
    requiredSkills: [Skill!]!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    address: String!
    name: String
    isClient: Boolean!
    isWorker: Boolean!
    createdJobs: [Job!]!
  }

  type Query {
    worker(id: ID!): Worker
    job(id: ID!): Job
    recommendedJobs(workerId: ID!): [Job!]!
    availableJobs(
      skillTier: SkillTier
      category: String
      minPayment: Float
    ): [Job!]!
    workerStats(id: ID!): WorkerStats!
  }

  type WorkerStats {
    totalEarnings: Float!
    completionRate: Float!
    averageRating: Float!
    skillProgress: [SkillProgress!]!
  }

  type SkillProgress {
    skill: Skill!
    currentLevel: Int!
    progressToNext: Float!
    validationsNeeded: Int!
  }

  type Mutation {
    createJob(input: CreateJobInput!): Job!
    assignJob(jobId: ID!, workerId: ID!): Job!
    completeJob(jobId: ID!): Job!
    validateSkill(workerId: ID!, skillId: ID!): Skill!
    updateWorkerProfile(input: UpdateWorkerProfileInput!): Worker!
    raiseDispute(jobId: ID!, reason: String!): Job!
  }

  input CreateJobInput {
    title: String!
    description: String!
    requiredTier: SkillTier!
    payment: Float!
    requiredSkills: [ID!]!
  }

  input UpdateWorkerProfileInput {
    name: String
    skills: [ID!]
  }
`;

export const resolvers = {
  Query: {
    worker: async (_, { id }) => {
      // TODO: Implement worker query
      return null;
    },
    job: async (_, { id }) => {
      // TODO: Implement job query
      return null;
    },
    recommendedJobs: async (_, { workerId }) => {
      // TODO: Implement AI-driven job recommendations
      return [];
    },
    availableJobs: async (_, { skillTier, category, minPayment }) => {
      // TODO: Implement available jobs query with filters
      return [];
    },
    workerStats: async (_, { id }) => {
      // TODO: Implement worker statistics
      return null;
    },
  },
  Mutation: {
    createJob: async (_, { input }) => {
      // TODO: Implement job creation
      return null;
    },
    assignJob: async (_, { jobId, workerId }) => {
      // TODO: Implement job assignment
      return null;
    },
    completeJob: async (_, { jobId }) => {
      // TODO: Implement job completion
      return null;
    },
    validateSkill: async (_, { workerId, skillId }) => {
      // TODO: Implement skill validation
      return null;
    },
    updateWorkerProfile: async (_, { input }) => {
      // TODO: Implement worker profile update
      return null;
    },
    raiseDispute: async (_, { jobId, reason }) => {
      // TODO: Implement dispute system
      return null;
    },
  },
};
