import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search, RefreshCw, Wallet } from 'lucide-react';
import { useGame } from '../context/GameContext';

const MOCK_ITEMS = [
    { name: 'Cool Sneakers', price: 85, category: 'fashion' },
    { name: 'Vintage Game', price: 45, category: 'entertainment' },
    { name: 'Bubble Tea', price: 8, category: 'food' },
    { name: 'Action Figure', price: 25, category: 'toy' },
    { name: 'Headphones', price: 60, category: 'tech' },
    { name: 'Comic Book', price: 12, category: 'book' },
    { name: 'New Skateboard', price: 120, category: 'sport' },
];

const ScanScreen = () => {
    const navigate = useNavigate();
    const { hasOnboarded, allowance, money, setCurrentScannedItem } = useGame();
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        if (!hasOnboarded) {
            navigate('/onboarding');
        }
    }, [hasOnboarded, navigate]);

    const handleScan = () => {
        setIsScanning(true);
        // Simulate scanning delay
        setTimeout(() => {
            const randomItem = MOCK_ITEMS[Math.floor(Math.random() * MOCK_ITEMS.length)];
            setCurrentScannedItem(randomItem);
            setIsScanning(false);
            navigate('/choice');
        }, 1500); // Slightly faster scan
    };

    if (!hasOnboarded) return null; // Prevent flash before redirect

    return (
        <div className="flex flex-col h-full bg-stone-50 overflow-hidden relative">

            {/* Header / Stats */}
            <div className="absolute top-4 right-4 z-10">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-stone-200 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-stone-700">${money}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative px-6">

                {/* Instruction Bubble */}
                <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-stone-100 max-w-xs text-center relative animate-bounce-slow">
                    <p className="text-stone-600 font-medium">Scan an item to see if it fits your budget!</p>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-stone-100 transform rotate-45"></div>
                </div>

                {/* Camera Viewfinder */}
                <div className="relative w-72 h-72 bg-stone-800 rounded-3xl border-4 border-white shadow-xl overflow-hidden group">
                    {/* Simulated content through camera */}
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                        <Camera className="text-stone-500 opacity-50 w-20 h-20" />
                    </div>

                    {/* Scanning Overlay */}
                    {isScanning && (
                        <div className="absolute inset-0 bg-green-500/20 z-10 flex items-center justify-center backdrop-blur-[2px]">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                                <Search className="text-white w-16 h-16 animate-pulse relative z-10" />
                            </div>
                        </div>
                    )}
                    {/* Scanning Line Animation */}
                    {isScanning && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-[scan_1.5s_linear_infinite]"></div>
                    )}


                    {/* Viewfinder markings */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white/60 rounded-tl-xl"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white/60 rounded-tr-xl"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white/60 rounded-bl-xl"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white/60 rounded-br-xl"></div>
                </div>

                {/* Scan Button */}
                <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="group relative"
                >
                    <div className="absolute inset-0 bg-green-600 rounded-full translate-y-2 transition-transform group-hover:translate-y-3 group-active:translate-y-1"></div>
                    <div className="relative bg-green-400 hover:bg-green-300 text-white font-bold text-xl px-10 py-5 rounded-full shadow-lg border-b-4 border-green-600 active:border-b-0 active:translate-y-2 transition-all flex items-center space-x-3">
                        {isScanning ? (
                            <RefreshCw className="animate-spin w-6 h-6" />
                        ) : (
                            <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        )}
                        <span>{isScanning ? 'Scanning...' : 'Scan Object'}</span>
                    </div>
                </button>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default ScanScreen;
