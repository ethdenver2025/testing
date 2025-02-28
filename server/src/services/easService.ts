import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// EAS contract address on Sepolia testnet
const EAS_CONTRACT_ADDRESS = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
// Schema registry address on Sepolia testnet
const SCHEMA_REGISTRY_ADDRESS = '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0';

// Skill attestation schema (example)
const SKILL_SCHEMA = 'uint8 rating,string skill,string comments';
// Work ethic attestation schema (example)
const WORK_ETHIC_SCHEMA = 'uint8 reliability,uint8 teamwork,uint8 professionalism,string comments';
// Project completion attestation schema
const PROJECT_COMPLETION_SCHEMA = 'uint32 projectId,string role,uint8 performance,string feedback';

/**
 * Initialize EAS with a provider and signer
 * @param privateKey The private key to use for signing attestations
 * @returns The initialized EAS instance
 */
const initializeEAS = (privateKey: string) => {
  // Provider pointing to Sepolia testnet
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY'
  );

  // Create a wallet with the private key
  const wallet = new ethers.Wallet(privateKey, provider);

  // Initialize EAS with the contract address and signer
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(wallet);

  return eas;
};

/**
 * Register a schema on EAS
 * @param eas The EAS instance
 * @param schema The schema string
 * @param resolverAddress The resolver contract address (optional)
 * @param revocable Whether the schema is revocable
 * @returns The schema UID
 */
const registerSchema = async (
  eas: EAS,
  schema: string,
  resolverAddress = '0x0000000000000000000000000000000000000000',
  revocable = true
) => {
  try {
    const schemaRegistry = await eas.getSchemaRegistry();
    const transaction = await schemaRegistry.register({
      schema,
      resolverAddress,
      revocable,
    });

    const receipt = await transaction.wait();
    return receipt.schemaUID;
  } catch (error) {
    console.error('Error registering schema:', error);
    throw error;
  }
};

/**
 * Create an attestation with EAS
 * @param eas The EAS instance
 * @param schema The schema string for the attestation
 * @param schemaUID The schema UID
 * @param recipient The recipient address
 * @param data The attestation data as a key-value object
 * @returns The attestation UID
 */
const createAttestation = async (
  eas: EAS,
  schema: string,
  schemaUID: string,
  recipient: string,
  data: Record<string, any>
) => {
  try {
    // Encode the data based on the schema
    const schemaEncoder = new SchemaEncoder(schema);
    const encodedData = schemaEncoder.encodeData(
      Object.keys(data).map(key => ({
        name: key,
        type: getTypeFromSchema(schema, key),
        value: data[key],
      }))
    );

    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient,
        data: encodedData,
        expirationTime: 0, // No expiration
      },
    });

    const receipt = await tx.wait();
    return receipt.uid;
  } catch (error) {
    console.error('Error creating attestation:', error);
    throw error;
  }
};

/**
 * Utility function to extract type from schema for a given name
 * @param schema The schema string
 * @param name The field name
 * @returns The field type
 */
const getTypeFromSchema = (schema: string, name: string): string => {
  const fields = schema.split(',');
  for (const field of fields) {
    const [type, fieldName] = field.trim().split(' ');
    if (fieldName === name) {
      return type;
    }
  }
  throw new Error(`Field ${name} not found in schema ${schema}`);
};

/**
 * Create a skill attestation
 * @param privateKey The private key of the attester
 * @param attesterId The database ID of the attester
 * @param recipientId The database ID of the recipient
 * @param recipientAddress The Ethereum address of the recipient
 * @param skill The skill being attested
 * @param rating The rating (1-5)
 * @param comments Any additional comments
 * @param eventId Optional event ID if the attestation is tied to an event
 * @returns The created attestation
 */
