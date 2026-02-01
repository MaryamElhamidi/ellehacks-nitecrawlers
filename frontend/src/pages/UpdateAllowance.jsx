import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Coins, ArrowLeft } from 'lucide-react';

export default function UpdateAllowance() {
    const { setAllowance, setAllowanceFrequency, setMoney, allowance: currentAllowance, allowanceFrequency: currentFrequency } = useGame();
    const [amount, setAmount] = useState(currentAllowance || 50);
    const [frequency, setFrequency] = useState(currentFrequency || 'weekly');
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    // No auto-redirect here!

    // Pre-fill with current values if available
    useEffect(() => {
        if (currentAllowance) setAmount(currentAllowance);
        if (currentFrequency) setFrequency(currentFrequency);
    }, [currentAllowance, currentFrequency]);

    return (
        <div className="flex flex-col h-full p-6 overflow-hidden bg-[#f4f1ea]">
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-30">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white rounded-full shadow-sm border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8 mt-10">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                        <Coins className="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 className="text-3xl ultra-bold text-stone-800 tracking-tight">Update Allowance</h1>
                    <p className="text-stone-500">Change your savings goals.</p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200 space-y-6">

                    {/* Amount Input */}
                    <div className="space-y-3">
                        <label className="text-sm ultra-bold text-stone-600 uppercase tracking-wider">ALLOWANCE AMOUNT</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-stone-400">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-10 pr-4 py-4 bg-stone-50 text-3xl font-bold text-stone-800 rounded-2xl border-2 border-stone-200 focus:border-blue-500 focus:outline-none transition-colors text-center"
                            />
                        </div>
                    </div>

                    {/* Frequency Toggle */}
                    <div className="space-y-3">
                        <label className="text-sm ultra-bold text-stone-600 uppercase tracking-wider">HOW OFTEN?</label>
                        <div className="grid grid-cols-2 gap-3 p-1 bg-stone-100 rounded-2xl">
                            <button
                                onClick={() => setFrequency('weekly')}
                                className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${frequency === 'weekly'
                                    ? 'bg-white text-blue-700 shadow-sm'
                                    : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setFrequency('monthly')}
                                className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${frequency === 'monthly'
                                    ? 'bg-white text-blue-700 shadow-sm'
                                    : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        disabled={isSaving}
                        onClick={() => {
                            if (isSaving) return;
                            setIsSaving(true);
                            console.log("Updating allowance...");

                            try {
                                const value = Number(amount);

                                // 1. Update React State
                                setAllowance(value);
                                setAllowanceFrequency(frequency);
                                // Note: We might NOT want to reset money here, or maybe we do? 
                                // User asked to "update amount of money we have", so maybe reset?
                                // Let's update money to match allowance if it's an "allowance update", 
                                // OR just update the allowance setting. 
                                // The user said "update the amount of money we have", which implies resetting the balance.
                                // I'll stick to updating the allowance setting and maybe adding the difference? 
                                // Actually, for simplicity and meeting the "onboarding" feel, let's reset or set.
                                // But resetting money might lose game progress. 
                                // Let's just update the *allowance setting* for now. 
                                // Wait, the user said "so we can update the amount of money we have". 
                                // In onboarding, "money" is initialized to "allowance".
                                // So I will update `money` too to match the new allowance, acting as a "reset" or "adjustment".
                                setMoney(value);

                                // 2. FORCE Manual Persistence
                                localStorage.setItem('nitecrawlers_allowance', JSON.stringify(value));
                                localStorage.setItem('nitecrawlers_allowanceFrequency', JSON.stringify(frequency));
                                localStorage.setItem('nitecrawlers_money', JSON.stringify(value)); // Resetting money to new allowance

                                console.log("Manual persistence complete. Navigating back...");

                                setTimeout(() => {
                                    navigate(-1); // Go back to where they came from
                                }, 500);
                            } catch (e) {
                                console.error("Error updating:", e);
                                alert("Update failed: " + e.message);
                                setIsSaving(false);
                            }
                        }}
                        className={`w-full text-white font-bold py-4 rounded-2xl shadow-md border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wider text-sm ${isSaving ? 'bg-blue-400 cursor-wait' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                    >
                        {isSaving ? 'UPDATING...' : 'UPDATE'}
                    </button>

                </div>

            </div>
        </div>
    );
}
