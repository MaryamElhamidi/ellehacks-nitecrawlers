import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

import { Camera, Search, RefreshCw, Wallet, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { analyzeImage, estimatePrice } from '../services/visionService';

const ScanScreen = () => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const { hasOnboarded, money, setCurrentScannedItem, checkSimilarity } = useGame(); // Added checkSimilarity
    const [isScanning, setIsScanning] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);

    useEffect(() => {
        if (!hasOnboarded) {
            navigate('/onboarding');
        }
    }, [hasOnboarded, navigate]);

    const handleScan = useCallback(async () => {
        if (!webcamRef.current) return;

        setIsScanning(true);

        // Capture image
        const imageSrc = webcamRef.current.getScreenshot();

        if (imageSrc) {
            try {
                // Call Vision API
                const result = await analyzeImage(imageSrc);
                console.log("Vision API Result:", result);

                // Estimate price based on result
                const estimatedItem = estimatePrice(result.name);

                // Construct final item
                const validItem = {
                    name: result.name, // e.g. "Coffee Mug"
                    price: estimatedItem.price,
                    category: estimatedItem.category,
                    financialInfo: result.financialInfo, // Added financial info
                    raw: result.raw
                };

                // Check for similarity
                const similarItemName = checkSimilarity(validItem.name);
                if (similarItemName) {
                    alert(`HEY! This is similar to ${similarItemName} in your dictionary!`); // Simple notification for now
                }

                // Store in global state
                setCurrentScannedItem(validItem);

                // Allow a small delay for the animation to feel satisfying
                setTimeout(() => {
                    setIsScanning(false);
                    navigate('/choice');
                }, 1000);

            } catch (error) {
                console.error("Scan failed", error);
                setIsScanning(false);
                alert("Could not identify object. Is your API Key set?");
            }
        } else {
            setIsScanning(false);
        }
    }, [webcamRef, navigate, setCurrentScannedItem, checkSimilarity]);

    if (!hasOnboarded) return null;

    return (
        <div className="flex flex-col h-full bg-stone-50 overflow-hidden relative">

            {/* Header / Stats */}
            <div className="absolute top-4 right-4 z-20">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-stone-200 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-stone-700">${money}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative px-6">

                {/* Instruction Bubble */}
                <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-stone-100 max-w-xs text-center relative animate-bounce-slow z-20">
                    <p className="text-stone-600 font-medium">Point at an object and scan it!</p>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-stone-100 transform rotate-45"></div>
                </div>

                {/* Camera Viewfinder */}
                <div className="relative w-72 h-72 bg-stone-800 pixel-border shadow-xl overflow-hidden group rounded-none">
                    {/* Live Camera Feed */}
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "environment" }}
                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                            onUserMedia={() => setCameraReady(true)}
                        />
                        {!cameraReady && <Camera className="text-stone-600 w-12 h-12 animate-pulse" />}
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
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-[scan_1.5s_linear_infinite] z-10"></div>
                    )}

                    {/* Viewfinder markings */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white/60 rounded-tl-xl z-20"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white/60 rounded-tr-xl z-20"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white/60 rounded-bl-xl z-20"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white/60 rounded-br-xl z-20"></div>
                </div>

                {/* Scan Button */}
                <button
                    onClick={handleScan}
                    disabled={isScanning || !cameraReady}
                    className="group relative z-20"
                >
                    <div className="absolute inset-0 bg-green-600 rounded-full translate-y-2 transition-transform group-hover:translate-y-3 group-active:translate-y-1"></div>
                    <div className={`relative bg-green-400 hover:bg-green-300 text-white font-bold text-xl px-10 py-5 rounded-full shadow-lg border-b-4 border-green-600 active:border-b-0 active:translate-y-2 transition-all flex items-center space-x-3 ${!cameraReady ? 'opacity-50 grayscale' : ''}`}>
                        {isScanning ? (
                            <RefreshCw className="animate-spin w-6 h-6" />
                        ) : (
                            <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform fill-yellow-200 text-yellow-100" />
                        )}
                        <span>{isScanning ? 'Identifying...' : 'Snap & Scan'}</span>
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