export const createSkillAttestation = async (
  privateKey: string,
  attesterId: string,
  recipientId: string,
  recipientAddress: string,
  skill: string,
  rating: number,
  comments: string,
  eventId?: string
) => {
  try {
    // Initialize EAS
    const eas = initializeEAS(privateKey);

    // Find or create attestation type
    let attestationType = await prisma.attestationType.findUnique({
      where: { name: 'Skill' },
    });

    if (!attestationType) {
      attestationType = await prisma.attestationType.create({
        data: {
          name: 'Skill',
          description: 'Attestation for skills and proficiency',
          schema: SKILL_SCHEMA,
        },
      });

      // Register schema on-chain
      if (!attestationType.onChainSchemaUID) {
        const schemaUID = await registerSchema(eas, SKILL_SCHEMA);
        await prisma.attestationType.update({
          where: { id: attestationType.id },
          data: { onChainSchemaUID: schemaUID },
        });
        attestationType.onChainSchemaUID = schemaUID;
      }
    }

    // Create attestation data
    const attestationData = {
      rating,
      skill,
      comments,
    };

    // Create on-chain attestation
    let uid;
    if (attestationType.onChainSchemaUID && process.env.NODE_ENV === 'production') {
      uid = await createAttestation(
        eas,
        SKILL_SCHEMA,
        attestationType.onChainSchemaUID,
        recipientAddress,
        attestationData
      );
    }

    // Store in database
    const attestation = await prisma.attestation.create({
      data: {
        uid,
        attestationTypeId: attestationType.id,
        attesterId,
        recipientId,
        data: JSON.stringify(attestationData),
        eventId,
      },
    });

    // Update recipient's trust score
    await updateUserTrustScore(recipientId);

    return attestation;
  } catch (error) {
    console.error('Error creating skill attestation:', error);
    throw error;
  }
};

/**
 * Create a work ethic attestation
 * @param privateKey The private key of the attester
 * @param attesterId The database ID of the attester
 * @param recipientId The database ID of the recipient
 * @param recipientAddress The Ethereum address of the recipient
 * @param reliability Rating for reliability (1-5)
 * @param teamwork Rating for teamwork (1-5)
 * @param professionalism Rating for professionalism (1-5)
 * @param comments Any additional comments
 * @param eventId Optional event ID if the attestation is tied to an event
 * @returns The created attestation
 */
export const createWorkEthicAttestation = async (
  privateKey: string,
  attesterId: string,
  recipientId: string,
  recipientAddress: string,
  reliability: number,
  teamwork: number,
  professionalism: number,
  comments: string,
  eventId?: string
) => {
  try {
    // Initialize EAS
    const eas = initializeEAS(privateKey);

    // Find or create attestation type
    let attestationType = await prisma.attestationType.findUnique({
      where: { name: 'WorkEthic' },
    });

    if (!attestationType) {
      attestationType = await prisma.attestationType.create({
        data: {
          name: 'WorkEthic',
          description: 'Attestation for work ethic and professional conduct',
          schema: WORK_ETHIC_SCHEMA,
        },
      });

      // Register schema on-chain
      if (!attestationType.onChainSchemaUID) {
        const schemaUID = await registerSchema(eas, WORK_ETHIC_SCHEMA);
        await prisma.attestationType.update({
          where: { id: attestationType.id },
          data: { onChainSchemaUID: schemaUID },
        });
        attestationType.onChainSchemaUID = schemaUID;
      }
    }

    // Create attestation data
    const attestationData = {
      reliability,
      teamwork,
      professionalism,
      comments,
    };

    // Create on-chain attestation
    let uid;
    if (attestationType.onChainSchemaUID && process.env.NODE_ENV === 'production') {
      uid = await createAttestation(
        eas,
        WORK_ETHIC_SCHEMA,
        attestationType.onChainSchemaUID,
        recipientAddress,
        attestationData
      );
    }

    // Store in database
    const attestation = await prisma.attestation.create({
      data: {
        uid,
        attestationTypeId: attestationType.id,
        attesterId,
        recipientId,
        data: JSON.stringify(attestationData),
        eventId,
      },
    });

    // Update recipient's trust score
    await updateUserTrustScore(recipientId);

    return attestation;
  } catch (error) {
    console.error('Error creating work ethic attestation:', error);
    throw error;
  }
};

/**
 * Update a user's trust score based on attestations
 * @param userId The user ID
 */
