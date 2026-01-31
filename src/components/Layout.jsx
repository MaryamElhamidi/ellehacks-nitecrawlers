import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Map, Users, Leaf } from 'lucide-react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-green-50 font-sans text-stone-800 pb-20 overflow-hidden relative">
            {/* Background decorations - simple circles to mimic AC islands/clouds */}
            <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="max-w-md mx-auto min-h-screen relative z-10 flex flex-col">
                {/* Top Status Bar (Mock) */}
                <div className="p-4 flex justify-between items-center bg-transparent">
                    <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/50">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800 text-sm">Nook Inc.</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-yellow-100/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-yellow-200">
                        <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-yellow-600 flex items-center justify-center text-[10px] font-bold text-yellow-800">$</div>
                        <span className="font-bold text-yellow-800 text-sm">1,250</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 p-4 flex flex-col">
                    {children}
                </main>
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50">
                <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-green-100 px-6 py-3 flex justify-between items-end pb-6 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                    <NavLink to="/" className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-green-600 -translate-y-2' : 'text-stone-400 hover:text-stone-600'}`}>
                        <div className={`p-2 rounded-full transition-all duration-300 ${({ isActive }) => isActive ? 'bg-green-100 shadow-inner' : ''}`}>
                            <Camera size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold tracking-wide">Scan</span>
                    </NavLink>

                    <NavLink to="/choice" className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-blue-500 -translate-y-2' : 'text-stone-400 hover:text-stone-600'}`}>
                        <div className={`p-2 rounded-full transition-all duration-300 ${({ isActive }) => isActive ? 'bg-blue-100 shadow-inner' : ''}`}>
                            <Map size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold tracking-wide">Island</span>
                    </NavLink>

                    <NavLink to="/parent" className={({ isActive }) => `flex flex-col items-center space-y-1 transition-all ${isActive ? 'text-orange-500 -translate-y-2' : 'text-stone-400 hover:text-stone-600'}`}>
                        <div className={`p-2 rounded-full transition-all duration-300 ${({ isActive }) => isActive ? 'bg-orange-100 shadow-inner' : ''}`}>
                            <Users size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-bold tracking-wide">Family</span>
                    </NavLink>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
