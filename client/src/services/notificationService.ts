import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

/**
 * Send notifications to crew members about an event
 * @param eventId ID of the event
 * @param crewIds Array of crew member IDs to notify
 * @param message Custom message to include
 * @returns Response with notification results
 */
export const notifyCrew = async (
  eventId: string,
  crewIds: string[],
  message: string
) => {
  // For development mode, return mock success response
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock notification service in development');
    console.log(`Notifying ${crewIds.length} crew members about event ${eventId}`);
    console.log(`Message: ${message}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      notifiedCount: crewIds.length,
      event: { id: eventId },
      message: 'Notifications sent successfully'
    };
  }
  
  // In production, use the real API
  try {
    const response = await axios.post(
      `${API_URL}/api/notifications/crew`,
      {
        eventId,
        crewIds,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending crew notifications:', error);
    throw error;
  }
};

/**
 * Get notification history for an organizer
 * @returns List of past notifications sent
 */
export const getNotificationHistory = async () => {
  // For development mode, return mock history
  if (process.env.NODE_ENV === 'development') {
    console.log('Using mock notification history in development');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'notif1',
        eventId: 'event1',
        eventName: 'Music Festival Documentary',
        crewCount: 12,
        sentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered'
      },
      {
        id: 'notif2',
        eventId: 'event2',
        eventName: 'Corporate Brand Campaign',
        crewCount: 8,
        sentDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered'
      }
    ];
  }
  
  // In production, use the real API
  try {
    const response = await axios.get(
      `${API_URL}/api/notifications/history`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching notification history:', error);
    throw error;
  }
};

export const notificationService = {
  notifyCrew,
  getNotificationHistory
};

export default notificationService;
