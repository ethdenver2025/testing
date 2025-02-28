import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

/**
 * Get detailed information about an event
 * @param eventId ID of the event
 * @returns Detailed event information
 */
export const getEventDetails = async (eventId: string) => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock event details in development');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockEventData.find(event => event.id === eventId) || mockEventData[0];
  }
  
  // In production, use the real API
  try {
    const response = await axios.get(
      `${API_URL}/api/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};

/**
 * Update event details
 * @param eventId ID of the event
 * @param eventData Updated event data
 * @returns Updated event information
 */
export const updateEvent = async (eventId: string, eventData: any) => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock update event in development');
    console.log('Updated data:', eventData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return merged data
    return {
      ...mockEventData.find(event => event.id === eventId),
      ...eventData,
      updatedAt: new Date().toISOString()
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.put(
      `${API_URL}/api/events/${eventId}`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Cancel an event
 * @param eventId ID of the event
 * @param reason Reason for cancellation
 * @returns Response with cancellation result
 */
export const cancelEvent = async (eventId: string, reason: string) => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock cancel event in development');
    console.log('Cancelling event:', eventId, 'Reason:', reason);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      message: 'Event cancelled successfully',
      eventId
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.post(
      `${API_URL}/api/events/${eventId}/cancel`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling event:', error);
    throw error;
  }
};

/**
 * Add a crew member to an event
 * @param eventId ID of the event
 * @param positionId ID of the position
 * @param crewId ID of the crew member
 * @returns Response with addition result
 */
export const addCrewMember = async (eventId: string, positionId: string, crewId: string) => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock add crew member in development');
    console.log('Adding crew:', crewId, 'to position:', positionId, 'in event:', eventId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return {
      success: true,
      message: 'Crew member added successfully',
      eventId,
      positionId,
      crewId
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.post(
      `${API_URL}/api/events/${eventId}/positions/${positionId}/crew`,
      { crewId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding crew member:', error);
    throw error;
  }
};

/**
 * Remove a crew member from an event
 * @param eventId ID of the event
 * @param positionId ID of the position
 * @param crewId ID of the crew member
 * @returns Response with removal result
 */
export const removeCrewMember = async (eventId: string, positionId: string, crewId: string) => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock remove crew member in development');
    console.log('Removing crew:', crewId, 'from position:', positionId, 'in event:', eventId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      success: true,
      message: 'Crew member removed successfully',
      eventId,
      positionId,
      crewId
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.delete(
      `${API_URL}/api/events/${eventId}/positions/${positionId}/crew/${crewId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing crew member:', error);
    throw error;
  }
};

/**
 * Fund escrow for an event
 * @param eventId ID of the event
 * @param amount Amount to fund (in wei)
 * @returns Response with funding result
 */
export const fundEscrow = async (eventId: string, amount: string) => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock fund escrow in development');
    console.log('Funding escrow for event:', eventId, 'Amount:', amount);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'Escrow funded successfully',
      eventId,
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      amount
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.post(
      `${API_URL}/api/events/${eventId}/escrow/fund`,
      { amount },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error funding escrow:', error);
    throw error;
  }
};

/**
 * Release escrow funds to crew members
 * @param eventId ID of the event
 * @param crewIds Array of crew member IDs to release funds to (if empty, releases to all assigned crew)
 * @returns Response with release result
 */
export const releaseEscrow = async (eventId: string, crewIds: string[] = []) => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock release escrow in development');
    console.log('Releasing escrow for event:', eventId, 'Crew IDs:', crewIds);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    return {
      success: true,
      message: crewIds.length ? `Escrow released to ${crewIds.length} crew members successfully` : 'Escrow released to all crew members successfully',
      eventId,
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      crewIds
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.post(
      `${API_URL}/api/events/${eventId}/escrow/release`,
      { crewIds },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error releasing escrow:', error);
    throw error;
  }
};

/**
 * Update call times for an event
 * @param eventId ID of the event
 * @param callTimes Updated call times
 * @returns Updated event information
 */
