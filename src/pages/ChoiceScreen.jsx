import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, Calendar, Ban } from 'lucide-react';

const ChoiceCard = ({ title, sub, icon: Icon, color, onClick }) => (
    <button
        onClick={onClick}
        className="w-full bg-white p-4 rounded-3xl shadow-sm border border-stone-100 hover:scale-[1.02] active:scale-[0.98] transition-all text-left flex items-center space-x-4 group"
    >
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
            <Icon className="text-white w-7 h-7" />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-stone-700 text-lg">{title}</h3>
            <p className="text-stone-400 text-sm font-medium">{sub}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-stone-300">
            <ArrowRight />
        </div>
    </button>
)

const ChoiceScreen = () => {
    const navigate = useNavigate();

    const handleChoice = (choice) => {
        // Pass choice state if needed in real app
        navigate('/consequence', { state: { choice } });
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in px-2">
            {/* Scanned Item Header */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] shadow-sm text-center transform -rotate-1 relative mx-2 mt-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-3 shadow-inner">
                    <Coffee className="w-10 h-10 text-amber-600" />
                </div>
                <h1 className="text-2xl font-black text-stone-700 tracking-tight">Coffee Subscription</h1>
                <p className="text-stone-500 font-medium">$5.00 / day</p>

                {/* Label Tag */}
                <div className="absolute -top-3 -right-3 bg-red-400 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm rotate-12">
                    Recurring!
                </div>
            </div>

            <div className="px-4">
                <h2 className="text-stone-500 font-bold ml-2 mb-3 text-sm uppercase tracking-wider">What would you do?</h2>
                <div className="space-y-3">
                    <ChoiceCard
                        title="Buy Daily"
                        sub="Spend $150 / month"
                        icon={Coffee}
                        color="bg-amber-400"
                        onClick={() => handleChoice('daily')}
                    />
                    <ChoiceCard
                        title="Buy Weekly"
                        sub="Treat yourself once"
                        icon={Calendar}
                        color="bg-purple-400"
                        onClick={() => handleChoice('weekly')}
                    />
                    <ChoiceCard
                        title="Skip for now"
                        sub="Save for something big"
                        icon={Ban}
                        color="bg-green-400"
                        onClick={() => handleChoice('skip')}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChoiceScreen;
