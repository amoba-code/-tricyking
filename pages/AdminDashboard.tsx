import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, FileText, CheckCircle, XCircle, DollarSign, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { driverRequests, approveDriver, users, transactions } = useApp();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DRIVERS' | 'TRANSACTIONS'>('OVERVIEW');

  // Analytics Data
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const activeDrivers = users.filter(u => u.role === 'DRIVER').length;
  
  const revenueData = [
    { name: 'Mon', amount: 400 },
    { name: 'Tue', amount: 300 },
    { name: 'Wed', amount: 550 },
    { name: 'Thu', amount: 450 },
    { name: 'Fri', amount: 700 }, // Mock data for visuals
    { name: 'Today', amount: totalRevenue || 120 } 
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">TRICYKING <span className="text-yellow-500 text-xs">ADMIN</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <button onClick={() => setActiveTab('OVERVIEW')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'OVERVIEW' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-800'}`}>
                <Activity size={18} /> Overview
            </button>
            <button onClick={() => setActiveTab('DRIVERS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'DRIVERS' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-800'}`}>
                <Users size={18} /> Driver Requests
                {driverRequests.filter(r => r.status === 'PENDING').length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {driverRequests.filter(r => r.status === 'PENDING').length}
                    </span>
                )}
            </button>
            <button onClick={() => setActiveTab('TRANSACTIONS')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'TRANSACTIONS' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-800'}`}>
                <FileText size={18} /> Transactions
            </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        {/* Mobile Header Tabs */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
             <Button size="sm" variant={activeTab === 'OVERVIEW' ? 'primary' : 'secondary'} onClick={() => setActiveTab('OVERVIEW')}>Overview</Button>
             <Button size="sm" variant={activeTab === 'DRIVERS' ? 'primary' : 'secondary'} onClick={() => setActiveTab('DRIVERS')}>Drivers</Button>
             <Button size="sm" variant={activeTab === 'TRANSACTIONS' ? 'primary' : 'secondary'} onClick={() => setActiveTab('TRANSACTIONS')}>Log</Button>
        </div>

        {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-l-4 border-l-yellow-500">
                        <p className="text-gray-400 text-sm uppercase">Total Revenue</p>
                        <p className="text-3xl font-bold text-white mt-2">₱{totalRevenue.toLocaleString()}</p>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                        <p className="text-gray-400 text-sm uppercase">Active Drivers</p>
                        <p className="text-3xl font-bold text-white mt-2">{activeDrivers}</p>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                        <p className="text-gray-400 text-sm uppercase">Total Trips</p>
                        <p className="text-3xl font-bold text-white mt-2">{transactions.length}</p>
                    </Card>
                </div>

                <Card title="Revenue Analytics">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                                    itemStyle={{ color: '#E5E7EB' }}
                                />
                                <Bar dataKey="amount" fill="#EAB308" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        )}

        {activeTab === 'DRIVERS' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Driver Applications</h2>
                <div className="space-y-4">
                    {driverRequests.length === 0 && <p className="text-gray-500">No requests found.</p>}
                    {driverRequests.map(req => (
                        <Card key={req.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h3 className="font-bold text-white text-lg">{req.fullName}</h3>
                                <div className="text-sm text-gray-400 space-y-1">
                                    <p>License: <span className="text-gray-300">{req.licenseNumber}</span></p>
                                    <p>Contact: <span className="text-gray-300">{req.contactNumber}</span></p>
                                    <p>Status: <span className={`font-bold ${req.status === 'APPROVED' ? 'text-green-500' : req.status === 'REJECTED' ? 'text-red-500' : 'text-yellow-500'}`}>{req.status}</span></p>
                                    {req.generatedUsername && <p className="text-yellow-500">Assigned User: {req.generatedUsername} / {req.generatedPassword}</p>}
                                </div>
                            </div>
                            {req.status === 'PENDING' && (
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button variant="success" onClick={() => {
                                        const username = `driver${Math.floor(Math.random() * 1000)}`;
                                        approveDriver(req.id, username);
                                    }}>
                                        Approve & Generate ID
                                    </Button>
                                    <Button variant="danger" disabled>Reject</Button>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'TRANSACTIONS' && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Transaction Logs</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-900 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Passenger</th>
                                <th className="px-6 py-3">Driver</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {transactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-900/50">
                                    <td className="px-6 py-4 font-mono text-xs">{t.id}</td>
                                    <td className="px-6 py-4">{t.date}</td>
                                    <td className="px-6 py-4">{t.passengerName}</td>
                                    <td className="px-6 py-4">{t.driverName}</td>
                                    <td className="px-6 py-4 text-right font-bold text-yellow-500">₱{t.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No transactions recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};