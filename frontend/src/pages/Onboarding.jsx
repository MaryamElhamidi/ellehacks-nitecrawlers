import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Coins, Calendar, ArrowRight } from 'lucide-react';

export default function Onboarding() {
    const { setAllowance, setAllowanceFrequency, setHasOnboarded, setMoney } = useGame();
    const [amount, setAmount] = useState(50);
    const [frequency, setFrequency] = useState('weekly');
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-stone-100 p-6 overflow-hidden">
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">

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
                        <label className="text-sm ultra-bold text-stone-600 uppercase tracking-wider">Allowance Amount</label>
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
                        <label className="text-sm ultra-bold text-stone-600 uppercase tracking-wider">How often?</label>
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
                        onClick={() => {
                            const value = Number(amount);
                            setAllowance(value);
                            setAllowanceFrequency(frequency);
                            setMoney(value); // Update wallet as requested
                            setHasOnboarded(true);
                            alert("Allowance saved & Wallet updated!");
                        }}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-md border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wider text-sm"
                    >
                        Save allowance
                    </button>

                </div>

            </div>
            {/* Removed "Start" button as requested */}
        </div>
    );
}
