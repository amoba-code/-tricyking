import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, CheckCircle, XCircle, Navigation, Package } from 'lucide-react';
import { Chat } from '../components/Chat';

export const DriverDashboard: React.FC = () => {
  const { currentUser, rides, acceptRide, completeRide, updateDriverAvailability } = useApp();

  const activeJob = rides.find(r => r.driverId === currentUser?.id && ['ACCEPTED', 'IN_PROGRESS'].includes(r.status));
  const availableRides = rides.filter(r => r.status === 'SEARCHING');
  
  const isOnline = currentUser?.isAvailable;

  const toggleStatus = () => {
    if (currentUser) {
        updateDriverAvailability(currentUser.id, !currentUser.isAvailable);
    }
  };

  if (activeJob) {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Card title="Current Job" className="border-yellow-500">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded uppercase">
                                    {activeJob.status.replace('_', ' ')}
                                </span>
                                <span className="text-2xl font-bold text-white">₱{activeJob.fare.toFixed(2)}</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-500">PICKUP</label>
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                        {activeJob.pickupLocation}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">DROPOFF</label>
                                    <div className="flex items-center gap-2 text-white font-medium">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        {activeJob.dropoffLocation}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">BAGGAGE</label>
                                    <div className="flex items-center gap-2">
                                        {activeJob.baggage === 'NONE' && <span className="text-gray-400">None</span>}
                                        {activeJob.baggage === 'LIGHT' && <span className="text-green-500 flex items-center gap-1"><Package size={16}/> Light (+₱5)</span>}
                                        {activeJob.baggage === 'HEAVY' && <span className="text-red-500 flex items-center gap-1"><Package size={16}/> Heavy (+₱10)</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {activeJob.status === 'ACCEPTED' && (
                                <div className="w-full bg-blue-900/30 p-4 rounded border border-blue-500 text-center text-blue-200">
                                    Drive to pickup point
                                </div>
                            )}
                            {activeJob.status === 'IN_PROGRESS' && (
                                <Button fullWidth variant="success" onClick={() => completeRide(activeJob.id)}>
                                    <CheckCircle className="w-4 h-4 mr-2 inline" /> Complete Ride
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="h-full min-h-[300px]">
                        <Chat rideId={activeJob.id} />
                    </div>
                </div>
            </Card>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Driver Dashboard</h1>
        <Button 
            variant={isOnline ? 'success' : 'secondary'} 
            onClick={toggleStatus}
            className="flex items-center gap-2"
        >
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-white' : 'bg-gray-400'}`}></div>
            {isOnline ? 'You are Online' : 'You are Offline'}
        </Button>
      </div>

      {!isOnline ? (
        <Card className="text-center py-12 border-dashed border-2 border-gray-700">
            <h3 className="text-xl text-gray-400 mb-2">You are currently offline</h3>
            <p className="text-gray-600">Go online to start receiving ride requests.</p>
        </Card>
      ) : (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-300">Available Requests ({availableRides.length})</h2>
            {availableRides.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-900 rounded-lg border border-gray-800">
                    Waiting for new requests...
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {availableRides.map(ride => (
                        <div key={ride.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl hover:border-yellow-500 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-2xl font-bold text-white">₱{ride.fare.toFixed(2)}</span>
                                <span className="text-xs text-gray-400">{ride.distanceKm} km</span>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <div className="text-sm">
                                    <span className="text-green-500 font-bold text-xs block">FROM</span>
                                    <span className="text-gray-200 truncate block">{ride.pickupLocation}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-red-500 font-bold text-xs block">TO</span>
                                    <span className="text-gray-200 truncate block">{ride.dropoffLocation}</span>
                                </div>
                            </div>
                            
                            {ride.baggage !== 'NONE' && (
                                <div className="mb-4">
                                    <span className={`text-xs px-2 py-1 rounded ${ride.baggage === 'LIGHT' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                        {ride.baggage} BAGGAGE
                                    </span>
                                </div>
                            )}

                            <Button fullWidth onClick={() => currentUser && acceptRide(ride.id, currentUser.id)}>
                                Accept Ride
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
};