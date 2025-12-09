import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Bike, UserPlus, LogIn, HardHat } from 'lucide-react';

export const Auth: React.FC = () => {
  const [view, setView] = useState<'LOGIN' | 'REGISTER_PASSENGER' | 'REQUEST_DRIVER'>('LOGIN');
  const { login, registerPassenger, requestDriverAccount } = useApp();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [license, setLicense] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (!success) setError('Invalid username or password');
  };

  const handlePassengerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerPassenger(fullName, username, password);
    setSuccessMsg('Registration successful! Please login.');
    setTimeout(() => {
        setSuccessMsg('');
        setView('LOGIN');
    }, 2000);
  };

  const handleDriverRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestDriverAccount(fullName, license, contact);
    setSuccessMsg('Application submitted. Wait for Admin approval.');
    setTimeout(() => {
        setSuccessMsg('');
        setView('LOGIN');
    }, 3000);
  };

  const bgImage = "https://images.unsplash.com/photo-1596422730379-3c35b7194883?q=80&w=2070&auto=format&fit=crop";

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-80"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-black bg-opacity-90 border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="flex justify-center mb-6">
            <div className="bg-yellow-500 p-3 rounded-full">
                <Bike className="w-8 h-8 text-black" />
            </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-2">TRICYKING</h2>
        <p className="text-gray-400 text-center mb-8">
            {view === 'LOGIN' && 'Sign in to your account'}
            {view === 'REGISTER_PASSENGER' && 'Create a Passenger Account'}
            {view === 'REQUEST_DRIVER' && 'Join as a Driver'}
        </p>

        {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">{error}</div>}
        {successMsg && <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded text-green-200 text-sm text-center">{successMsg}</div>}

        {view === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
            <Button fullWidth type="submit" className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> Sign In
            </Button>
            <div className="mt-6 flex flex-col gap-2">
                <p className="text-gray-500 text-sm text-center">Don't have an account?</p>
                <div className="flex gap-2">
                    <Button type="button" variant="secondary" fullWidth onClick={() => setView('REGISTER_PASSENGER')} className="text-sm">
                        Passenger Sign Up
                    </Button>
                    <Button type="button" variant="secondary" fullWidth onClick={() => setView('REQUEST_DRIVER')} className="text-sm">
                        Driver Application
                    </Button>
                </div>
            </div>
          </form>
        )}

        {view === 'REGISTER_PASSENGER' && (
          <form onSubmit={handlePassengerRegister} className="space-y-4">
            <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
            <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button fullWidth type="submit">Sign Up</Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => setView('LOGIN')}>Back to Login</Button>
          </form>
        )}

        {view === 'REQUEST_DRIVER' && (
          <form onSubmit={handleDriverRequest} className="space-y-4">
            <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
            <Input label="License Number" value={license} onChange={e => setLicense(e.target.value)} required />
            <Input label="Contact Number" value={contact} onChange={e => setContact(e.target.value)} required />
            <div className="bg-gray-800 p-3 rounded text-xs text-gray-400">
                Note: Admin will review your application and provide login credentials upon approval.
            </div>
            <Button fullWidth type="submit">Submit Application</Button>
            <Button type="button" variant="secondary" fullWidth onClick={() => setView('LOGIN')}>Back to Login</Button>
          </form>
        )}
      </div>
    </div>
  );
};