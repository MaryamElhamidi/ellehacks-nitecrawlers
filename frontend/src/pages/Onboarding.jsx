import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Coins, Calendar, ArrowRight } from 'lucide-react';

export default function Onboarding() {
    const { setAllowance, setAllowanceFrequency, setHasOnboarded, setMoney, hasOnboarded } = useGame();
    const [amount, setAmount] = useState(50);
    const [frequency, setFrequency] = useState('weekly');
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false); // Add loading state

    // Auto-redirect if already onboarded
    useEffect(() => {
        if (hasOnboarded) {
            console.log("Redirecting to /scan because hasOnboarded is true");
            navigate('/scan', { replace: true });
        }
    }, [hasOnboarded, navigate]);

    return (
        <div className="flex flex-col h-full p-6 overflow-hidden">
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                        <Coins className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl ultra-bold text-stone-800 tracking-tight">Let's get started!</h1>
                    <p className="text-stone-500">Update your settings anytime.</p>
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
                                className="w-full pl-10 pr-4 py-4 bg-stone-50 text-3xl font-bold text-stone-800 rounded-2xl border-2 border-stone-200 focus:border-green-500 focus:outline-none transition-colors text-center"
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
                                    ? 'bg-white text-green-700 shadow-sm'
                                    : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                Weekly
                            </button>
                            <button
                                onClick={() => setFrequency('monthly')}
                                className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${frequency === 'monthly'
                                    ? 'bg-white text-green-700 shadow-sm'
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
                            console.log("Saving allowance...");

                            try {
                                const value = Number(amount);

                                // 1. Update React State (for UI consistency if we stayed)
                                setAllowance(value);
                                setAllowanceFrequency(frequency);
                                setMoney(value);
                                setHasOnboarded(true);

                                // 2. FORCE Manual Persistence (Bypass React State Async Delay)
                                // This guarantees data is saved before the page reloads
                                localStorage.setItem('nitecrawlers_allowance', JSON.stringify(value));
                                localStorage.setItem('nitecrawlers_allowanceFrequency', JSON.stringify(frequency));
                                localStorage.setItem('nitecrawlers_money', JSON.stringify(value));
                                localStorage.setItem('nitecrawlers_hasOnboarded', JSON.stringify(true));

                                console.log("Manual persistence complete. Forcing navigation...");

                                // 3. Aggressive Navigation
                                setTimeout(() => {
                                    console.log("Executing window.location.replace...");
                                    window.location.replace('/scan');
                                }, 200); // Short delay to let UI show "Saving..." briefly
                            } catch (e) {
                                console.error("CRITICAL ERROR IN SAVE:", e);
                                alert("Save failed: " + e.message);
                                setIsSaving(false);
                            }
                        }}
                        className={`w-full text-white font-bold py-4 rounded-2xl shadow-md border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wider text-sm ${isSaving ? 'bg-green-400 cursor-wait' : 'bg-green-500 hover:bg-green-600'
                            }`}
                    >
                        {isSaving ? 'SAVING...' : 'SAVE ALLOWANCE'}
                    </button>

                </div>

            </div>
        </div>
    );
}
