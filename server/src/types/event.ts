import { Decimal } from '@prisma/client/runtime/library';

// DTO for creating an event
export interface EventCreateDto {
  title: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  budget?: Decimal | number;
  crewPositions?: EventCrewPositionDto[];
}

// DTO for updating an event
export interface EventUpdateDto {
  title?: string;
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: Decimal | number;
  status?: string;
  crewPositions?: (EventCrewPositionDto & { id?: string })[];
}

// DTO for creating/updating a crew position
export interface EventCrewPositionDto {
  title: string;
  description?: string;
  skills: string[];
  payRate: Decimal | number;
  quantity: number;
}

// DTO for creating/updating a crew application
export interface EventCrewApplicationDto {
  positionId: string;
  message?: string;
}

// Response type for event list with additional computed properties
export interface EventWithDetails {
  id: string;
  title: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  budget?: Decimal;
  status: string;
  organizerId: string;
  createdAt: Date;
  updatedAt: Date;
  // Computed properties
  crewNeeded: number;
  crewHired: number;
  daysUntilEvent: number;
  applicantsCount: number;
  organizer: {
    id: string;
    username: string;
  };
  crewPositions: Array<{
    id: string;
    title: string;
    payRate: Decimal;
    quantity: number;
    filled: number;
  }>;
}
