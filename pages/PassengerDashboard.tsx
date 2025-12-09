import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { BaggageType } from '../types';
import { MapPin, Navigation, Package, Briefcase, CheckCircle, Clock, Bike } from 'lucide-react';
import { Chat } from '../components/Chat';

export const PassengerDashboard: React.FC = () => {
  const { currentUser, requestRide, rides } = useApp();
  
  // State for booking
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [baggage, setBaggage] = useState<BaggageType>('NONE');
  const [distance, setDistance] = useState(5); // Default simulated distance
  
  // Find active ride
  const activeRide = rides.find(r => 
    r.passengerId === currentUser?.id && 
    ['SEARCHING', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status)
  );

  const calculateFare = () => {
    let fare = 25; // Base fare for 5km
    // Simple logic: +5 per km over 5km (Assumed rule for extra distance to make it realistic)
    if (distance > 5) {
        fare += (distance - 5) * 5;
    }

    if (baggage === 'LIGHT') fare += 5;
    if (baggage === 'HEAVY') fare += 10;
    return fare;
  };

  const handleRequest = () => {
    if (!currentUser) return;
    requestRide(currentUser.id, pickup, dropoff, distance, baggage, calculateFare());
  };

  if (activeRide) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
         <Card className="border-yellow-500/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {activeRide.status === 'SEARCHING' && <><Clock className="animate-spin text-yellow-500" /> Finding Driver...</>}
                        {activeRide.status === 'ACCEPTED' && <><Navigation className="text-green-500" /> Driver on the way!</>}
                        {activeRide.status === 'IN_PROGRESS' && <><Bike className="text-blue-500 animate-bounce" /> On route to destination</>}
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Ride ID: {activeRide.id}</p>
                </div>
                <div className="mt-4 md:mt-0 bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Fare</span>
                    <p className="text-xl font-bold text-yellow-500">₱{activeRide.fare.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="text-green-500 w-5 h-5 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500">PICKUP</p>
                                <p className="text-white font-medium">{activeRide.pickupLocation}</p>
                            </div>
                        </div>
                        <div className="w-0.5 h-6 bg-gray-700 ml-2.5"></div>
                        <div className="flex items-start gap-3">
                            <MapPin className="text-red-500 w-5 h-5 mt-1" />
                            <div>
                                <p className="text-xs text-gray-500">DROPOFF</p>
                                <p className="text-white font-medium">{activeRide.dropoffLocation}</p>
                            </div>
                        </div>
                    </div>
                    {activeRide.status !== 'SEARCHING' && (
                        <div className="bg-green-900/20 border border-green-900 p-4 rounded-lg">
                            <p className="text-green-400 font-medium">Your Driver has been assigned.</p>
                            <p className="text-sm text-gray-400">Please wait at the pickup point.</p>
                        </div>
                    )}
                </div>
                
                {/* Chat Section */}
                {activeRide.driverId && (
                    <div className="h-full">
                        <Chat rideId={activeRide.id} />
                    </div>
                )}
            </div>
         </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Book a Ride</h1>
      <p className="text-gray-400 mb-8">Secure and fast tricycle booking.</p>

      <Card>
        <div className="space-y-6">
            <div className="grid gap-4">
                <Input label="Pickup Location" placeholder="Enter pickup address" value={pickup} onChange={e => setPickup(e.target.value)} />
                <Input label="Destination" placeholder="Enter dropoff address" value={dropoff} onChange={e => setDropoff(e.target.value)} />
                
                {/* Distance Slider Simulator */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Distance Estimate: <span className="text-yellow-500 font-bold">{distance} km</span>
                    </label>
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={distance} 
                        onChange={e => setDistance(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Baggage Type</label>
                <div className="grid grid-cols-3 gap-3">
                    <button 
                        onClick={() => setBaggage('NONE')}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${baggage === 'NONE' ? 'border-gray-400 bg-gray-800' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}
                    >
                        <Briefcase className="w-6 h-6 mb-2 text-gray-400" />
                        <span className="text-xs font-bold text-gray-400">None</span>
                        <span className="text-xs text-gray-500">+₱0</span>
                    </button>

                    <button 
                        onClick={() => setBaggage('LIGHT')}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${baggage === 'LIGHT' ? 'border-green-500 bg-green-900/20' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}
                    >
                        <Package className="w-6 h-6 mb-2 text-green-500" />
                        <span className="text-xs font-bold text-green-500">Light</span>
                        <span className="text-xs text-gray-500">+₱5</span>
                    </button>

                    <button 
                        onClick={() => setBaggage('HEAVY')}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${baggage === 'HEAVY' ? 'border-red-500 bg-red-900/20' : 'border-gray-800 bg-gray-900 hover:bg-gray-800'}`}
                    >
                        <Package className="w-6 h-6 mb-2 text-red-500" />
                        <span className="text-xs font-bold text-red-500">Heavy</span>
                        <span className="text-xs text-gray-500">+₱10</span>
                    </button>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Estimated Fare</span>
                    <span className="text-2xl font-bold text-white">₱{calculateFare().toFixed(2)}</span>
                </div>
                <Button fullWidth onClick={handleRequest} disabled={!pickup || !dropoff}>
                    Find Driver
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
};