export const updateCallTimes = async (eventId: string, callTimes: any[]) => {
  // For development mode, return mock data
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock update call times in development');
    console.log('Updating call times for event:', eventId, 'Call times:', callTimes);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const eventData = mockEventData.find(event => event.id === eventId) || mockEventData[0];
    return {
      ...eventData,
      callTimes: callTimes,
      updatedAt: new Date().toISOString()
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.put(
      `${API_URL}/api/events/${eventId}/call-times`,
      { callTimes },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating call times:', error);
    throw error;
  }
};

// Mock event data for development
const mockEventData = [
  {
    id: 'event1',
    title: 'Music Festival Documentary',
    description: 'A documentary covering the annual downtown music festival featuring local bands and artists.',
    location: '123 Main St, Downtown',
    status: 'scheduled',
    startDate: '2025-04-15T09:00:00Z',
    endDate: '2025-04-17T18:00:00Z',
    budget: 15000,
    escrow: {
      total: 15000,
      funded: 7500,
      released: 0,
      contractAddress: '0x' + Math.random().toString(16).substr(2, 40)
    },
    organizer: {
      id: 'user_001',
      name: 'Jane Doe',
      email: 'jane@example.com'
    },
    callTimes: [
      {
        id: 'call1',
        date: '2025-04-15T08:00:00Z',
        location: 'Main Stage Entrance',
        description: 'Initial crew meeting and equipment setup',
        departments: ['Camera', 'Sound', 'Lighting']
      },
      {
        id: 'call2',
        date: '2025-04-16T07:30:00Z',
        location: 'West Entrance',
        description: 'Second day filming preparations',
        departments: ['Camera', 'Sound', 'Production Assistant']
      },
      {
        id: 'call3',
        date: '2025-04-17T08:30:00Z',
        location: 'North Stage',
        description: 'Final day filming and breakdown',
        departments: ['All Crew']
      }
    ],
    positions: [
      {
        id: 'pos1',
        title: 'Camera Operator',
        description: 'Primary camera operation for main stage performances',
        skills: ['Camera Operation', 'Cinematography', 'Live Event Filming'],
        payRate: 350,
        quantity: 2,
        isRequired: true,
        assignedCrew: [
          {
            id: 'crew1',
            name: 'Alex Johnson',
            avatar: '',
            skills: ['Camera Operation', 'Editing', 'Lighting'],
            trustScore: 85
          }
        ]
      },
      {
        id: 'pos2',
        title: 'Sound Engineer',
        description: 'Capture high-quality audio during performances',
        skills: ['Audio Recording', 'Boom Operation', 'Sound Mixing'],
        payRate: 325,
        quantity: 1,
        isRequired: true,
        assignedCrew: []
      },
      {
        id: 'pos3',
        title: 'Production Assistant',
        description: 'General assistance to the production team',
        skills: ['Organization', 'Communication', 'Logistics'],
        payRate: 200,
        quantity: 2,
        isRequired: false,
        assignedCrew: [
          {
            id: 'crew3',
            name: 'Sam Wilson',
            avatar: '',
            skills: ['Production Assistant', 'Set Design', 'Costume'],
            trustScore: 65
          }
        ]
      }
    ],
    createdAt: '2025-02-01T12:34:56Z',
    updatedAt: '2025-02-15T09:23:45Z'
  },
  {
    id: 'event2',
    title: 'Corporate Brand Campaign',
    description: 'A marketing video campaign for Acme Corporation showcasing their new product line.',
    location: 'Acme HQ, 456 Business Park',
    status: 'in_progress',
    startDate: '2025-03-20T08:00:00Z',
    endDate: '2025-03-22T17:00:00Z',
    budget: 22000,
    escrow: {
      total: 22000,
      funded: 22000,
      released: 5000,
      contractAddress: '0x' + Math.random().toString(16).substr(2, 40)
    },
    organizer: {
      id: 'user_001',
      name: 'Jane Doe',
      email: 'jane@example.com'
    },
    callTimes: [
      {
        id: 'call1',
        date: '2025-03-20T07:00:00Z',
        location: 'Acme HQ Lobby',
        description: 'First day call time for all crew',
        departments: ['All Crew']
      },
      {
        id: 'call2',
        date: '2025-03-21T07:30:00Z',
        location: 'Acme Product Lab',
        description: 'Second day product shots',
        departments: ['Camera', 'Lighting', 'Art Department']
      }
    ],
    positions: [
      {
        id: 'pos1',
        title: 'Director',
        description: 'Creative direction for the campaign',
        skills: ['Directing', 'Creative Vision', 'Leadership'],
        payRate: 500,
        quantity: 1,
        isRequired: true,
        assignedCrew: [
          {
            id: 'crew5',
            name: 'Taylor Martinez',
            avatar: '',
            skills: ['Editing', 'Color Grading', 'VFX', 'Directing'],
            trustScore: 88
          }
        ]
      },
      {
        id: 'pos2',
        title: 'Lighting Technician',
        description: 'Professional lighting setup for product shots',
        skills: ['Lighting', 'Grip Work', 'Electrical'],
        payRate: 300,
        quantity: 2,
        isRequired: true,
        assignedCrew: [
          {
            id: 'crew1',
            name: 'Alex Johnson',
            avatar: '',
            skills: ['Camera Operation', 'Editing', 'Lighting'],
            trustScore: 85
          }
        ]
      }
    ],
    createdAt: '2025-01-15T10:22:33Z',
    updatedAt: '2025-02-20T15:17:42Z'
  }
];

export const eventManagementService = {
  getEventDetails,
  updateEvent,
  cancelEvent,
  addCrewMember,
  removeCrewMember,
  fundEscrow,
  releaseEscrow,
  updateCallTimes
};

export default eventManagementService;
