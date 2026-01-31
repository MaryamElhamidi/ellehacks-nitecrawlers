import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, TrendingUp, Heart } from 'lucide-react';

const ConsequenceScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const choice = location.state?.choice || 'daily';

    // Dynamic content based on choice
    const content = {
        daily: {
            title: "Taking a bit longer...",
            desc: "Spending daily means your island upgrades might have to wait a little.",
            visual: "🌱",
            visualColor: "bg-amber-100 text-amber-500",
            stats: { savings: "$0", time: "+2 months" }
        },
        weekly: {
            title: "Good balance!",
            desc: "You enjoy your treat but still save enough to grow your village.",
            visual: "🌿",
            visualColor: "bg-purple-100 text-purple-500",
            stats: { savings: "$120", time: "-2 weeks" }
        },
        skip: {
            title: "Super Saver!",
            desc: "Skipping adds up fast! Your island is booming with new decorations.",
            visual: "🌳",
            visualColor: "bg-green-100 text-green-500",
            stats: { savings: "$150", time: "Now!" }
        }
    }[choice];

    return (
        <div className="flex flex-col h-full px-4 pt-6 space-y-6">
            <button onClick={() => navigate(-1)} className="self-start text-stone-400 hover:text-stone-600 flex items-center space-x-1 text-sm font-bold">
                <ArrowLeft size={16} /> <span>Back</span>
            </button>

            {/* Visual Metaphor */}
            <div className={`aspect-square rounded-[3rem] ${content.visualColor} flex items-center justify-center text-9xl shadow-inner border-4 border-white mx-4`}>
                <span className="animate-bounce-slow">{content.visual}</span>
            </div>

            {/* Explanation */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-stone-100">
                <h1 className="text-2xl font-black text-stone-700 mb-2">{content.title}</h1>
                <p className="text-stone-500 leading-relaxed font-medium">{content.desc}</p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-stone-50 p-3 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-stone-400 text-xs font-bold uppercase mb-1">Savings</span>
                        <span className="text-xl font-black text-stone-700">{content.stats.savings}</span>
                    </div>
                    <div className="bg-stone-50 p-3 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-stone-400 text-xs font-bold uppercase mb-1">Goal Time</span>
                        <span className="text-xl font-black text-stone-700">{content.stats.time}</span>
                    </div>
                </div>
            </div>

            {/* Parent Handoff Button */}
            <div className="flex-1 flex items-end pb-4">
                <button
                    onClick={() => navigate('/parent')}
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold p-4 rounded-2xl shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center space-x-2"
                >
                    <Heart className="fill-current" size={20} />
                    <span>Explain to Parent</span>
                </button>
            </div>
        </div>
    );
};

export default ConsequenceScreen;
