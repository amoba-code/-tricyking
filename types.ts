export type UserRole = 'ADMIN' | 'DRIVER' | 'PASSENGER';

export interface User {
  id: string;
  username: string;
  password?: string; // Optional for security in real apps, kept here for simulation
  role: UserRole;
  fullName: string;
  isAvailable?: boolean; // For drivers
}

export interface DriverRequest {
  id: string;
  fullName: string;
  licenseNumber: string;
  contactNumber: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  generatedUsername?: string;
  generatedPassword?: string;
}

export type BaggageType = 'NONE' | 'LIGHT' | 'HEAVY';

export interface Ride {
  id: string;
  passengerId: string;
  driverId?: string;
  pickupLocation: string;
  dropoffLocation: string;
  distanceKm: number;
  baggage: BaggageType;
  fare: number;
  status: 'SEARCHING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  rideId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Transaction {
  id: string;
  rideId: string;
  amount: number;
  driverName: string;
  passengerName: string;
  date: string;
  status: 'PAID';
}
