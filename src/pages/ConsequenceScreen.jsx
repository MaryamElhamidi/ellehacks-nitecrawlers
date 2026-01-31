import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, TrendingUp, Heart, Star } from 'lucide-react';
import { useGame } from '../context/GameContext';

const ConsequenceScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { growth, timeline } = useGame();

    const choice = location.state?.choice || 'daily';
    const result = location.state?.result || {
        message: "You made a choice.",
        moneyChange: 0,
        literacyChange: 0,
        growthChange: 0,
        timePassed: 0
    };

    // Visuals based on growth level
    const getGrowthVisual = (level) => {
        const visuals = ["🌱", "🌿", "🌳", "🏡", "🏰"];
        return visuals[Math.min(level, visuals.length - 1)];
    };

    // Theme based on choice
    const theme = {
        daily: { color: "bg-amber-100", text: "text-amber-600", border: 'border-amber-200' },
        weekly: { color: "bg-purple-100", text: "text-purple-600", border: 'border-purple-200' },
        skip: { color: "bg-green-100", text: "text-green-600", border: 'border-green-200' }
    }[choice] || { color: "bg-gray-100", text: "text-gray-600", border: 'border-gray-200' };

    return (
        <div className="flex flex-col h-full px-4 pt-6 space-y-4 overflow-y-auto">
            <button onClick={() => navigate(-1)} className="self-start text-stone-400 hover:text-stone-600 flex items-center space-x-1 text-sm font-bold">
                <ArrowLeft size={16} /> <span>Back</span>
            </button>

            {/* Main Visual - Result of Action */}
            <div className={`aspect-video rounded-[2rem] ${theme.color} flex flex-col items-center justify-center shadow-inner border-4 border-white mx-2 relative overflow-hidden group`}>
                <div className="text-8xl transform group-hover:scale-110 transition-transform duration-500 cursor-default select-none">
                    {getGrowthVisual(growth)}
                </div>
                <div className="absolute bottom-3 right-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-stone-500 shadow-sm flex items-center gap-1">
                    <Clock size={12} />
                    <span>Day {timeline}</span>
                </div>
            </div>

            {/* Explanation & Feedback */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-stone-100 animate-slide-up">
                <div className="flex items-start justify-between mb-2">
                    <h1 className="text-xl font-black text-stone-700 leading-tight">Effect</h1>
                    {result.growthChange > 0 && (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                            Island Growth!
                        </span>
                    )}
                </div>

                <p className="text-stone-500 leading-relaxed font-medium mb-6">
                    {result.message}
                </p>

                {/* Stat Changes */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-stone-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-stone-100">
                        <span className="text-stone-400 text-[10px] font-bold uppercase mb-1">Savings Impact</span>
                        <div className={`text-lg font-black ${result.moneyChange >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                            {result.moneyChange >= 0 ? '+' : ''}{result.moneyChange}
                        </div>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-stone-100">
                        <span className="text-stone-400 text-[10px] font-bold uppercase mb-1">Financial XP</span>
                        <div className="text-lg font-black text-blue-500">
                            +{result.literacyChange}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline / Progress Nudge */}
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                    <Star size={20} className="fill-current" />
                </div>
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">Milestone Check</h4>
                    <p className="text-blue-600 text-xs">You are {5 - growth} steps away from the next island upgrade!</p>
                </div>
            </div>

            {/* Parent Handoff Button */}
            <div className="flex-1 flex items-end pb-4 mt-2">
                <button
                    onClick={() => navigate('/parent')}
                    className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold p-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                    <Heart className="fill-current text-red-500" size={20} />
                    <span>Explain to Parent</span>
                </button>
            </div>
        </div>
    );
};

export default ConsequenceScreen;
