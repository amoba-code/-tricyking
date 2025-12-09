import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Auth } from './pages/Auth';
import { PassengerDashboard } from './pages/PassengerDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LogOut, Bike } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentUser, logout } = useApp();

  // If not logged in, show Auth screen
  if (!currentUser) {
    return <Auth />;
  }

  // Header/Navbar for Dashboards (Admin has custom sidebar, but we can wrap generic top bar for others)
  const isPassengerOrDriver = currentUser.role === 'PASSENGER' || currentUser.role === 'DRIVER';

  return (
    <div className="min-h-screen bg-black text-gray-200">
        {isPassengerOrDriver && (
            <header className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Bike className="text-yellow-500" />
                            <span className="font-bold text-xl tracking-wider text-white">TRICYKING</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 hidden sm:block">Welcome, <span className="text-white font-medium">{currentUser.fullName}</span></span>
                            <button 
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        )}

        <main className={isPassengerOrDriver ? "py-6" : ""}>
            {currentUser.role === 'PASSENGER' && <PassengerDashboard />}
            {currentUser.role === 'DRIVER' && <DriverDashboard />}
            {currentUser.role === 'ADMIN' && <AdminDashboard />}
        </main>
        
        {/* Floating Logout for Admin (since it uses a full screen sidebar layout) */}
        {currentUser.role === 'ADMIN' && (
             <button 
                onClick={logout}
                className="fixed bottom-4 left-4 z-50 p-3 bg-red-900/80 text-white rounded-full hover:bg-red-800 shadow-lg md:hidden"
            >
                <LogOut className="w-5 h-5" />
            </button>
        )}
        {currentUser.role === 'ADMIN' && (
             <div className="fixed bottom-4 left-4 z-50 hidden md:block">
                  {/* Admin sidebar usually handles navigation, logout can be added there. 
                      Added a dedicated logout button in the sidebar in AdminDashboard usually, 
                      but for safety let's ensure logout is accessible via sidebar logic or here. 
                      Actually, AdminDashboard sidebar doesn't have logout. Let's add it here.
                  */}
                  <div className="w-56 fixed bottom-4 left-4">
                       <button onClick={logout} className="flex items-center gap-2 text-gray-500 hover:text-white px-4 py-2 w-full text-left transition-colors">
                            <LogOut size={16}/> Logout
                       </button>
                  </div>
             </div>
        )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;