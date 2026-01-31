import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Search } from 'lucide-react';

const ScanScreen = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = () => {
        setIsScanning(true);
        // Simulate scanning delay
        setTimeout(() => {
            setIsScanning(false);
            navigate('/choice');
        }, 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[70vh] space-y-8 relative">
            {/* Instruction Bubble */}
            <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-stone-100 max-w-xs text-center relative animate-bounce-slow">
                <p className="text-stone-600 font-medium">Find something you bought recently!</p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-stone-100 transform rotate-45"></div>
            </div>

            {/* Camera Viewfinder */}
            <div className="relative w-64 h-64 bg-stone-800 rounded-3xl border-4 border-white shadow-xl overflow-hidden group">
                {/* Simulated content through camera */}
                <div className="absolute inset-0 bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center">
                    <Camera className="text-stone-600 opacity-50 w-16 h-16" />
                </div>

                {/* Scanning Overlay */}
                {isScanning && (
                    <div className="absolute inset-0 bg-green-500/20 z-10 animate-pulse flex items-center justify-center">
                        <Search className="text-white w-12 h-12 animate-spin" />
                    </div>
                )}

                {/* Viewfinder markings */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white/50 rounded-tl-lg"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white/50 rounded-tr-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white/50 rounded-bl-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white/50 rounded-br-lg"></div>
            </div>

            {/* Scan Button */}
            <button
                onClick={handleScan}
                disabled={isScanning}
                className="group relative"
            >
                <div className="absolute inset-0 bg-green-600 rounded-full translate-y-2 transition-transform group-hover:translate-y-3 group-active:translate-y-1"></div>
                <div className="relative bg-green-400 hover:bg-green-300 text-white font-bold text-xl px-8 py-4 rounded-full shadow-lg border-b-4 border-green-600 active:border-b-0 active:translate-y-2 transition-all flex items-center space-x-2">
                    <Camera size={24} className="group-hover:rotate-12 transition-transform" />
                    <span>{isScanning ? 'Scanning...' : 'Scan Object'}</span>
                </div>
            </button>
        </div>
    );
};

export default ScanScreen;
