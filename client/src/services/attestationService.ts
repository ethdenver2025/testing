import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

/**
 * Create skill attestation
 * @param recipientId ID of the recipient
 * @param skill The skill being attested
 * @param rating Rating from 1-5
 * @param comments Optional comments
 * @param eventId Optional event ID
 * @returns The created attestation
 */
export const createSkillAttestation = async (
  recipientId: string,
  skill: string,
  rating: number,
  comments?: string,
  eventId?: string
) => {
  const response = await axios.post(
    `${API_URL}/api/attestations/skill`,
    {
      recipientId,
      skill,
      rating,
      comments,
      eventId
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

/**
 * Create work ethic attestation
 * @param recipientId ID of the recipient
 * @param reliability Rating for reliability (1-5)
 * @param teamwork Rating for teamwork (1-5)
 * @param professionalism Rating for professionalism (1-5)
 * @param comments Optional comments
 * @param eventId Optional event ID
 * @returns The created attestation
 */
export const createWorkEthicAttestation = async (
  recipientId: string,
  reliability: number,
  teamwork: number,
  professionalism: number,
  comments?: string,
  eventId?: string
) => {
  const response = await axios.post(
    `${API_URL}/api/attestations/work-ethic`,
    {
      recipientId,
      reliability,
      teamwork,
      professionalism,
      comments,
      eventId
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  return response.data;
};

/**
 * Get a user's trust profile including attestations and trust score
 * @param userId The user ID
 * @returns The user's trust profile
 */
export const getUserTrustProfile = async (userId: string) => {
  // In development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock trust profile data for development');
    
    // Generate a trustScore based on the userId length
    const seedNumber = userId.length % 30 + 70; // Score between 70 and 100
    
    // Create mock data
    return {
      id: userId,
      username: 'Jane Doe',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      trustScore: seedNumber,
      attestationsReceived: [
        {
          id: 'att_001',
          attestationType: {
            id: 'type_001',
            name: 'Skill',
          },
          attester: {
            id: 'user_002',
            username: 'John Smith',
            trustScore: 85,
          },
          data: JSON.stringify({
            skill: 'Camera Operation',
            rating: 5,
            comments: 'Excellent attention to detail and responsive to direction.'
          }),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        },
        {
          id: 'att_002',
          attestationType: {
            id: 'type_002',
            name: 'Work Ethic',
          },
          attester: {
            id: 'user_003',
            username: 'Sarah Johnson',
            trustScore: 92,
          },
          data: JSON.stringify({
            reliability: 5,
            teamwork: 4,
            professionalism: 5,
            comments: 'Great team player and always on time.'
          }),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        },
        {
          id: 'att_003',
          attestationType: {
            id: 'type_001',
            name: 'Skill',
          },
          attester: {
            id: 'user_004',
            username: 'Robert Chen',
            trustScore: 78,
          },
          data: JSON.stringify({
            skill: 'Lighting',
            rating: 4,
            comments: 'Good understanding of lighting techniques for different scenes.'
          }),
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        }
      ]
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.get(
      `${API_URL}/api/attestations/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        timeout: 10000, // Set a timeout of 10 seconds
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user trust profile:', error);
    throw error;
  }
};

/**
 * Find crew members that match required skills with high trust scores
 * @param skills Array of required skills
 * @param minTrustScore Minimum trust score (default: 70)
 * @returns Matching crew members sorted by relevance
 */
export const findCrewForPosition = async (
  skills: string[],
  minTrustScore?: number
) => {
  const response = await axios.post(
    `${API_URL}/api/attestations/match-crew`,
    {
      skills,
      minTrustScore
    }
  );
  return response.data;
};

export const attestationService = {
  createSkillAttestation,
  createWorkEthicAttestation,
  getUserTrustProfile,
  findCrewForPosition,
};

export default attestationService;