export const updateUserTrustScore = async (userId: string) => {
  try {
    // Get all attestations for the user
    const attestations = await prisma.attestation.findMany({
      where: { recipientId: userId, revoked: false },
      include: { attestationType: true },
    });

    if (attestations.length === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { trustScore: null },
      });
      return;
    }

    // Calculate trust score
    let skillScores: number[] = [];
    let ethicScores: number[] = [];

    for (const attestation of attestations) {
      const data = JSON.parse(attestation.data);

      if (attestation.attestationType.name === 'Skill') {
        skillScores.push(data.rating);
      } else if (attestation.attestationType.name === 'WorkEthic') {
        ethicScores.push((data.reliability + data.teamwork + data.professionalism) / 3);
      }
    }

    // Calculate average scores
    const avgSkillScore = skillScores.length > 0
      ? skillScores.reduce((sum, score) => sum + score, 0) / skillScores.length
      : 0;

    const avgEthicScore = ethicScores.length > 0
      ? ethicScores.reduce((sum, score) => sum + score, 0) / ethicScores.length
      : 0;

    // Weight scores (50% skills, 50% work ethic)
    const trustScore = (
      (avgSkillScore * 0.5) +
      (avgEthicScore * 0.5)
    ) / 5 * 100; // Scale to 0-100

    // Update user trust score
    await prisma.user.update({
      where: { id: userId },
      data: { trustScore },
    });
  } catch (error) {
    console.error('Error updating trust score:', error);
    throw error;
  }
};

/**
 * Get a user's trust score and attestations
 * @param userId The user ID
 * @returns The user's trust profile
 */
export const getUserTrustProfile = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        address: true,
        trustScore: true,
        attestationsReceived: {
          where: { revoked: false },
          include: {
            attestationType: true,
            attester: {
              select: {
                id: true,
                username: true,
                trustScore: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Ensure trustScore is initialized
    if (user.trustScore === null) {
      // If the user has no trust score yet, calculate it now
      await updateUserTrustScore(userId);
      
      // Fetch updated user
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { trustScore: true },
      });
      
      if (updatedUser) {
        user.trustScore = updatedUser.trustScore;
      } else {
        // Default to a baseline trust score if calculation failed
        user.trustScore = 70;
      }
    }

    // If no attestations but we need to return something
    if (!user.attestationsReceived || user.attestationsReceived.length === 0) {
      return {
        ...user,
        attestationsReceived: [],
      };
    }

    return {
      ...user,
      attestationsReceived: user.attestationsReceived,
    };
  } catch (error) {
    console.error('Error getting user trust profile:', error);
    throw error;
  }
};

/**
 * Find relevant crew members for a position based on skills and trust scores
 * @param skills Required skills for the position
 * @param minTrustScore Minimum trust score (0-100)
 * @returns Matching crew members sorted by relevance
 */
export const findCrewForPosition = async (skills: string[], minTrustScore = 70) => {
  try {
    // Get users with the required skills and minimum trust score
    const users = await prisma.user.findMany({
      where: {
        roles: { has: 'PRODUCTION_CREW' },
        trustScore: { gte: minTrustScore },
        skills: {
          some: {
            name: { in: skills },
          },
        },
      },
      include: {
        skills: true,
        attestationsReceived: {
          where: { 
            revoked: false,
            attestationType: {
              name: 'Skill',
            },
          },
          include: {
            attestationType: true,
          },
        },
      },
    });

    // Calculate relevance score for each user
    const scoredUsers = users.map(user => {
      // Base score from trust score
      let score = user.trustScore || 0;

      // Count matching skills
      const matchingSkills = user.skills.filter(skill => 
        skills.includes(skill.name)
      ).length;

      // Boost score for each matching skill
      score += (matchingSkills / skills.length) * 20;

      // Check for high ratings in specific skills
      for (const attestation of user.attestationsReceived) {
        const data = JSON.parse(attestation.data);
        if (skills.includes(data.skill) && data.rating >= 4) {
          score += 10; // Bonus for high rating in a required skill
        }
      }

      return {
        user: {
          id: user.id,
          username: user.username,
          trustScore: user.trustScore,
          skills: user.skills,
        },
        relevanceScore: Math.min(score, 100), // Cap at 100
      };
    });

    // Sort by relevance score
    return scoredUsers.sort((a, b) => b.relevanceScore - a.relevanceScore);
  } catch (error) {
    console.error('Error finding crew for position:', error);
    throw error;
  }
};

export const easService = {
  createSkillAttestation,
  createWorkEthicAttestation,
  getUserTrustProfile,
  updateUserTrustScore,
  findCrewForPosition,
};

export default easService;
