import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Ride, DriverRequest, Transaction, ChatMessage, UserRole } from '../types';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  rides: Ride[];
  driverRequests: DriverRequest[];
  transactions: Transaction[];
  chatMessages: ChatMessage[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerPassenger: (fullName: string, username: string, password: string) => Promise<void>;
  requestDriverAccount: (fullName: string, license: string, contact: string) => Promise<void>;
  approveDriver: (requestId: string, username: string) => void;
  requestRide: (passengerId: string, pickup: string, dropoff: string, distance: number, baggage: 'NONE' | 'LIGHT' | 'HEAVY', fare: number) => void;
  acceptRide: (rideId: string, driverId: string) => void;
  completeRide: (rideId: string) => void;
  sendMessage: (rideId: string, senderId: string, senderName: string, text: string) => void;
  updateDriverAvailability: (driverId: string, isAvailable: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', username: 'admin', password: 'janromark', role: 'ADMIN', fullName: 'System Admin' },
  { id: 'u2', username: 'driver1', password: 'password', role: 'DRIVER', fullName: 'Juan Dela Cruz', isAvailable: true },
  { id: 'u3', username: 'pass1', password: 'password', role: 'PASSENGER', fullName: 'Maria Clara' }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [rides, setRides] = useState<Ride[]>([]);
  const [driverRequests, setDriverRequests] = useState<DriverRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Simulate persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('tricyking_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('tricyking_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('tricyking_user');
  };

  const registerPassenger = async (fullName: string, username: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      password,
      fullName,
      role: 'PASSENGER'
    };
    setUsers(prev => [...prev, newUser]);
  };

  const requestDriverAccount = async (fullName: string, license: string, contact: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRequest: DriverRequest = {
      id: `dr${Date.now()}`,
      fullName,
      licenseNumber: license,
      contactNumber: contact,
      status: 'PENDING'
    };
    setDriverRequests(prev => [...prev, newRequest]);
  };

  const approveDriver = (requestId: string, username: string) => {
    // Generate a default password for simplicity as per requirement flow
    const generatedPassword = `pass${Math.floor(1000 + Math.random() * 9000)}`;
    
    setDriverRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'APPROVED', generatedUsername: username, generatedPassword };
      }
      return req;
    }));

    const request = driverRequests.find(r => r.id === requestId);
    if (request) {
      const newUser: User = {
        id: `u${Date.now()}`,
        username: username,
        password: generatedPassword,
        role: 'DRIVER',
        fullName: request.fullName,
        isAvailable: false
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const requestRide = (passengerId: string, pickup: string, dropoff: string, distance: number, baggage: 'NONE' | 'LIGHT' | 'HEAVY', fare: number) => {
    const newRide: Ride = {
      id: `r${Date.now()}`,
      passengerId,
      pickupLocation: pickup,
      dropoffLocation: dropoff,
      distanceKm: distance,
      baggage,
      fare,
      status: 'SEARCHING',
      timestamp: Date.now()
    };
    setRides(prev => [newRide, ...prev]);
  };

  const acceptRide = (rideId: string, driverId: string) => {
    setRides(prev => prev.map(ride => 
      ride.id === rideId ? { ...ride, status: 'ACCEPTED', driverId } : ride
    ));
    // Simulate ride progress
    setTimeout(() => {
        setRides(prev => prev.map(ride => ride.id === rideId ? { ...ride, status: 'IN_PROGRESS' } : ride));
    }, 3000);
  };

  const completeRide = (rideId: string) => {
    const ride = rides.find(r => r.id === rideId);
    if (ride && ride.driverId) {
      setRides(prev => prev.map(r => 
        r.id === rideId ? { ...r, status: 'COMPLETED' } : r
      ));
      
      const driver = users.find(u => u.id === ride.driverId);
      const passenger = users.find(u => u.id === ride.passengerId);

      const newTransaction: Transaction = {
        id: `t${Date.now()}`,
        rideId: ride.id,
        amount: ride.fare,
        driverName: driver?.fullName || 'Unknown',
        passengerName: passenger?.fullName || 'Unknown',
        date: new Date().toLocaleDateString(),
        status: 'PAID'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Free up driver
      updateDriverAvailability(ride.driverId, true);
    }
  };

  const updateDriverAvailability = (driverId: string, isAvailable: boolean) => {
    setUsers(prev => prev.map(u => 
      u.id === driverId ? { ...u, isAvailable } : u
    ));
  };

  const sendMessage = (rideId: string, senderId: string, senderName: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      rideId,
      senderId,
      senderName,
      text,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      rides,
      driverRequests,
      transactions,
      chatMessages,
      login,
      logout,
      registerPassenger,
      requestDriverAccount,
      approveDriver,
      requestRide,
      acceptRide,
      completeRide,
      sendMessage,
      updateDriverAvailability
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
