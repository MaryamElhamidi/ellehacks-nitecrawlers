import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, TrendingUp, Sparkles, Camera, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';

const ConsequenceScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { growth, timeline, money } = useGame();

    const choice = location.state?.choice || 'daily';
    const result = location.state?.result || {
        message: "You made a choice.",
        moneyChange: 0,
        literacyChange: 0,
        growthChange: 0,
        timePassed: 0,
        savingsPrediction: 0
    };
    const item = location.state?.item;

    // Visuals based on growth level
    const getGrowthVisual = (level) => {
        const visuals = ["🌱", "🌿", "🌳", "🏡", "🏰"];
        return visuals[Math.min(level, visuals.length - 1)];
    };

    // Theme based on choice
    const theme = {
        buy: { color: "bg-amber-100", text: "text-amber-600", border: 'border-amber-200', title: "Purchase Complete" },
        later: { color: "bg-purple-100", text: "text-purple-600", border: 'border-purple-200', title: "Added to Wishlist" },
        skip: { color: "bg-green-100", text: "text-green-600", border: 'border-green-200', title: "Savings Secured" }
    }[choice] || { color: "bg-gray-100", text: "text-gray-600", border: 'border-gray-200', title: "Result" };

    return (
        <div className="flex flex-col h-full px-4 pt-6 space-y-4 overflow-y-auto pb-6">

            {/* Main Visual - Result of Action */}
            <div className={`aspect-video rounded-[2rem] ${theme.color} flex flex-col items-center justify-center shadow-inner border-4 border-white mx-2 relative overflow-hidden group`}>
                <div className="text-8xl transform group-hover:scale-110 transition-transform duration-500 cursor-default select-none animate-bounce-slow">
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
                    <h1 className="text-xl font-black text-stone-700 leading-tight">{theme.title}</h1>
                    {result.growthChange > 0 && (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                            <Sparkles size={10} /> Island Growth!
                        </span>
                    )}
                </div>

                <p className="text-stone-500 leading-relaxed font-medium mb-6">
                    {result.message}
                </p>

                {/* Stat Changes */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-stone-50 p-3 rounded-2xl flex flex-col items-center justify-center border border-stone-100">
                        <span className="text-stone-400 text-[10px] font-bold uppercase mb-1">Balance</span>
                        <div className={`text-lg font-black ${result.moneyChange >= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                            {result.moneyChange !== 0 ? (result.moneyChange > 0 ? '+' : '') + result.moneyChange : 'No Change'}
                            <span className="text-xs text-stone-400 font-normal block mt-1">Current: ${money}</span>
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

            {/* Future Prediction (Only for Skips) */}
            {result.savingsPrediction > 0 && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-3xl shadow-lg text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-90">
                            <TrendingUp size={16} />
                            <span className="text-sm font-bold uppercase tracking-wide">Future Outlook</span>
                        </div>
                        <p className="font-medium text-blue-50 leading-relaxed">
                            If you skip this <strong>{item?.name}</strong> just 3 more times, you'll save an extra <strong>${result.savingsPrediction}</strong> this month!
                        </p>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                </div>
            )}

            {/* Next Steps */}
            <div className="pt-4 space-y-3">
                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-stone-800 hover:bg-stone-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Camera className="w-5 h-5" />
                    <span>Scan Next Item</span>
                </button>

                <button
                    onClick={() => navigate('/parent')}
                    className="w-full bg-white hover:bg-stone-50 text-stone-600 font-bold py-3 px-6 rounded-2xl border border-stone-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <span>View Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ConsequenceScreen;
