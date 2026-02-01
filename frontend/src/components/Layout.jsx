import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Scan, Users } from 'lucide-react';

import { useGame } from '../context/GameContext';
import dictionaryIcon from '../assets/dictionary_icon.png'; // Keeping for fallback/history if needed
import notebookIcon from '../assets/mystical_notebook.png';

const Layout = ({ children }) => {
    const { money, literacy } = useGame();
    // Assuming 'growth' is a state or derived value from useGame,
    // but it's not present in the original code. For now, let's define a placeholder.
    // In a real app, you'd get this from context or calculate it.
    const growth = Math.floor(literacy / 10); // Example: Lvl 0-10 based on literacy 0-100
    const location = useLocation();

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-[#f4f1ea] relative overflow-hidden shadow-2xl border-x-4 border-[var(--color-wood-dark)]">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232d4a22' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>

            {/* Header / Top Info */}
            <header className="bg-[var(--color-forest-dark)] text-white py-1 px-3 z-10 shadow-md border-b-4 border-[var(--color-wood-medium)] flex items-center justify-between">
                <div className="flex items-center gap-0">
                    <div className="w-16 h-16 flex items-center justify-center p-0">
                        <img src={notebookIcon} alt="Logo" className="w-full h-full object-contain drop-shadow-md" style={{ imageRendering: 'pixelated' }} />
                    </div>
                    <span className="font-bold tracking-wide pixel-font text-2xl text-[var(--color-pastel-amber)] mt-1 -ml-1">ScanIt</span>
                </div>

                <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full border border-white/10">
                    <div className="w-24 h-3 bg-stone-700 rounded-full overflow-hidden border border-stone-500 relative">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-300 transition-all duration-500"
                            style={{ width: `${literacy}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-green-200">Lvl {growth}</span>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto relative z-0 custom-scrollbar pb-20 p-4">
                {/* The original `children` prop is replaced by `Outlet` if using React Router's nested routes */}
                {children || <Outlet />}
            </main>

            {/* Bottom Navigation relative to viewport if using fixed positioning, but here it is absolute in relative container */}
            <nav className="wood-panel absolute bottom-4 left-4 right-4 rounded-full flex justify-around items-center h-16 z-20 shadow-xl">
                <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full transition-all ${isActive ? 'text-[var(--color-pastel-amber)]' : 'text-stone-300 hover:text-white'}`}>
                    {({ isActive }) => (
                        <>
                            <Home size={20} className={isActive ? "drop-shadow-[0_0_5px_rgba(253,230,138,0.8)]" : ""} />
                            {isActive && <span className="text-[8px] font-bold tracking-widest mt-0.5 uppercase">Home</span>}
                        </>
                    )}
                </NavLink>

                <NavLink to="/scan" className="relative -top-6">
                    <div className="w-16 h-16 rounded-full moss-panel flex items-center justify-center transform transition-transform active:scale-95 shadow-lg border-[3px] border-[var(--color-parchment)]">
                        <Scan size={28} className="text-white drop-shadow-md" />
                    </div>
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full transition-all ${isActive ? 'text-[var(--color-pastel-purple)]' : 'text-stone-300 hover:text-white'}`}>
                    {({ isActive }) => (
                        <>
                            <Users size={20} className={isActive ? "drop-shadow-[0_0_5px_rgba(220,214,247,0.8)]" : ""} />
                            {isActive && <span className="text-[8px] font-bold tracking-widest mt-0.5 uppercase">Me</span>}
                        </>
                    )}
                </NavLink>
            </nav>
        </div>
    );
};

export default Layout;
