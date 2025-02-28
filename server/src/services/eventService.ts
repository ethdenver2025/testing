import { PrismaClient, Event, EventCrewPosition, Prisma } from '@prisma/client';
import { EventCreateDto, EventUpdateDto, EventCrewPositionDto } from '../types/event';

const prisma = new PrismaClient();

export const eventService = {
  /**
   * Create a new event
   */
  createEvent: async (eventData: EventCreateDto, organizerId: string): Promise<Event> => {
    try {
      // First check if the user has organizer role
      const user = await prisma.user.findUnique({
        where: { id: organizerId },
        select: { roles: true }
      });

      if (!user || !user.roles.includes('EVENT_ORGANIZER')) {
        throw new Error('User is not authorized to create events');
      }

      // Create event with crew positions
      const { crewPositions, ...eventDetails } = eventData;
      
      return await prisma.$transaction(async (tx) => {
        // Create the event
        const event = await tx.event.create({
          data: {
            ...eventDetails,
            organizerId,
            status: determineEventStatus(eventDetails.startDate, eventDetails.endDate),
            crewPositions: {
              create: crewPositions || []
            }
          },
          include: {
            crewPositions: true
          }
        });

        return event;
      });
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  /**
   * Get all events with optional filtering
   */
  getEvents: async (filters?: {
    status?: string;
    organizerId?: string;
    search?: string;
    upcoming?: boolean;
  }) => {
    try {
      const where: Prisma.EventWhereInput = {};
      
      if (filters?.status) {
        where.status = filters.status as any;
      }
      
      if (filters?.organizerId) {
        where.organizerId = filters.organizerId;
      }
      
      if (filters?.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { location: { contains: filters.search, mode: 'insensitive' } }
        ];
      }
      
      if (filters?.upcoming) {
        where.startDate = { gte: new Date() };
      }

      return await prisma.event.findMany({
        where,
        include: {
          crewPositions: {
            include: {
              _count: {
                select: { crew: true }
              }
            }
          },
          crew: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  profile: true
                }
              }
            }
          },
          organizer: {
            select: {
              id: true,
              username: true
            }
          }
        },
        orderBy: {
          startDate: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  /**
   * Get a single event by id
   */
  getEventById: async (eventId: string) => {
    try {
      return await prisma.event.findUnique({
        where: { id: eventId },
        include: {
          crewPositions: {
            include: {
              crew: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      profile: true
                    }
                  }
                }
              }
            }
          },
          crew: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  profile: true
                }
              },
              position: true
            }
          },
          organizer: {
            select: {
              id: true,
              username: true,
              profile: true
            }
          }
        }
      });
    } catch (error) {
      console.error(`Error fetching event with id ${eventId}:`, error);
      throw error;
    }
  },

  /**
   * Update an existing event
   */
  updateEvent: async (eventId: string, updateData: EventUpdateDto, userId: string): Promise<Event> => {
    try {
      // First verify the user is the event organizer
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.organizerId !== userId) {
        throw new Error('Unauthorized: Only the event organizer can update the event');
      }

      const { crewPositions, ...eventDetails } = updateData;

      return await prisma.$transaction(async (tx) => {
        // Update event details
        const updatedEvent = await tx.event.update({
          where: { id: eventId },
          data: {
            ...eventDetails,
            status: eventDetails.startDate && eventDetails.endDate 
              ? determineEventStatus(eventDetails.startDate, eventDetails.endDate)
              : undefined
          },
          include: {
            crewPositions: true
          }
        });

        // Handle crew positions if provided
        if (crewPositions && crewPositions.length > 0) {
          // Handle updates for existing positions or create new ones
          for (const position of crewPositions) {
            if (position.id) {
              // Update existing position
              await tx.eventCrewPosition.update({
                where: { id: position.id },
                data: {
                  title: position.title,
                  description: position.description,
                  skills: position.skills,
                  payRate: position.payRate,
                  quantity: position.quantity
                }
              });
            } else {
              // Create new position
              await tx.eventCrewPosition.create({
                data: {
                  ...position,
                  eventId: eventId
                }
              });
            }
          }
        }

        return updatedEvent;
      });
    } catch (error) {
      console.error(`Error updating event with id ${eventId}:`, error);
      throw error;
    }
  },

  /**
   * Delete an event
   */
  deleteEvent: async (eventId: string, userId: string): Promise<void> => {
    try {
      // First verify the user is the event organizer
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.organizerId !== userId) {
        throw new Error('Unauthorized: Only the event organizer can delete the event');
      }

      await prisma.$transaction([
        // Delete all crew applications
        prisma.eventCrew.deleteMany({
          where: { eventId }
        }),
        
        // Delete all crew positions
        prisma.eventCrewPosition.deleteMany({
          where: { eventId }
        }),
        
        // Delete the event
        prisma.event.delete({
          where: { id: eventId }
        })
      ]);
    } catch (error) {
      console.error(`Error deleting event with id ${eventId}:`, error);
      throw error;
    }
  },

  /**
   * Add a crew position to an event
   */
  addCrewPosition: async (eventId: string, positionData: EventCrewPositionDto, userId: string) => {
    try {
      // First verify the user is the event organizer
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { organizerId: true }
      });

      if (!event) {
        throw new Error('Event not found');
      }

      if (event.organizerId !== userId) {
        throw new Error('Unauthorized: Only the event organizer can add crew positions');
      }

      return await prisma.eventCrewPosition.create({
        data: {
          ...positionData,
          eventId
        }
      });
    } catch (error) {
      console.error('Error adding crew position:', error);
      throw error;
    }
  },

  /**
   * Apply for a crew position
   */
  applyForPosition: async (positionId: string, userId: string) => {
    try {
      // First check if the user has crew role
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { roles: true }
      });

      if (!user || !user.roles.includes('PRODUCTION_CREW')) {
        throw new Error('User is not authorized to apply for crew positions');
      }

      // Check if the position exists
      const position = await prisma.eventCrewPosition.findUnique({
        where: { id: positionId },
        include: { event: true }
      });

      if (!position) {
        throw new Error('Crew position not found');
      }

      // Check if user already applied
      const existingApplication = await prisma.eventCrew.findFirst({
        where: {
          userId,
          positionId
        }
      });

      if (existingApplication) {
        throw new Error('You have already applied for this position');
      }

      // Create the application
      return await prisma.eventCrew.create({
        data: {
          userId,
          positionId,
          eventId: position.event.id,
          status: 'APPLIED'
        },
        include: {
          position: true,
          event: true
        }
      });
    } catch (error) {
      console.error('Error applying for position:', error);
      throw error;
    }
  },

  /**
   * Update application status (for organizers to hire/reject)
   */
  updateApplicationStatus: async (applicationId: string, status: string, userId: string) => {
    try {
      // First get the application and verify the user is the event organizer
      const application = await prisma.eventCrew.findUnique({
        where: { id: applicationId },
        include: {
          event: true
        }
      });

      if (!application) {
        throw new Error('Application not found');
      }

      if (application.event.organizerId !== userId) {
        throw new Error('Unauthorized: Only the event organizer can update application status');
      }

      // If hiring, update position filled count
      if (status === 'HIRED' && application.status !== 'HIRED') {
        await prisma.eventCrewPosition.update({
          where: { id: application.positionId },
          data: {
            filled: {
              increment: 1
            }
          }
        });
      } else if (application.status === 'HIRED' && status !== 'HIRED') {
        // If un-hiring, decrement filled count
        await prisma.eventCrewPosition.update({
          where: { id: application.positionId },
          data: {
            filled: {
              decrement: 1
            }
          }
        });
      }

      return await prisma.eventCrew.update({
        where: { id: applicationId },
        data: {
          status: status as any,
          hiredDate: status === 'HIRED' ? new Date() : application.hiredDate
        },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          },
          position: true
        }
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }
};

/**
 * Helper function to determine event status based on dates
 */
function determineEventStatus(startDate: Date, endDate: Date): string {
  const now = new Date();
  
  if (now > endDate) {
    return 'COMPLETED';
  } else if (now >= startDate && now <= endDate) {
    return 'ACTIVE';
  } else if (startDate.getTime() - now.getTime() < 14 * 24 * 60 * 60 * 1000) {
    // If less than 14 days until event
    return 'UPCOMING';
  } else {
    return 'PLANNING';
  }
}
